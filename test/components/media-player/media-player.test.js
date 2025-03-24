import '../../../src/components/media-player/media-player.js';
import { expect, fixture, html, runConstructor } from '@brightspace-ui/testing';

describe('d2l-labs-media-player', () => {

	describe('accessibility', () => {
		it('should pass all axe tests', async() => {
			const el = await fixture(html`<d2l-labs-media-player></d2l-labs-media-player>`);
			await expect(el).to.be.accessible();
		});
	});

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-labs-media-player');
		});
	});
});
