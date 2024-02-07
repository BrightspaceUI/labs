import '../../../src/components/accessibility-disability-simulator/accessibility-disability-simulator.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

async function createComponent(disabilityType, hideControls) {
	return await fixture(html`<d2l-labs-accessibility-disability-simulator disability-type="${disabilityType}" ?hide-controls=${hideControls}>
		<img src="../../../demo/components/accessibility-disability-simulator/colour-wheel.png">
	</d2l-labs-accessibility-disability-simulator>`);
}

describe('accessibility-disability-simulator', () => {
	it('default state with no content', async() => {
		const component = await fixture(html`<d2l-labs-accessibility-disability-simulator></d2l-labs-accessibility-disability-simulator>`);
		await expect(component).to.be.golden();
	});

	it('default state with content', async() => {
		const component = await createComponent('');
		await expect(component).to.be.golden();
	});

	it('content with hidden controls', async() => {
		const component = await createComponent('', true);
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
			const component = await createComponent('low-vision');
			component._blurriness = 1;
			await component.updateComplete;
			await expect(component).to.be.golden();
		});

		it('maximum blurriness', async() => {
			const component = await createComponent('low-vision');
			component._blurriness = 100;
			await component.updateComplete;
			await expect(component).to.be.golden();
		});
	})

	it('motor impairment', async() => {
		const component = await createComponent('motor-impairment');
		await expect(component).to.be.golden();
	});

	describe('colourblindness', () => {
		it('achromatopsia filter', async() => {
			const component = await createComponent('colourblind-achromatopsia');
			await expect(component).to.be.golden();
		});

		it('deuteranopia filter', async() => {
			const component = await createComponent('colourblind-deuteranopia');
			await expect(component).to.be.golden();
		});

		it('protanopia filter', async() => {
			const component = await createComponent('colourblind-protanopia');
			await expect(component).to.be.golden();
		});

		it('tritanopia filter', async() => {
			const component = await createComponent('colourblind-tritanopia');
			await expect(component).to.be.golden();
		});
	})
});
