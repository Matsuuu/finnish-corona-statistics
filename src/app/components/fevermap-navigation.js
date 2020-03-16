import { LitElement, html } from 'lit-element';

class FevermapNavigation extends LitElement {
    static get properties() {
        return {};
    }

    render() {
        return html`
            <div class="fevermap-navigation-wrapper mdc-elevation--z3">
                <div class="fevermap-navigation-block fevermap-navigation-block--selected" id="about">
                    <material-icon icon="info"></material-icon>
                    <p>About</p>
                </div>
                <div class="fevermap-navigation-block" id="poll">
                    <material-icon icon="add_comment"></material-icon>
                    <p>Data Entry</p>
                </div>
                <div class="fevermap-navigation-block" id="stats">
                    <material-icon icon="assessment"></material-icon>
                    <p>Statistics</p>
                </div>
            </div>
        `;
    }

    createRenderRoot() {
        return this;
    }
}

if (!customElements.get('fevermap-navigation')) {
    customElements.define('fevermap-navigation', FevermapNavigation);
}
