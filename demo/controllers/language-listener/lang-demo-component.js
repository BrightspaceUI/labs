import { html, LitElement } from 'lit';
import { LanguageListenerController } from '../../../src/controllers/language-listener/language-listener.js';

class DemoLangListenerComp extends LitElement {

	constructor() {
		super();
		this.langController = new LanguageListenerController(this);
	}

	render() {
		return html`
			<p>${this._message(this.langController.language)}</p>
		`;
	}

	_message(language) {
		switch (language.toLocaleLowerCase()) {
			case 'en':
				return 'Hello World';
			case 'fr-ca':
				return 'Bonjour Monde!';
			case 'es-mx':
				return 'Hola Mundo';
			default:
				return 'Hello World';
		}
	}
}

customElements.define('demo-lang-listener', DemoLangListenerComp);
