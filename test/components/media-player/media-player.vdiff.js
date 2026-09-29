import '../../../src/components/media-player/media-player.js';
import { expect, fixture, focusElem, html, oneEvent, waitUntil } from '@brightspace-ui/testing';

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

	it('video-with-poster-4x3', async() => {
		const elem = await fixture(
			html`
			<d2l-labs-media-player
				src="./test/components/media-player/videos/1_lego.webm"
				poster="./demo/components/media-player/static/sample-poster-4x3.png"
				media-type="video">
			</d2l-labs-media-player>`
		);
		await expect(elem).to.be.golden();
	});

	it('video with settings menu open', async() => {
		const elem = await fixture(
			html`
			<d2l-labs-media-player
				src="./test/components/media-player/videos/1_lego.webm"
				media-type="video">
				<track kind="captions" src="./demo/components/media-player/static/sample-vtt-en.vtt" srclang="en" label="English" default>
			</d2l-labs-media-player>`
		);
		const settingsMenu = elem.shadowRoot.querySelector('#settings-menu');
		settingsMenu.setAttribute('opened', true);
		await oneEvent(settingsMenu, 'd2l-dropdown-open');
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

	it('audio with settings menu open', async() => {
		const elem = await fixture(
			html`
			<d2l-labs-media-player
				src="./test/components/media-player/audio/applause.mp3"
				media-type="audio">
				<track kind="captions" src="./demo/components/media-player/static/sample-vtt-en.vtt" srclang="en" label="English" default>
			</d2l-labs-media-player>`
		);
		const settingsMenu = elem.shadowRoot.querySelector('#settings-menu');
		settingsMenu.setAttribute('opened', true);
		await oneEvent(settingsMenu, 'd2l-dropdown-open');
		await expect(elem).to.be.golden();
	});

	it('video-with-search', async() => {
		const elem = await fixture(
			html`
			<d2l-labs-media-player src="./test/components/media-player/videos/1_lego.webm" media-type="video">
				<track src="./demo/components/media-player/static/sample-vtt-en.vtt" kind="captions" srclang="en" label="English" default>
			</d2l-labs-media-player>`
		);
		await focusElem(elem.shadowRoot.querySelector('#search-container'));
		await expect(elem).to.be.golden();
	});

	it('audio-with-search', async() => {
		const elem = await fixture(
			html`
			<d2l-labs-media-player src="./test/components/media-player/audio/applause.mp3" media-type="audio">
				<track src="./demo/components/media-player/static/sample-vtt-en.vtt" kind="captions" srclang="en" label="English" default>
			</d2l-labs-media-player>`
		);
		await focusElem(elem.shadowRoot.querySelector('#search-container'));
		await expect(elem).to.be.golden();
	});

	[
		{ name: 'desktop', viewport: { width: 1000 } },
		{ name: 'mobile', viewport: { width: 600 } }
	].forEach(({ name, viewport }) => {
		describe(name, () => {
			const audioDescriptionsFixture = async() => {
				const elem = await fixture(
					html`
					<d2l-labs-media-player src="./test/components/media-player/videos/1_lego.webm" media-type="video">
						<track src="./demo/components/media-player/static/sample-vtt-en-descriptions.vtt" kind="descriptions" srclang="en" label="English" pause-video>
						<track src="./demo/components/media-player/static/sample-vtt-fr-descriptions.vtt" kind="descriptions" srclang="fr" label="French">
					</d2l-labs-media-player>`,
					{ viewport }
				);
				await waitUntil(() => elem.shadowRoot.querySelector('#audio-description-button'));
				return elem;
			};

			const openAudioDescriptions = async elem => {
				const dropdownContent = elem.shadowRoot.querySelector('#audio-description-dropdown-content');
				dropdownContent.setAttribute('opened', true);
				await oneEvent(dropdownContent, 'd2l-dropdown-open');
			};

			it('video with audio descriptions', async() => {
				const elem = await audioDescriptionsFixture();
				await expect(elem).to.be.golden();
			});

			it('video with audio descriptions open', async() => {
				const elem = await audioDescriptionsFixture();
				await openAudioDescriptions(elem);
				await expect(elem).to.be.golden();
			});

			it('video with audio descriptions pause-video open', async() => {
				const elem = await audioDescriptionsFixture();
				// Set directly to avoid persisting the selection to localStorage
				elem._selectedAudioDescriptionLanguage = 'en';
				await elem.updateComplete;
				await openAudioDescriptions(elem);
				await expect(elem).to.be.golden();
			});
		});
	});
});
