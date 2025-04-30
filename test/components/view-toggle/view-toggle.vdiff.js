import '../../../src/components/view-toggle/view-toggle.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

const basicFixture = html`<d2l-labs-view-toggle
toggle-options='[{"text":"Bananas","val":"overall"},{"text":"Minions","val":"minios"},{"text":"Pyjamas","val":"subject"}]'
text="Toggle: "></d2l-labs-view-toggle>`;

const noWrapFixture = html`<d2l-labs-view-toggle
toggle-options='[{"text":"Bananas","val":"overall"},{"text":"Minions","val":"minios"},{"text":"Pyjamas","val":"subject"},{"text":"Elephant","val":"longmemory"},{"text":"Tiger","val":"fast"}]'
text="Toggle: "></d2l-labs-view-toggle>`;

const viewports = [
	{ viewport: { height: 800, width: 1230 } },
	{ viewport: { height: 800, width: 865 } },
	{ viewport: { height: 800, width: 767 } },
	{ viewport: { height: 800, width: 614 } },
	{ viewport: { height: 800, width: 430 } }
];

describe('d2l-labs-view-toggle', () => {
	it('should not wrap', async() => {
		const el = await fixture(noWrapFixture);
		await expect(el).to.be.golden();
	});

	describe('viewports', () => {
		for (const viewport of viewports) {
			it(`should render on ${viewport.width}px width`, async() => {
				const el = await fixture(basicFixture, { viewport: viewport.viewport });
				await expect(el).to.be.golden();
			});
		}
	});

	describe('rtl', () => {
		it('should render right to left', async() => {
			const el = await fixture(basicFixture, { rtl: true });
			await expect(el).to.be.golden();
		});
	});
});
