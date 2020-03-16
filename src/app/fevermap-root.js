import { LitElement, html } from 'lit-element';
import 'src/app/views/fevermap-landing';
import 'src/app/components/fevermap-navigation';
import 'src/app/components/material-icon';

class FevermapRoot extends LitElement {
    static get properties() {
        return {};
    }

    render() {
        return html`
            <fevermap-landing></fevermap-landing>
            <fevermap-navigation></fevermap-navigation>
        `;
    }
    createRenderRoot() {
        return this;
    }
}

if (!customElements.get('fevermap-root')) {
    customElements.define('fevermap-root', FevermapRoot);
}
