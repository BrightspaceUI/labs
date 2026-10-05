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

	describe('transcript viewer', () => {
		const showTranscriptCue = async elem => {
			await waitUntil(() => elem._media && elem._media.readyState >= 1 && elem._media.textTracks[0]?.cues?.length > 0);
			elem._media.currentTime = 5;
			await waitUntil(() => elem.transcriptActiveCue);
			await elem.updateComplete;
		};

		[
			{ mediaType: 'video', src: './test/components/media-player/videos/1_lego.webm' },
			{ mediaType: 'audio', src: './test/components/media-player/audio/applause.mp3' }
		].forEach(({ mediaType, src }) => {
			it(`${mediaType}-with-transcript-viewer`, async() => {
				const elem = await fixture(
					html`
					<d2l-labs-media-player src=${src} media-type=${mediaType} transcript-viewer-on>
						<track src="./demo/components/media-player/static/sample-vtt-en.vtt" kind="captions" srclang="en" label="English" default>
					</d2l-labs-media-player>`
				);
				await showTranscriptCue(elem);
				await expect(elem).to.be.golden();
			});
		});
	});

	describe('thumbnails', () => {
		const chaptersMetadata = '{"chapters":[{"time":0,"title":{"en":"Chapter One"}}]}';

		const showTimelinePreview = async elem => {
			await waitUntil(() => elem._media && elem._media.readyState >= 1);
			if (elem._thumbnailsImage) await elem._thumbnailsImage.decode();
			// Set hover state directly since the seek bar hover position depends on the mouse
			elem._hovering = true;
			elem._hoverTime = elem.duration / 2;
			elem._timelinePreviewOffset = 50;
			await elem.updateComplete;
		};

		it('video-with-thumbnails-preview', async() => {
			const elem = await fixture(
				html`
				<d2l-labs-media-player
					src="./test/components/media-player/videos/1_lego.webm"
					thumbnails="./demo/components/media-player/static/th90w160i1-samplevideo.png"
					media-type="video">
				</d2l-labs-media-player>`
			);
			await showTimelinePreview(elem);
			await expect(elem).to.be.golden();
		});

		it('video-with-thumbnails-preview-and-chapter', async() => {
			const elem = await fixture(
				html`
				<d2l-labs-media-player
					src="./test/components/media-player/videos/1_lego.webm"
					thumbnails="./demo/components/media-player/static/th90w160i1-samplevideo.png"
					metadata=${chaptersMetadata}
					media-type="video">
				</d2l-labs-media-player>`
			);
			await showTimelinePreview(elem);
			await expect(elem).to.be.golden();
		});

		it('video-without-thumbnails-preview', async() => {
			const elem = await fixture(
				html`
				<d2l-labs-media-player
					src="./test/components/media-player/videos/1_lego.webm"
					metadata=${chaptersMetadata}
					media-type="video">
				</d2l-labs-media-player>`
			);
			await showTimelinePreview(elem);
			await expect(elem).to.be.golden();
		});
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
				// Wait for all tracks so the preference restore after loading doesn't override test state
				await waitUntil(() => elem._audioDescriptionTracks.length === 2 && elem.shadowRoot.querySelector('#audio-description-button'));
				await elem.updateComplete;
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

			it('video with about extended audio descriptions dialog open', async() => {
				const elem = await audioDescriptionsFixture();
				elem._selectedAudioDescriptionLanguage = 'en';
				await elem.updateComplete;
				const dialog = elem.shadowRoot.querySelector('#audio-description-about-dialog');
				elem._audioDescriptionDialogOpened = true;
				await oneEvent(dialog, 'd2l-dialog-open');
				await expect(document).to.be.golden();
			});
		});
	});
});
