import polyglot from 'node-polyglot';
import translations from 'assets/language/translations';

export default class Translator {
    static getLang() {
        return { key: Translator.lang, name: Translator.get('lang_name') };
    }

    static getPossibleLanguages() {
        return Object.keys(translations).map(langKey => ({ key: langKey, name: translations[langKey].lang_name }));
    }

    static setLang(lang) {
        Translator.lang = lang ? lang.toLowerCase() : 'fi';
        Translator._loadPhrases();
        document.querySelector('html').setAttribute('lang', lang ? lang.toLowerCase() : 'fi');
    }

    static _loadPhrases() {
        Translator.polyglot = new polyglot({ phrases: translations });
    }

    static get(word, params) {
        if (!Translator.polyglot) {
            Translator.setLang('fi');
        }
        return Translator.polyglot.t(`${this.lang}.${word}`, params);
    }
}
