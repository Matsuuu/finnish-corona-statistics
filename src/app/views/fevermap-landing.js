import { LitElement, html, css } from 'lit-element';
import Translator from '../util/translator';

class FevermapLanding extends LitElement {
    static get properties() {
        return {};
    }

    static get styles() {
        return [];
    }

    constructor() {
        super();
    }

    firstUpdated(_changedProperties) {
        this.setLang();
    }

    setLang() {
        let setLangInStorage = localStorage.getItem('USER_SET_LANG');
        let lang = setLangInStorage ? setLangInStorage : navigator.language;
        if (lang.includes('-')) {
            lang = lang.split('-')[0];
        }
        if (
            !Translator.getPossibleLanguages()
                .map(lang => lang.key)
                .includes(lang)
        ) {
            console.error(`Lang ${lang} not found. Defaulting to English.`);
            lang = 'en';
        }
        Translator.getPossibleLanguages();
        Translator.setLang(lang);
        localStorage.setItem('USER_SET_LANG', lang);
    }

    handleLanguageChange(e) {
        let selectedLang = e.target.value;
        localStorage.setItem('USER_SET_LANG', selectedLang);
        Translator.setLang(selectedLang);
        window.location.reload();
    }

    render() {
        return html`
            <div class="language-switcher">
                <p>${Translator.get('language')}</p>
                <select id="language-selector" @change="${this.handleLanguageChange}"
                    ><option value="${Translator.getLang().key}">${Translator.getLang().name}</option>
                    ${Translator.getPossibleLanguages().map(lang => {
                        if (lang.key === Translator.lang) {
                            return;
                        }
                        return html`
                            <option value="${lang.key}">${lang.name}</option>
                        `;
                    })}</select
                >
            </div>
            <div class="container">
                <h1>Fever Map</h1>
                <div class="about mb-4">
                    <h2>About</h2>
                    <p>
                        <b>Fevermap</b> is a web application created for simple fever data collection in the Coronavirus
                        epidemic.
                    </p>
                    <p>
                        Current methods of tracking the spread of the Corona virus do not yield a complete picture. It
                        is far to slow and cumbersome to test everybody, and there isn't enough tests anyway.
                    </p>
                    <p>
                        The Fever Map is an effort to fix this by having ordinary people around the world self-report
                        their fever. Using biological population methods we can estimate the prevalence of COVID-19
                        infections in real-time and provide authorities with data that helps them fight the pandemic.
                    </p>
                    <p>
                        The data collected by Fevermap is anonymized and will be used to help with raising awareness of
                        the current global situation.
                    </p>
                </div>
                <div class="participation mb-4">
                    <h2>How do I participate?</h2>
                    <p>
                        To participate, you need to measure your own body temperature, and submit it with a few other
                        pieces of information at the <a href="">form here</a>.
                    </p>
                    <p>We will not ask you for any data, that could be used to identify you. We value your privacy.</p>
                </div>
                <div class="data-use">
                    <h2>How will my data be used?</h2>
                    <p>Information about data use</p>
                </div>
            </div>
        `;
    }
    createRenderRoot() {
        return this;
    }
}

if (!customElements.get('fevermap-landing')) {
    customElements.define('fevermap-landing', FevermapLanding);
}
