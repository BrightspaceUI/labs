import '../../../src/components/community/community-link.js';

import { expect, fixture, html } from '@brightspace-ui/testing';
import { getDocumentLocaleSettings } from '@brightspace-ui/intl/lib/common.js';
import { langArticleMap } from '../../components/link-community/community-url-factory.test.js';
import { LanguageListenerController } from '../../../src/controllers/language-listener/language-listener.js';

const localeSettings = getDocumentLocaleSettings();

describe('LanguageListenerController', () => {
	it('Should get the current language', () => {
		const host = { addController: () => {} };
		const langListener = new LanguageListenerController(host);
		expect(langListener.language).to.equal('en');
	});

	it('Should change based on the document language', async() => {
		// using en example element here for host updating features
		const elm = await fixture(html`<d2l-labs-community-link article-map="${JSON.stringify(langArticleMap)}"></d2l-labs-community-link>`);
		localeSettings.language = 'fr';
		expect(elm.langController.language).to.equal('fr');
	});
});
