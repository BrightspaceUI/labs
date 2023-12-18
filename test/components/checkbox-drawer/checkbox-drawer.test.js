import '../../../src/components/checkbox-drawer/checkbox-drawer.js';
import { expect, fixture, html, oneEvent } from '@brightspace-ui/testing';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';

function getInputCheckbox(component) {
	return component.shadowRoot.querySelector('d2l-input-checkbox');
}

describe('checkbox-drawer', () => {

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-labs-checkbox-drawer');
		});
	});

	describe('accessibility', () => {
		[false, true].forEach(checked => {
			it(`should pass all aXe tests (${!checked ? 'un' : ''}checked)`, async() => {
				const el = await fixture(html`<d2l-labs-checkbox-drawer label="Label" ?checked=${checked}></d2l-labs-checkbox-drawer>`);
				await expect(el).to.be.accessible();
			});
		});
	});

	describe('events', () => {
		[ false, true ].forEach(checked => {
			const action = checked ? 'collapse' : 'expand';

			it(`should fire "d2l-checkbox-drawer-checked-change" event when ${!checked ? 'un' : ''}checked input element is clicked`, async() => {
				const component = await fixture(html`<d2l-labs-checkbox-drawer label="Label" ?checked=${checked}></d2l-labs-checkbox-drawer>`);
				const listener = oneEvent(component, 'd2l-checkbox-drawer-checked-change');

				getInputCheckbox(component).simulateClick();
				const { detail } = await listener;
				expect(detail.checked).to.equal(!checked);
				expect(component.checked).to.equal(!checked);

				const innerCheckbox = component.shadowRoot.querySelector('d2l-input-checkbox');
				expect(innerCheckbox.description).to.equal(checked ? 'Checkbox collapsed' : 'Checkbox expanded');
			});

			it(`should fire "d2l-checkbox-drawer-${action}" event when ${!checked ? 'un' : ''}checked input element is clicked`, async() => {
				const component = await fixture(html`<d2l-labs-checkbox-drawer label="Label" ?checked=${checked}></d2l-labs-checkbox-drawer>`);
				const listener = oneEvent(component, `d2l-checkbox-drawer-${action}`);

				getInputCheckbox(component).simulateClick();
				const { detail } = await listener;
				expect(detail[`${action}Complete`]).to.exist;
			});
		});
	});
});
