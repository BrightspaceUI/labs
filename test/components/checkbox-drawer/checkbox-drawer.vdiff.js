import '../../../src/components/checkbox-drawer/checkbox-drawer.js';
import { expect, fixture, hoverElem, html } from '@brightspace-ui/testing';

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

	it('disabled with tooltip', async() => {
		const component = await fixture(html`<d2l-labs-checkbox-drawer label="This is a disabled checkbox drawer with a tooltip" disabled disabled-tooltip="This option is disabled."></d2l-labs-checkbox-drawer>`);
		hoverElem(component.shadowRoot.querySelector('.d2l-input-checkbox'));
		await expect(document).to.be.golden();
	});

	it('disabled without tooltip', async() => {
		const component = await fixture(html`<d2l-labs-checkbox-drawer label="This is a disabled checkbox drawer without a tooltip" disabled></d2l-labs-checkbox-drawer>`);
		hoverElem(component.shadowRoot.querySelector('.d2l-input-checkbox'));
		await expect(document).to.be.golden();
	});
});
