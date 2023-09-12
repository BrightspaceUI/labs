import '../../../src/components/community/community-link.js';

import { expect, fixture } from '@brightspace-ui/testing';
import { defineCE } from '@open-wc/testing';
import { getDocumentLocaleSettings } from '@brightspace-ui/intl/lib/common.js';
import { LanguageListenerController } from '../../../src/controllers/language-listener/language-listener.js';
import { LitElement } from 'lit';

const localeSettings = getDocumentLocaleSettings();

const exampleElm = defineCE(class extends LitElement {
	constructor() {
		super();
		this.langController = new LanguageListenerController(this);
	}
});

describe('LanguageListenerController', () => {
	it('Should get the current language', () => {
		const host = { addController: () => {} };
		const langListener = new LanguageListenerController(host);
		expect(langListener.language).to.equal('en');
	});

	it('Should change when the document language changes', async() => {
		const elm = await fixture(`<${exampleElm}></${exampleElm}>`, { lang: 'fr' });
		expect(elm.langController.language).to.equal('fr');
		localeSettings.language = 'en';
		expect(elm.langController.language).to.equal('en');
	});
});
