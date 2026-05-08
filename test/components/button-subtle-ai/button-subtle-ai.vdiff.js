import '../../../src/components/button-subtle-ai/button-subtle-ai.js';
import { expect, fixture, focusElem } from '@brightspace-ui/testing';
import { html } from 'lit';

describe('button-subtle-ai', () => {
	describe('states', () => {
		it('focus', async() => {
			const element = await fixture(html`<d2l-labs-button-subtle-ai text="Test"></d2l-labs-button-subtle-ai>`, { viewport: { width: 150, height: 100 } });
			await focusElem(element.shadowRoot.querySelector('d2l-button-subtle'));
			await expect(document).to.be.golden();
		});
	});
});
