import '../../../src/components/media-player/media-player.js';
import { expect, fixture, focusElem, html } from '@brightspace-ui/testing';

describe('d2l-labs-media-player', () => {
	it('video', async() => {
		const elem = await fixture(
			html`
			<d2l-labs-media-player
				src="./test/components/media-player/videos/1_lego.webm"
				media-type="video">
			</d2l-labs-media-player>`
		);
		await expect(elem).to.be.golden();
	});

	it('video-with-poster', async() => {
		const elem = await fixture(
			html`
			<d2l-labs-media-player
				src="./test/components/media-player/videos/1_lego.webm"
				poster="./demo/components/media-player/static/sample-poster.png"
				media-type="video">
			</d2l-labs-media-player>`
		);
		await expect(elem).to.be.golden();
	});

	it('audio', async() => {
		const elem = await fixture(
			html`
			<d2l-labs-media-player
				src="./test/components/media-player/audio/applause.mp3"
				media-type="audio">
			</d2l-labs-media-player>`
		);
		await expect(elem).to.be.golden();
	});

	it('video-with-search', async() => {
		const elem = await fixture(
			html`
			<d2l-labs-media-player src="./test/components/media-player/videos/1_lego.webm" media-type="video">
				<track src="./demo/components/media-player/static/sample-vtt-en.vtt" kind="captions" srclang="en" label="English" default>
			</d2l-labs-media-player>`
		);
		await focusElem(elem.shadowRoot.querySelector('#d2l-labs-media-player-search-container'));
		await expect(elem).to.be.golden();
	});

	it('audio-with-search', async() => {
		const elem = await fixture(
			html`
			<d2l-labs-media-player src="./test/components/media-player/audio/applause.mp3" media-type="audio">
				<track src="./demo/components/media-player/static/sample-vtt-en.vtt" kind="captions" srclang="en" label="English" default>
			</d2l-labs-media-player>`
		);
		await focusElem(elem.shadowRoot.querySelector('#d2l-labs-media-player-search-container'));
		await expect(elem).to.be.golden();
	});
});
