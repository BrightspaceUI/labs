
import '../../../src/components/community/community-link.js';
import '../../../src/components/community/community-button.js';
import { expect, fixture, html } from '@brightspace-ui/testing';
import { langArticleMap } from './community-url-factory.test.js';

const opts = { viewport: { height: 450 } };

describe('community', () => {
	it('link', async() => {
		const elm = await fixture(
			html`<d2l-labs-community-link
				article-map="${JSON.stringify(langArticleMap)}"
				text="Link To Community"
			></d2l-labs-community-link>`
			, opts);
		await expect(elm).to.be.golden();
	});

	it('button', async() => {
		const elm = await fixture(
			html`<d2l-labs-community-button
				article-map="${JSON.stringify(langArticleMap)}"
				text="Link To Community"
			></d2l-labs-community-button>`
			, opts);
		await expect(elm).to.be.golden();
	});
});
