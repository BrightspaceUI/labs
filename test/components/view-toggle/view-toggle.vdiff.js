import '../../../src/components/view-toggle/view-toggle.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

const basicFixture = html`<d2l-labs-view-toggle
toggle-options='[{"text":"Bananas","val":"overall"},{"text":"Minions","val":"minios"},{"text":"Pyjamas","val":"subject"}]'
text="Toggle: "></d2l-labs-view-toggle>`;

describe('d2l-labs-view-toggle', () => {
	it('should render', async() => {
		const el = await fixture(basicFixture);
		await expect(el).to.be.golden();
	});

	it('should not wrap', async() => {
		const el = await fixture(basicFixture, { viewport: { height: 800, width: 430 } });
		await expect(el).to.be.golden();
	});

	describe('rtl', () => {
		it('should render right to left', async() => {
			const el = await fixture(basicFixture, { rtl: true });
			await expect(el).to.be.golden();
		});
	});
});
