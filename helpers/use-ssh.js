// manages the state of a socket.io webssh2 connection and an associated xterm.js terminal.
// returns a state object that represents the current state of these objects and includes methods
// to interact with them

import ResizeObserver from 'resize-observer-polyfill';
import { sshServiceHost } from './page-state';
import { useEffect, useReducer, useRef } from 'haunted';
import { FitAddon } from "xterm-addon-fit";
import { Terminal } from "xterm";
import debounce from "./debounce";
import io from 'socket.io-client/dist/socket.io.slim';

const baseState = {
  connecting: false,
  connected: false,
  disconnected: false,
  error: null,
};

// todo: only handle the ones we need and switch to individual handlers rather than mono-handler
const socketEventNames = [
  'connect',
  'ssherror',
  'error',
  'data',
  'setTerminalOpts',
  'title',
  'status',
  'headerBackground',
  'statusBackground',
  'header',
  'footer',
  'disconnect',
  'reauth',
  'allowreplay',
  'allowreauth',
  'menu'
];

function initResizeHandler(tab, doResize) {
  const resizeObserver = new ResizeObserver(doResize);
  resizeObserver.observe(tab);
  return () => resizeObserver.unobserve(tab);
}

// sets up terminal & handlers for events generated by the terminal
function initTerminal(terminalRef, terminalContainer, socketRef) {
  function onData(data) {
    socketRef.current.emit('data', data)
  }
  // send backend resize message
  const sendResize = debounce(() => {
    fitAddon.fit();
    socketRef.current.emit('resize', { cols: terminalRef.current.cols, rows: terminalRef.current.rows })
  }, 150);

  const fitAddon = new FitAddon();
  terminalRef.current = new Terminal({
    screenReaderMode: true,
    theme: {
      background: '#262c2c',
    }
  });
  terminalRef.current.loadAddon(fitAddon);
  terminalRef.current.open(terminalContainer);
  terminalRef.current.onData(onData);
  fitAddon.fit();

  if (!window.terminalRef) {
    window.terminalRef = terminalRef;
  }

  const removeResizeHandler = initResizeHandler(terminalContainer.getRootNode().host, sendResize);

  return () => {
    // todo: tear down terminal when component is being re-rendered / unrendered
    removeResizeHandler();
  }
}

// this function is the connection initializer. it:
// - opens a new socket
// - wires up events to fire actions that modifies the state via dispatch
function initConnection(host, port, socket, terminal, dispatch) {
  socket.current = io(sshServiceHost, {resource: 'ssh/host/socket.io', query: {host, port}});
  socket.current.on("connect", () => dispatch({type: 'open'}));
  socket.current.on("disconnect", (reason) => {
    // todo: identify when a close isn't an error?
    dispatch({type: 'error', data: reason})
  });

  for (const eventName of socketEventNames) {
    socket.current.on(eventName, getSocketEventHandler(eventName, terminal, socket, dispatch));
  }

  dispatch({ type: 'initialize' });

  return () => {
    // todo: tear down connection when component is being re-rendered / unrendered
  }
}

// create a new initialized state for an SSH connection
function createInitialState(socketRef, terminalRef) {
  // create a new object, copy the base state properties, and add the SSH state interface methods
  return Object.assign({}, baseState,{
    run: (text) => {
      const nak = "\u0015"; // clear line
      socketRef.current.emit('data', nak+text);
    },
    focus: () => {
      terminalRef.current.focus();
    }
  });
}

// returns a function that handles socket.io events, including updating the connection state by dispatching actions
// could be refactored into multiple handlers but i find this consolidation convenient
// todo: break this up
function getSocketEventHandler(eventName, terminal, socket, dispatch) {
  return function handleSocketEvent(data) {
    const t = terminal.current;

    switch (eventName) {
      case 'connect':
        socket.current.emit('geometry', t.cols, t.rows);
        return null;
      case 'ssherror':
      case 'error':
        return dispatch({ type: 'error', data });
      case 'data':
        t.write(data);
        return null;

      case 'setTerminalOpts':
        // todo: store terminal ops in local storage and ignore this?
        const opts = ['cursorBlink', 'scrollBack', 'tabStopWidth', 'bellStyle'];
        for (const opt in opts) {
          if (data[opt] !== undefined) {
            t.setOption(opt, data[opt]);
          }
        }
        return null;

      // imo most of the event types that follow aren't things we _should_ handle, even though WebSSH2 is sending them.
      // i.e the string to print in particular scenario shouldn't be implemented by the server. the server should
      // communicate what the scenario is to the client and let the client determine how to communicate that to the user.

      case 'title': // `data` is a title string, typically a URI like "ssh://10.109.99.12"
      case 'status': // `data` is a status string like "SSH CONNECTION ESTABLISHED"
      case 'headerBackground': // `data` is a header background color string like "green"
      case 'statusBackground': // `data` is a header background color string like "green"
      case 'header': // `data` is a header text string, typically a URI like "ssh://10.109.99.12"
      case 'footer': // `data` is a footer text string, typically a URI like "ssh://antidote@10.109.99.12:22"
      // todo: answer what the rest of these events are.
      case 'disconnect':
      case 'reauth':
      case 'allowreplay':
      case 'allowreauth':
      case 'menu':
        // unsupported webssh socket event occured
        return;
      default:
        // unknown webssh socket event occured
        return;
    }
    return null;
  }
}

// returns an object representing the state of the ongoing socket.io ssh connection
// also makes a "pre-flight" GET request needed to set up the session variables in the webssh2 backend
export default function useSSH({ host, port, terminalContainer }) {
  const socket = useRef(null);
  const terminal = useRef(null);
  // track current connection state and provide dispatch function to make changes to current state
  const [sshConnectionState, dispatch] = useReducer(function sshActionReducer(state, action) {
    let changedProps = {};

    switch (action.type) {
      case 'initialize': // socket has been (re)created
        return Object.assign({}, state, baseState,{ connecting: true });

      case 'open': // socket has connected
        return Object.assign({}, state, { connecting: false, connected: true });

      case 'error': // socket has encountered an error
        const error = action.data instanceof Error ? action.data : new Error(`useSSH: WebSSH server encountered an error: ${action.data}`);
        //console.error(error.stack);
        // todo: should this close the connection?
        return Object.assign({}, state, { error : action.data });

      case 'close': // socket has closed
        changedProps = { connected: false, disconnected: true };
        if (action.data) {
          changedProps.error = new Error(`useSSH: Socket.io connection encountered an error and closed. Error message: "${action.data}."`);
        }
        return Object.assign({}, state, changedProps);

      default: // unexpected message passed to reducer
        // todo: should probably throw error
        console.log(`useSSH - state reducer received unexpected action type "${action.type}"`);
        return state;
    }
  }, createInitialState(socket, terminal));

  // init connection whenever host & port change and are both defined
  useEffect(() => {
    if (host && port) {
      initConnection(host, port, socket, terminal, dispatch);
    }
  }, [host, port]);

  // init terminal once for the lifetime of this component
  useEffect(() => {
    const cleanupTerminal = initTerminal(terminal, terminalContainer, socket);
    return () => {
      cleanupTerminal();
    }
  }, []);

  return sshConnectionState
}
