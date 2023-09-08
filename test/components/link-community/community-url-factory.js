import '../../../src/components/community/community-button.js';
import '../../../src/components/community/community-link.js';
import { communityUrlFactory } from '../../../src/components/community/community-url-factory.js';
import { expect } from '@brightspace-ui/testing';

export const langArticleMap = {
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

let directive;
describe('community url factory', () => {

	before(() => {
		directive = communityUrlFactory(langArticleMap);
	});
	Object.keys(langArticleMap).map((lang) => {
		it(`Should have the right link for each lang code ${lang}`, async() => {
			expect(directive[lang]).to.equal(langUrlMap[lang]);
		});
	});

	Object.keys(langArticleMap).map((lang) => {
		it(`Should find the closest match for each lang code ${lang}`, async() => {
			const regionlessLang = lang.split('-')[0];
			expect(directive(regionlessLang)).to.equal(langUrlMap[lang]);
		});
	});

	it('Should return a directive', async() => {
		expect(typeof communityUrlFactory(langArticleMap) === 'function').to.be.true;
	});

	it("Should default to english if the lang code doesn't match", async() => {
		const lang = 'zh-tw';
		expect(directive[lang]).to.equal(langUrlMap['en']);
	});
});
