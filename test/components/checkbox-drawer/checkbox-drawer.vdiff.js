import '../../../src/components/checkbox-drawer/checkbox-drawer.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('checkbox-drawer', () => {
	it('collapsed', async() => {
		await fixture(html`<d2l-labs-checkbox-drawer label="This is a collapsed checkbox drawer"></d2l-labs-checkbox-drawer>`);
		await expect(document).to.be.golden();
	});

	it('expanded', async() => {
		await fixture(html`<d2l-labs-checkbox-drawer label="This is an expanded checkbox drawer" checked description="This is the description that is on revealed when expanded"></d2l-labs-checkbox-drawer>`);
		await expect(document).to.be.golden();
	});

	it('collapsed in read-only mode', async() => {
		await fixture(html`<d2l-labs-checkbox-drawer label="This is a collapsed checkbox drawer in read-only mode" read-only></d2l-labs-checkbox-drawer>`);
		await expect(document).to.be.golden();
	});

	it('expanded in read-only mode', async() => {
		await fixture(html`<d2l-labs-checkbox-drawer label="This is an expanded checkbox drawer in read-only mode" checked description="This is the description that is on revealed when expanded" read-only></d2l-labs-checkbox-drawer>`);
		await expect(document).to.be.golden();
	});
});
