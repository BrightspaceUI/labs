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

	describe('audio descriptions', () => {
		let el;

		beforeEach(async() => {
			el = await fixture(html`<d2l-labs-media-player></d2l-labs-media-player>`);
		});

		it('should parse audio description time codes', () => {
			expect(el.constructor._parseTimeCode('01:02:03.500')).to.equal(3723.5);
		});

		it('should speak a description once when its timestamp is crossed', () => {
			const description = { time: 10, text: 'A person enters.', language: 'en-US' };
			el._selectedAudioDescriptionLanguage = 'en-US';
			el._normalizedAudioDescriptions = [{
				language: 'en-US',
				descriptions: [description]
			}];
			el._audioDescriptionPreviousTime = 9;
			el._speakAudioDescription = (spokenDescription) => expect(spokenDescription).to.equal(description);

			el._onAudioDescriptionTimeUpdate(10);
			el._onAudioDescriptionTimeUpdate(10.5);
			expect(el._audioDescriptionIndex).to.equal(1);
		});

		it('should pause the video when an audio description requests it', () => {
			let paused = false;
			const speechSynthesis = {
				speak: () => {},
				cancel: () => {},
				getVoices: () => [{ lang: 'en-US', name: 'English (United States)' }]
			};
			window.speechSynthesis = speechSynthesis;
			window.SpeechSynthesisUtterance = function SpeechSynthesisUtterance(text) {
				this.text = text;
				this.lang = 'en-US';
				this.onend = null;
				this.onerror = null;
			};
			const media = {
				paused: false,
				pause: () => {
					paused = true;
					media.paused = true;
				},
				play: () => Promise.resolve()
			};
			el._media = media;
			el._selectedAudioDescriptionLanguage = 'en-US';
			el._normalizedAudioDescriptions = [{
				language: 'en-US',
				pauseVideo: true,
				descriptions: [{ time: 10, text: 'A person enters.' }]
			}];
			el._audioDescriptionPreviousTime = 9;
			el._audioDescriptionIndex = 0;

			el._onAudioDescriptionTimeUpdate(10);
			expect(paused).to.equal(true);
		});

		it('should select the closest voice for the description language', () => {
			const speechSynthesis = {
				speak: () => {},
				cancel: () => {},
				getVoices: () => [
					{ lang: 'en-GB', name: 'English (United Kingdom)' },
					{ lang: 'fr-FR', name: 'French (France)' },
					{ lang: 'en-US', name: 'English (United States)' }
				]
			};
			window.speechSynthesis = speechSynthesis;
			window.SpeechSynthesisUtterance = function SpeechSynthesisUtterance(text) {
				this.text = text;
				this.lang = 'en-US';
				this.voice = null;
				this.onend = null;
				this.onerror = null;
			};

			const utterance = new window.SpeechSynthesisUtterance('hello');
			const voice = el._getAudioDescriptionVoice('en-US');
			utterance.voice = voice;
			expect(utterance.voice.name).to.equal('English (United States)');
		});
	});
});
