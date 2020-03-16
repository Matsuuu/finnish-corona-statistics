import { LitElement, html } from 'lit-element';
import 'src/app/views/corona-monitor';

class CoronaMonitorRoot extends LitElement {
    static get properties() {
        return {};
    }

    render() {
        return html`
            <corona-monitor></corona-monitor>
        `;
    }
}

if (!customElements.get('corona-monitor-root')) {
    customElements.define('corona-monitor-root', CoronaMonitorRoot);
}
