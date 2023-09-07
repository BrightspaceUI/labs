import '../../../src/components/link-community/link-community.js';
import { expect, fixture, html } from '@brightspace-ui/testing';
import { getDocumentLocaleSettings } from '@brightspace-ui/intl/lib/common.js';

const langArticleMap = {
	'en': 4545,
	'ar-SA': 10489,
	'es-MX': 9214,
	'pt-BR': 9978,
	'nl-NL': 7833,
	'fr-CA': 6739
};

const langUrlMap = {
	'en': 'https://community.d2l.com/brightspace/kb/articles/4545',
	'ar-SA': 'https://community.d2l.com/brightspace-ar-SA/kb/articles/10489',
	'es-MX': 'https://community.d2l.com/brightspace-es-MX/kb/articles/9214',
	'pt-BR': 'https://community.d2l.com/brightspace-pt-BR/kb/articles/9978',
	'nl-NL': 'https://community.d2l.com/brightspace-nl-NL/kb/articles/7833',
	'fr-CA': 'https://community.d2l.com/brightspace-fr-CA/kb/articles/6739'
};

describe('community link', () => {
	Object.keys(langArticleMap).map((langCode) => {
		it(`Should have the right link for each lang code ${langCode}`, async() => {
			getDocumentLocaleSettings().language = langCode;
			const communityLink = await fixture(html`<d2l-labs-link-community type="link" text="Help" article-map=${JSON.stringify(langArticleMap)}></d2l-labs-link-community>`);
			expect(communityLink.link).to.equal(langUrlMap[langCode]);
		});
	});

	Object.keys(langArticleMap).map((langCode) => {
		it(`Should find the closest match for each lang code ${langCode}`, async() => {
			const regionlessLang = langCode.split('-')[0];
			getDocumentLocaleSettings().language = regionlessLang;
			const communityLink = await fixture(html`<d2l-labs-link-community type="link" text="Help" article-map=${JSON.stringify(langArticleMap)}></d2l-labs-link-community>`);
			expect(communityLink.link).to.equal(langUrlMap[langCode]);
		});
	});

	it("Should default to english if the lang code doesn't match", async() => {
		getDocumentLocaleSettings().language = 'zh-tw';
		const communityLink = await fixture(html`<d2l-labs-link-community type="link" text="Help" article-map=${JSON.stringify(langArticleMap)}></d2l-labs-link-community>`);
		expect(communityLink.link).to.equal(langUrlMap['en']);
	});

	it('Should have a button variant', async() => {
		getDocumentLocaleSettings().language = 'en';
		const communityLink = await fixture(html`<d2l-labs-link-community type="button" text="Help" article-map=${JSON.stringify(langArticleMap)}></d2l-labs-link-community>`);
		expect(communityLink.shadowRoot.querySelector('d2l-button-subtle')).to.exist;
	});

	it('Should default to link variant', async() => {
		getDocumentLocaleSettings().language = 'en';
		const communityLink = await fixture(html`<d2l-labs-link-community text="Help" article-map=${JSON.stringify(langArticleMap)}></d2l-labs-link-community>`);
		expect(communityLink.shadowRoot.querySelector('d2l-link')).to.exist;
	});
});
