import '@brightspace-ui/core/components/menu/menu.js';
import '../../../src/components/menu-item-ai/menu-item-ai.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('d2l-menu-item-ai', () => {
	describe('accessibility', () => {
		it('should pass all aXe tests', async() => {
			const el = await fixture(html`
				<d2l-menu label="Astronomy">
					<d2l-menu-item-ai text="Summarize with AI"></d2l-menu-item-ai>
				</d2l-menu>
			`);
			await expect(el).to.be.accessible();
		});

		it('should pass all aXe tests when disabled', async() => {
			const el = await fixture(html`
				<d2l-menu label="Astronomy">
					<d2l-menu-item-ai text="Summarize with AI" disabled></d2l-menu-item-ai>
				</d2l-menu>
			`);
			await expect(el).to.be.accessible();
		});
	});
});
