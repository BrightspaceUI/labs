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

	describe('_play()', () => {
		let el;

		beforeEach(async() => {
			el = await fixture(html`<d2l-labs-media-player></d2l-labs-media-player>`);
		});

		it('should suppress AbortError when play() is interrupted by pause()', async() => {
			const abortError = new DOMException('The play() request was interrupted by a call to pause().', 'AbortError');
			Object.defineProperty(el, '_media', {
				configurable: true,
				get: () => ({ play: () => Promise.reject(abortError) })
			});
			// An unhandled rejection in an async test function causes the test to fail,
			// so if the AbortError is not suppressed, this call will fail the test
			await el._play();
		});

		it('should rethrow non-AbortError errors from play()', async() => {
			const mediaError = new Error('MediaError');
			Object.defineProperty(el, '_media', {
				configurable: true,
				get: () => ({ play: () => Promise.reject(mediaError) })
			});
			let caught = null;
			try {
				await el._play();
			} catch (e) {
				caught = e;
			}
			expect(caught).to.equal(mediaError);
		});
	});
});
