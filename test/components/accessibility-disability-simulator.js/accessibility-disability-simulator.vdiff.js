import '../../../src/components/accessibility-disability-simulator/accessibility-disability-simulator.js';
import { expect, fixture, html, setViewport } from '@brightspace-ui/testing';
import { ifDefined } from 'lit/directives/if-defined.js';

async function createComponent(disabilityType, { hideControls, blurLevel } = {}) {
	return await fixture(html`<d2l-labs-accessibility-disability-simulator disability-type="${disabilityType}" ?hide-controls=${hideControls} blur-level=${ifDefined(blurLevel)}>
		<img src="../../../demo/components/accessibility-disability-simulator/color-wheel.png">
	</d2l-labs-accessibility-disability-simulator>`);
}

describe('accessibility-disability-simulator', () => {
	it('default state with no content', async() => {
		const component = await fixture(html`<d2l-labs-accessibility-disability-simulator></d2l-labs-accessibility-disability-simulator>`);
		await expect(component).to.be.golden();
	});

	it('default state with content', async() => {
		const component = await createComponent('');
		await setViewport({ height: 1142 });
		await component.updateComplete;
		await expect(component).to.be.golden();
	});

	it('content with hidden controls', async() => {
		const component = await createComponent('', { hideControls: true });
		await expect(component).to.be.golden();
	});

	it('no vision', async() => {
		const component = await createComponent('no-vision');
		await expect(component).to.be.golden({ margin: 20 });
	});

	describe('low vision', () => {
		it('default', async() => {
			const component = await createComponent('low-vision');
			await expect(component).to.be.golden();
		});

		it('minimum blurriness', async() => {
			const component = await createComponent('low-vision', { blurLevel: 1 });
			await expect(component).to.be.golden();
		});

		it('maximum blurriness', async() => {
			const component = await createComponent('low-vision', { blurLevel: 100 });
			await expect(component).to.be.golden();
		});
	});

	it('keyboard only', async() => {
		const component = await createComponent('keyboard-only');
		await expect(component).to.be.golden();
	});

	describe('colorblindness', () => {
		it('achromatopsia filter', async() => {
			const component = await createComponent('colorblind-achromatopsia');
			await expect(component).to.be.golden();
		});

		it('deuteranopia filter', async() => {
			const component = await createComponent('colorblind-deuteranopia');
			await expect(component).to.be.golden();
		});

		it('protanopia filter', async() => {
			const component = await createComponent('colorblind-protanopia');
			await expect(component).to.be.golden();
		});

		it('tritanopia filter', async() => {
			const component = await createComponent('colorblind-tritanopia');
			await expect(component).to.be.golden();
		});
	});
});
