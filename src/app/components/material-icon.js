import { LitElement, html } from 'lit-element';

class MaterialIcon extends LitElement {
    static get properties() {
        return {
            icon: { type: String },
        };
    }

    constructor() {
        super();
    }

    render() {
        return html`
            <span class="material-icons">${this.icon}</span>
        `;
    }
    createRenderRoot() {
        return this;
    }
}

if (!customElements.get('material-icon')) {
    customElements.define('material-icon', MaterialIcon);
}
