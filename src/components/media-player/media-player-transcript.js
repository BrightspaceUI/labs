import '@brightspace-ui/core/components/dropdown/dropdown-button-subtle.js';
import '@brightspace-ui/core/components/dropdown/dropdown-menu.js';
import '@brightspace-ui/core/components/icons/icon.js';
import '@brightspace-ui/core/components/menu/menu.js';
import '@brightspace-ui/core/components/menu/menu-item.js';
import { css, html } from 'lit';

// Expects the host to provide _media, mediaType, currentTime, _selectedTrackIdentifier, _getSrclangFromTrackIdentifier(), _onCueChange() and localize()
export const MediaPlayerTranscriptMixin = superclass => class extends superclass {

	static properties = {
		transcriptViewerOn: { type: Boolean, attribute: 'transcript-viewer-on' },
	};

	static styles = [super.styles, css`
		.transcript-cue-container {
			padding-left: 10px;
		}
		.video-transcript-cue {
			padding-left: 5px;
		}
		.audio-transcript-cue {
			padding-left: 5px;
		}
		.video-transcript-cue[active] {
			background-color: gray;
			box-shadow: -5px 0 0 white;
		}
		.audio-transcript-cue[active] {
			background-color: lightgray;
			box-shadow: -5px 0 0 black;
		}
		#video-transcript-viewer {
			bottom: 55px;
			color: white;
			overflow-anchor: none;
			overflow-y: auto;
			position: absolute;
			right: 0;
			top: 50px;
			width: 65%;
			z-index: 1;
		}
		#audio-transcript-viewer {
			bottom: 60px;
			color: black;
			overflow-anchor: none;
			overflow-y: auto;
			position: absolute;
			right: 0;
			top: 45px;
			width: 100%;
			z-index: 1;
		}
		#close-transcript {
			position: absolute;
			right: 7px;
			top: 0;
			z-index: 1;
		}
		#video-transcript-download-button {
			left: 35%;
			position: absolute;
			top: 5px;
			z-index: 2;
		}
		#audio-transcript-download-button {
			left: 10px;
			position: absolute;
			top: 0;
			z-index: 2;
		}
		#audio-transcript-download-menu {
			left: 35px;
		}
		#video-close-transcript-icon {
			color: white;
		}
		#audio-close-transcript-icon {
			color: black;
		}
	`];

	constructor() {
		super();
		this.afterCaptions = [];
		this.beforeCaptions = [];
	}

	_closeTranscript() {
		this.dispatchEvent(new CustomEvent('close-transcript', { bubbles: true, composed: true }));
	}

	_downloadCaptions() {
		this.dispatchEvent(new CustomEvent('download-captions', { bubbles: true, composed: true }));
	}

	_downloadTranscript() {
		this.dispatchEvent(new CustomEvent('download-transcript', { bubbles: true, composed: true }));
	}

	async _onTranscriptCueChange() {
		if (!this._transcriptViewer) {
			this._transcriptViewer = this.shadowRoot.getElementById('video-transcript-viewer')
				|| this.shadowRoot.getElementById('audio-transcript-viewer');
		}
		this._updateTranscriptViewerCues();
		await this.requestUpdate();
		this._scrollTranscriptViewer();
	}

	_renderTranscriptViewer() {
		if (!this._media) {
			return;
		}
		const captionsMenu = this.shadowRoot.getElementById('captions-menu');
		if (captionsMenu) {
			this._captionsMenuReturnItem = captionsMenu.shadowRoot.querySelector('d2l-menu-item-return');
			this._captionsMenuReturnItem?.setAttribute('text', this.localize('components:mediaPlayer:language'));
		}

		if (!this._transcriptViewer) {
			this._onCueChange();
		}

		const isVideo = this.mediaType === 'video';
		const captionsToHtml = (item) => {
			const updateTime = async() => {
				this.currentTime = item.startTime;
				this._media.currentTime = item.startTime;
			};
			return html`
			<div class=${isVideo ? 'video-transcript-cue' : 'audio-transcript-cue'}
				@click=${updateTime}>
				${item.text}<br>
			</div>`;
		};

		return html`
			<span id="close-transcript"
			@click=${this._closeTranscript}>
			<d2l-icon class="d2l-button-icon"
				id=${isVideo ? 'video-close-transcript-icon' : 'audio-close-transcript-icon'}
				icon="tier1:close-small"></d2l-icon>
			</span>
			<div
			id=${isVideo ? 'video-transcript-viewer' : 'audio-transcript-viewer'}
			>
			<div class="transcript-cue-container">
				${this.beforeCaptions.map(captionsToHtml)}
				<div class=${isVideo ? 'video-transcript-cue' : 'audio-transcript-cue'} active
				id="transcript-viewer-active-cue">
					${this.transcriptActiveCue?.text}
				</div>
				${this.afterCaptions.map(captionsToHtml)}
			</div>
			</div>
			<d2l-dropdown-button-subtle
				id=${isVideo ? 'video-transcript-download-button' : 'audio-transcript-download-button'}
				text="${this.localize('components:mediaPlayer:download')}">
				<d2l-dropdown-menu id=${isVideo ? 'video-transcript-download-menu' : 'audio-transcript-download-menu'}>
					<d2l-menu>
							<d2l-menu-item @click=${this._downloadTranscript} text="${this.localize('components:mediaPlayer:transcriptTxt')}"></d2l-menu-item>
							<d2l-menu-item @click=${this._downloadCaptions} text="${this.localize('components:mediaPlayer:captionsVtt')}"></d2l-menu-item>
					</d2l-menu>
				</d2l-dropdown-menu>
			</d2l-dropdown-button-subtle>
		`;
	}

	_scrollTranscriptViewer() {
		const cue = this.shadowRoot.getElementById('transcript-viewer-active-cue');
		const cueRect = cue?.getBoundingClientRect();
		const transcriptRect = this._transcriptViewer?.getBoundingClientRect();
		if (cue && cueRect && transcriptRect) {
			if (cueRect.bottom > transcriptRect.bottom && cueRect.height <= transcriptRect.height) {
				this._transcriptViewer.scrollBy({ top: cueRect.bottom - transcriptRect.bottom + transcriptRect.height - cueRect.height, left: 0, behavior: 'smooth' });
			} else if (cueRect.top < transcriptRect.top) {
				this._transcriptViewer.scrollBy({ top: cueRect.top - transcriptRect.top, left: 0, behavior: 'smooth' });
			}
		}
	}

	_updateTranscriptViewerCues() {
		let cues = null;
		const lang = this._getSrclangFromTrackIdentifier(this._selectedTrackIdentifier);
		for (let i = 0; i < this._media.textTracks.length; i += 1) {
			const currTrack = this._media.textTracks[i];
			if (currTrack?.cues) {
				const activeCues = currTrack.activeCues;
				if (lang === currTrack.language) {
					this.transcriptActiveCue = activeCues?.[activeCues?.length - 1];
					cues = currTrack.cues;
					break;
				}
			}
		}
		if (!cues) {
			let defaultTrack;
			for (let i = 0; i < this._media.textTracks.length; i++) {
				if (this._media.textTracks[i].default) {
					defaultTrack = this._media.textTracks[i];
					break;
				}
			}
			defaultTrack = defaultTrack || this._media.textTracks[0];
			if (defaultTrack) defaultTrack.mode = 'hidden';
			this._selectedTrackIdentifier = { kind: defaultTrack?.kind, srclang: defaultTrack?.language };
			this.requestUpdate();
			return;
		}

		this.beforeCaptions = [];
		this.afterCaptions = [];
		for (let i = 0; i < cues.length; i += 1) {
			const currCue = cues[i];
			const currTime = this._media?.currentTime;
			const before = currCue !== this.transcriptActiveCue && (currCue.endTime < currTime || currCue.endTime <= this.transcriptActiveCue?.endTime);
			if (before) {
				this.beforeCaptions.push(currCue);
			} else if (currCue !== this.transcriptActiveCue) {
				this.afterCaptions.push(currCue);
			}
		}
	}
};
