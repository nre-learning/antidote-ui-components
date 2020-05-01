import { html } from 'lit-html';
import { component, useRef } from 'haunted';
import useSSH from '../helpers/use-ssh.js';
import getComponentStyleSheetURL from '../helpers/stylesheet';

//const sshStyle = {};

function AntidoteTerminal({ host, port, user, pass }) {
  const terminalContainer = useRef(document.createElement('div'));

  terminalContainer.current.id = 'term-target';

  this._ssh = useSSH({ host, port, user, pass, terminalContainer: terminalContainer.current });
  this.run = this._ssh.run;
  this.focusTerminal = this._ssh.focus;

  return html`
    <link rel="stylesheet" href=${getComponentStyleSheetURL(this)} />
    <!-- todo: show reconnection state if available. distinguish between reconnectable and unreconnectable errors  -->
    <!-- todo: distinguish between "appropriate" connection closure and error -->
    ${this._ssh.error ? html `
        <div class="error">
          <h1>Terminal connection closed</h1>
          <h3>Refresh page to reconnect</h3>
          ${this._ssh.error.message ? html`<p>${this._ssh.error.message}</p>` : ''}  
        </div>          
    ` : ''}
    ${terminalContainer.current}
    <div id="term-helper"><p>Copy: (Ctrl+Insert)</p></div>
`;
}

AntidoteTerminal.observedAttributes = ["host", "port", "user", "pass"];

customElements.define('antidote-terminal', component(AntidoteTerminal));

export default AntidoteTerminal;
