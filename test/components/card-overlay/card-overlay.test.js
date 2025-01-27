import '../../../src/components/card-overlay/card-overlay.js';
import { expect, fixture, html, runConstructor } from '@brightspace-ui/testing';

describe('CardOverlay', () => {

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-labs-card-overlay');
		});
	});

	describe('render', () => {
		it('should render overlay in front of parent div with the size of parent div', async() => {
			const parent = await fixture(html`
				<div style="height: 100px; width: 100px; position: relative;">
					<d2l-labs-card-overlay skeleton></d2l-labs-card-overlay>
				</div>
			`);

			const el = parent.querySelector('d2l-labs-card-overlay');
			expect(el.clientHeight).to.equal(100);
			expect(el.clientWidth).to.equal(100);

			el.removeAttribute('skeleton');
			await el.updateComplete;
			expect(el.skeleton).to.equal(false);
		});
	});

});
