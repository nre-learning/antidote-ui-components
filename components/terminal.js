import { html } from 'lit-html';
import { component, useRef } from 'haunted';
import useSSH from '../helpers/use-ssh.js';

//const sshStyle = {};

function AntidoteTerminal({ host, port }) {
  const terminalContainer = useRef(document.createElement('div'));

  terminalContainer.current.id = 'term-target';

  this._ssh = useSSH({ host, port, terminalContainer: terminalContainer.current });
  this.run = this._ssh.run;
  this.focusTerminal = this._ssh.focus;

  return html`
    <link rel="stylesheet" href="http://127.0.0.1:8081/dist/styles.css" />
    <!-- todo: ... move this into NRE styles. tough call -->
    <link rel="stylesheet" href="/css/xterm.css" />
    <!-- todo: show reconnection state if available. distinguish between reconnectable and unreconnectable errors  -->
    <!-- todo: distinguish between "appropriate" connection closure and error -->
    ${this._ssh.error ? html `
        <div class="error">
          <h1>Terminal connection closed</h1>
          ${this._ssh.error.message ? html`<p>${this._ssh.error.message}</p>` : ''}  
        </div>          
    ` : ''}
    ${terminalContainer.current}  
`;
}

AntidoteTerminal.observedAttributes = ["host", "port"];

customElements.define('antidote-terminal', component(AntidoteTerminal));

export default AntidoteTerminal;
