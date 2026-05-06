import '../../../src/components/button-subtle-ai/button-subtle-ai.js';
import { expect, fixture, runConstructor } from '@brightspace-ui/testing';
import { html } from 'lit';

describe('button-subtle-ai', () => {
	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-labs-button-subtle-ai');
		});
	});

	describe('rendering', () => {
		it('should render with the text passed through the text attribute', async() => {
			const expectedText = 'Test';
			const component = await fixture(html`<d2l-labs-button-subtle-ai text="${expectedText}"></d2l-labs-button-subtle-ai>`);
			expect(component.shadowRoot.querySelector('d2l-button-subtle').text).to.equal(expectedText);
		});

		it('should render with the ai icon', async() => {
			const component = await fixture(html`<d2l-labs-button-subtle-ai text="Test"></d2l-labs-button-subtle-ai>`);
			expect(component.shadowRoot.querySelector('d2l-button-subtle').icon).to.equal('tier1:ai');
		});
	});
});
