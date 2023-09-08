
import '../../../src/components/community/link-community.js';
import '../../../src/components/community/button-community.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

const opts = { viewport: { height: 450 } };

const langArticleMap = {
	'en': 4545,
	'ar-SA': 10489,
	'es-MX': 9214,
	'pt-BR': 9978,
	'nl-NL': 7833,
	'fr-CA': 6739
};

describe('link-community', () => {
	it('Should render a link in link mode', async() => {
		await fixture(
			html`<d2l-labs-link-community
				article-map="${JSON.stringify(langArticleMap)}"
				text="Link To Community"
			></d2l-labs-link-community>`
			, opts);
		await expect(document).to.be.golden();
	});

	it('Should render a button in button mode', async() => {
		await fixture(
			html`<d2l-labs-button-community
				article-map="${JSON.stringify(langArticleMap)}"
				text="Link To Community"
			></d2l-labs-button-community>`
			, opts);
		await expect(document).to.be.golden();
	});
});
