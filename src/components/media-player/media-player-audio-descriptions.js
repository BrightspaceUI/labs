import '@brightspace-ui/core/components/button/button-icon.js';
import '@brightspace-ui/core/components/dialog/dialog.js';
import '@brightspace-ui/core/components/dropdown/dropdown.js';
import '@brightspace-ui/core/components/dropdown/dropdown-content.js';
import '@brightspace-ui/core/components/icons/icon-custom.js';
import '@brightspace-ui/core/components/menu/menu.js';
import '@brightspace-ui/core/components/menu/menu-item-radio.js';
import '@brightspace-ui/core/components/menu/menu-item.js';
import '@brightspace-ui/core/components/menu/menu-item-separator.js';
import { bodyCompactStyles, bodySmallStyles } from '@brightspace-ui/core/components/typography/styles.js';
import { css, html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

export const AUDIO_DESCRIPTION_REPLAY_KEY = 'r';
export const AUDIO_DESCRIPTION_SKIP_KEY = 's';
export const AUDIO_DESCRIPTION_TRACK_KIND = 'descriptions';
const PREFERENCES_AUDIO_DESCRIPTION_LANGUAGE_KEY = 'D2L.MediaPlayer.Preferences.AudioDescriptionLanguage';
const VOICES_LOAD_TIMEOUT_MS = 1000;
const AUDIO_DESCRIPTION_CONTROLS_IN_MENU_MAX_WIDTH_PX = 768;
// macOS Eloquence and novelty voices, which Safari lists alphabetically ahead of the natural-sounding ones
const LOW_QUALITY_VOICE_NAMES = new Set([
	'albert', 'bad news', 'bahh', 'bells', 'boing', 'bubbles', 'cellos', 'eddy', 'flo', 'fred', 'good news', 'grandma', 'grandpa',
	'jester', 'junior', 'kathy', 'organ', 'ralph', 'reed', 'rocko', 'sandy', 'shelley', 'superstar', 'trinoids', 'whisper', 'wobble', 'zarvox'
]);

export const MediaPlayerAudioDescriptionsMixin = superclass => class extends superclass {

	static properties = {
		_audioDescriptionControlsInMenu: { state: true },
		_audioDescriptionPlaying: { state: true },
		_audioDescriptionTracks: { state: true },
		_canReplayAudioDescription: { state: true },
		_selectedAudioDescriptionLanguage: { state: true },
	};

	static styles = [bodyCompactStyles, bodySmallStyles, css`
		#audio-description-skip-button {
			margin-inline-end: 12px;
		}
		#audio-description-button {
			margin-inline-end: 15px;
		}
		#audio-description-button[data-enabled] {
			position: relative;
		}
		#audio-description-button d2l-icon-custom {
			display: block;
			height: calc(1rem - 7px);
			margin: 0 auto;
			width: calc(2rem - 9px);
		}
		.audio-description-header {
			border-bottom: 1px solid var(--d2l-color-chromite);
			color: inherit;
			padding: 1rem;
		}
		#audio-description-button[data-enabled]::after {
			border: 2px solid var(--d2l-color-sylvite);
			border-radius: var(--d2l-button-icon-border-radius, 0.3rem);
			box-sizing: border-box;
			content: "";
			inset: 0;
			pointer-events: none;
			position: absolute;
		}
	`];

	constructor() {
		super();

		this._activeDescriptionCue = null;
		this._audioDescriptionTracks = [];
		this._audioDescriptionIndex = 0;
		this._audioDescriptionPreviousTime = -0.001;
		this._audioDescriptionPausedVideo = false;
		this._audioDescriptionPlaying = false;
		this._audioDescriptionControlsInMenu = false;
		this._canReplayAudioDescription = false;
	}

	get activeDescriptionCue() {
		return this._activeDescriptionCue;
	}

	connectedCallback() {
		super.connectedCallback();
		this.#audioDescriptionResizeObserver.observe(this);
	}

	disconnectedCallback() {
		this.#audioDescriptionResizeObserver.disconnect();
		this._cancelAudioDescription();
		super.disconnectedCallback();
	}

	#audioDescriptionResizeObserver = new ResizeObserver(entries => {
		for (const entry of entries) {
			this._audioDescriptionControlsInMenu = entry.contentRect.width < AUDIO_DESCRIPTION_CONTROLS_IN_MENU_MAX_WIDTH_PX;
		}
	});

	_cancelAudioDescription() {
		if (this._audioDescriptionUtterance && window.speechSynthesis) {
			window.speechSynthesis.cancel();
		}
		this._audioDescriptionUtterance = null;
		this._audioDescriptionPausedVideo = false;
		this._audioDescriptionPlaying = false;
	}

	_getAudioDescriptionsButtonView() {
		if (!this._audioDescriptionTracks?.length || this.hideAudioDescriptionSelection) return null;

		const tooltip = this.localize('components:mediaPlayer:audioDescription');
		const replayTooltip = this.localize('components:mediaPlayer:replayAudioDescription');
		const skipTooltip = this.localize('components:mediaPlayer:skipAudioDescription');
		const showControls = !!this.#getSelectedAudioDescriptionTrack()?.pauseVideo;

		return html`
			${showControls && !this._audioDescriptionControlsInMenu ? html`
				<d2l-button-icon
					id="audio-description-replay-button"
					text="${this.localize('components:mediaPlayer:replay')}"
					theme="${ifDefined(this._getTheme())}"
					disabled-tooltip="${replayTooltip}"
					?disabled="${!this._audioDescriptionPlaying}"
					@click="${this._replayAudioDescription}"
				><d2l-icon-custom slot="icon"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_777_1621)">
<mask id="mask0_777_1621" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="2" width="18" height="14">
<path d="M0 2H18V16H0V2Z" fill="white"/>
</mask>
<g mask="url(#mask0_777_1621)">
<path d="M14.846 2C16.036 2 17 2.73967 17 3.65278V14.3472C17 14.957 16.563 15.517 15.862 15.8048C15.162 16.0926 14.312 16.0607 13.651 15.7223L3.958 10.3751C3.66426 10.2256 3.42291 10.0217 3.25568 9.78167C3.08845 9.54163 3.00059 9.27302 3 9C3 8.44778 3.36 7.93133 3.96 7.62489L13.651 2.27767C14.0059 2.09624 14.4213 1.9997 14.846 2Z" fill="#F1F5FB"/>
</g>
<path d="M2 1V17" stroke="#F1F5FB" stroke-width="2" stroke-linecap="round"/>
</g>
<defs>
<clipPath id="clip0_777_1621">
<rect width="18" height="18" fill="white"/>
</clipPath>
</defs>
</svg></d2l-icon-custom></d2l-button-icon>
				<d2l-button-icon
					id="audio-description-skip-button"
					text="${this.localize('components:mediaPlayer:skip')}"
					theme="${ifDefined(this._getTheme())}"
					disabled-tooltip="${skipTooltip}"
					?disabled="${!this._audioDescriptionPlaying}"
					@click="${this._skipAudioDescription}"
				><d2l-icon-custom slot="icon"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_777_1614)">
<mask id="mask0_777_1614" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="2" width="18" height="14">
<path d="M18 2H0V16H18V2Z" fill="white"/>
</mask>
<g mask="url(#mask0_777_1614)">
<path d="M3.154 2C1.964 2 1 2.73967 1 3.65278V14.3472C1 14.957 1.437 15.517 2.138 15.8048C2.838 16.0926 3.688 16.0607 4.349 15.7223L14.042 10.3751C14.3357 10.2256 14.5771 10.0217 14.7443 9.78167C14.9115 9.54163 14.9994 9.27302 15 9C15 8.44778 14.64 7.93133 14.04 7.62489L4.349 2.27767C3.9941 2.09624 3.5787 1.9997 3.154 2Z" fill="#F1F5FB"/>
</g>
<path d="M16 1V17" stroke="#F1F5FB" stroke-width="2" stroke-linecap="round"/>
</g>
<defs>
<clipPath id="clip0_777_1614">
<rect width="18" height="18" fill="white" transform="matrix(-1 0 0 1 18 0)"/>
</clipPath>
</defs>
</svg></d2l-icon-custom></d2l-button-icon>
			` : null}
			<d2l-dropdown>
				<d2l-button-icon
					class="d2l-dropdown-opener"
					id="audio-description-button"
					text="${tooltip}"
					theme="${ifDefined(this._getTheme())}"
					?data-enabled="${!!this._selectedAudioDescriptionLanguage}"
				><d2l-icon-custom slot="icon"><svg width="28" height="14" viewBox="0 0 28 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.89199 8.55L7.21999 3.9805C7.13766 3.77783 7.05216 3.53717 6.96349 3.2585C6.87483 2.97983 6.78616 2.679 6.69749 2.356C6.61516 2.679 6.52966 2.983 6.44099 3.268C6.35233 3.54667 6.26683 3.7905 6.18449 3.9995L4.52199 8.55H8.89199ZM13.4045 13.737H11.4285C11.2068 13.737 11.0263 13.6832 10.887 13.5755C10.7477 13.4615 10.6432 13.3222 10.5735 13.1575L9.54749 10.355H3.85699L2.83099 13.1575C2.78033 13.3032 2.68216 13.4362 2.53649 13.5565C2.39083 13.6768 2.21033 13.737 1.99499 13.737H-7.82078e-06L5.40549 -1.43051e-06H8.00849L13.4045 13.737ZM27.2244 6.8685C27.2244 7.8755 27.0565 8.80017 26.7209 9.6425C26.3852 10.4848 25.9134 11.21 25.3054 11.818C24.6974 12.426 23.9659 12.8978 23.1109 13.2335C22.2559 13.5692 21.3059 13.737 20.2609 13.737H15.0264V-1.43051e-06H20.2609C21.3059 -1.43051e-06 22.2559 0.170999 23.1109 0.512999C23.9659 0.848665 24.6974 1.3205 25.3054 1.9285C25.9134 2.53017 26.3852 3.25217 26.7209 4.0945C27.0565 4.93683 27.2244 5.8615 27.2244 6.8685ZM24.6024 6.8685C24.6024 6.11483 24.501 5.44033 24.2984 4.845C24.102 4.24333 23.8139 3.73667 23.4339 3.325C23.0602 2.907 22.6042 2.58717 22.0659 2.3655C21.5339 2.14383 20.9322 2.033 20.2609 2.033H17.5914V11.704H20.2609C20.9322 11.704 21.5339 11.5932 22.0659 11.3715C22.6042 11.1498 23.0602 10.8332 23.4339 10.4215C23.8139 10.0035 24.102 9.49683 24.2984 8.9015C24.501 8.29983 24.6024 7.62217 24.6024 6.8685Z" fill="white"/>
</svg></d2l-icon-custom></d2l-button-icon>
				<d2l-dropdown-content id="audio-description-dropdown-content" class="vdiff-target" no-padding no-padding-header no-pointer theme="${ifDefined(this._getTheme())}">
					${showControls ? null : html`<div class="d2l-body-small audio-description-header" slot="header">${this.localize('components:mediaPlayer:audioDescriptions')}</div>`}
                    <d2l-menu label="${tooltip}" @d2l-menu-item-change=${this.#onAudioDescriptionMenuItemChange} theme="${ifDefined(this._getTheme())}">
						${showControls ? html`
							<d2l-menu-item
								id="audio-description-about-menu-item"
								text="${this.localize('components:mediaPlayer:aboutExtendedAudioDescriptions')}"
								@d2l-menu-item-select="${this.#onAboutExtendedAudioDescriptionsSelect}"
							></d2l-menu-item>
							<d2l-menu-item-separator></d2l-menu-item-separator>
						` : null}
						${showControls && this._audioDescriptionControlsInMenu ? html`
							<d2l-menu-item
								text="${this.localize('components:mediaPlayer:replay')}"
								?disabled="${!this._audioDescriptionPlaying}"
								@d2l-menu-item-select="${this._replayAudioDescription}"
							></d2l-menu-item>
							<d2l-menu-item
								text="${this.localize('components:mediaPlayer:skip')}"
								?disabled="${!this._audioDescriptionPlaying}"
								@d2l-menu-item-select="${this._skipAudioDescription}"
							></d2l-menu-item>
							<d2l-menu-item-separator></d2l-menu-item-separator>
						` : null}
                        <d2l-menu-item-radio
                            ?selected="${!this._selectedAudioDescriptionLanguage}"
                            text="${this.localize('components:mediaPlayer:off')}"
                        ></d2l-menu-item-radio>
                        ${this._audioDescriptionTracks.map(track => html`
                            <d2l-menu-item-radio
                                ?selected="${track.srclang === this._selectedAudioDescriptionLanguage}"
                                text="${track.label}"
                                value="${track.srclang}"
                            ></d2l-menu-item-radio>
                        `)}
                    </d2l-menu>
				</d2l-dropdown-content>
			</d2l-dropdown>
			${showControls ? html`
				<d2l-dialog id="audio-description-about-dialog" width="500" title-text="${this.localize('components:mediaPlayer:aboutExtendedAudioDescriptions')}">
					<p class="d2l-body-compact">${this.localize('components:mediaPlayer:aboutExtendedAudioDescriptionsText')}</p>
				</d2l-dialog>
			` : null}
		`;
	}

	async _loadAudioDescriptionTrack(node) {
		for (const attr of ['label', 'src', 'srclang']) {
			if (!node[attr]) {
				console.warn(`d2l-labs-media-player component requires '${attr}' text on track`);
				return;
			}
		}

		const res = await fetch(node.src);
		if (res.status !== 200) {
			console.warn(`d2l-labs-media-player component could not load track from '${node.src}'`);
			this.dispatchEvent(new CustomEvent('trackloadfailed'));
			return;
		}

		const text = await res.text();

		// Audio descriptions are spoken via SpeechSynthesis rather than displayed, so only each cue's start time and text are needed
		const { cues } = this._webVTTParser.parse(text, 'metadata');
		const descriptions = cues
			.map(cue => ({ text: cue.text, time: cue.startTime }))
			.filter(description => Number.isFinite(description.time) && description.text)
			.sort((a, b) => a.time - b.time);

		if (descriptions.length === 0) return;

		// Some browsers (e.g. Chrome) load voices asynchronously on the first getVoices() call
		window.speechSynthesis?.getVoices?.();

		this._audioDescriptionTracks.push({
			descriptions,
			label: node.label,
			pauseVideo: node.hasAttribute('pause-video'),
			srclang: node.srclang,
		});
		this.dispatchEvent(new CustomEvent('trackloaded'));
	}

	_onAudioDescriptionTimeUpdate(currentTime) {
		const track = this._audioDescriptionTracks?.find(track => track.srclang === this._selectedAudioDescriptionLanguage);
		if (!track) return;

		if (currentTime < this._audioDescriptionPreviousTime) {
			this._resetAudioDescriptionCursor(currentTime);
		}

		const next = track.descriptions[this._audioDescriptionIndex];
		if (next && this._audioDescriptionPreviousTime < next.time && currentTime >= next.time) {
			this._audioDescriptionIndex += 1;
			this._activeDescriptionCue = next;
			this.dispatchEvent(new CustomEvent('descriptioncuechange'));
			this.#speakAudioDescription(next, track);
		}
		this._audioDescriptionPreviousTime = currentTime;
	}

	_replayAudioDescription() {
		if (!this._audioDescriptionPlaying) return;
		const track = this.#getSelectedAudioDescriptionTrack();
		if (!track?.pauseVideo) return;
		const description = track?.descriptions.findLast(description => description.time <= this.currentTime);
		if (!description) return;

		// Preserve the pause from the original playback so the video still resumes after the replay
		const pausedVideo = this._audioDescriptionPausedVideo;
		this.#speakAudioDescription(description, track);
		if (pausedVideo) this._audioDescriptionPausedVideo = true;
	}

	_resetAudioDescriptionCursor(time) {
		this._cancelAudioDescription();
		this._activeDescriptionCue = null;
		const track = this._audioDescriptionTracks?.find(track => track.srclang === this._selectedAudioDescriptionLanguage);
		this._audioDescriptionIndex = track
			? track.descriptions.findIndex(description => description.time >= time)
			: 0;
		if (this._audioDescriptionIndex < 0) this._audioDescriptionIndex = track?.descriptions.length || 0;
		this._audioDescriptionPreviousTime = time - 0.001;
	}

	_restoreAudioDescriptionPreference() {
		const audioDescriptionPreference = this._getPreference(PREFERENCES_AUDIO_DESCRIPTION_LANGUAGE_KEY);
		this._selectedAudioDescriptionLanguage = this._audioDescriptionTracks.some(track => track.srclang === audioDescriptionPreference)
			? audioDescriptionPreference
			: null;
		this._resetAudioDescriptionCursor(this.currentTime);
	}

	_skipAudioDescription() {
		if (!this._audioDescriptionPlaying || !this.#getSelectedAudioDescriptionTrack()?.pauseVideo) return;
		const pausedVideo = this._audioDescriptionPausedVideo;
		this._cancelAudioDescription();
		if (pausedVideo) this._play();
	}

	#getAudioDescriptionVoice(language) {
		const normalizedLanguage = (language || '').toLowerCase();
		if (!normalizedLanguage || !window.speechSynthesis?.getVoices) return null;

		const voices = window.speechSynthesis.getVoices();
		if (!voices.length) return null;

		const baseLanguage = normalizedLanguage.split('-')[0];
		const getLanguageScore = voice => {
			const voiceLanguage = (voice.lang || '').toLowerCase();
			if (voiceLanguage === normalizedLanguage) return 4;
			if (voiceLanguage.startsWith(`${baseLanguage}-`) || voiceLanguage.startsWith(`${baseLanguage}_`)) return 3;
			if (voiceLanguage.startsWith(baseLanguage)) return 2;
			if (voiceLanguage.includes(baseLanguage)) return 1;
			return 0;
		};
		const getQualityScore = voice => {
			const uri = (voice.voiceURI || '').toLowerCase();
			const name = (voice.name || '').toLowerCase().split(' (')[0];
			if (uri.includes('eloquence') || uri.includes('speech.synthesis.voice') || LOW_QUALITY_VOICE_NAMES.has(name)) return 0;
			if (uri.includes('premium') || name.includes('premium')) return 3;
			if (uri.includes('enhanced') || name.includes('enhanced')) return 2;
			return 1;
		};

		let bestMatch = voices[0];
		let bestScore = -1;
		for (const voice of voices) {
			const score = getLanguageScore(voice) * 10 + getQualityScore(voice);
			if (score > bestScore) {
				bestMatch = voice;
				bestScore = score;
			}
		}
		return bestMatch;
	}

	#getSelectedAudioDescriptionTrack() {
		return this._audioDescriptionTracks?.find(track => track.srclang === this._selectedAudioDescriptionLanguage);
	}

	#onAboutExtendedAudioDescriptionsSelect() {
		this.shadowRoot?.querySelector('#audio-description-dropdown-content')?.close();
		const dialog = this.shadowRoot?.querySelector('#audio-description-about-dialog');
		if (dialog) dialog.opened = true;
	}

	#onAudioDescriptionMenuItemChange(e) {
		this._cancelAudioDescription();
		this._selectedAudioDescriptionLanguage = e.target.value || null;
		this._resetAudioDescriptionCursor(this.currentTime);
		if (this._selectedAudioDescriptionLanguage) {
			this._setPreference(PREFERENCES_AUDIO_DESCRIPTION_LANGUAGE_KEY, this._selectedAudioDescriptionLanguage);
		} else {
			this._clearPreference(PREFERENCES_AUDIO_DESCRIPTION_LANGUAGE_KEY);
		}

		this.shadowRoot?.querySelector('#audio-description-dropdown-content')?.close();
	}

	#speakAudioDescription(description, track) {
		if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) return;

		this._cancelAudioDescription();
		const utterance = new window.SpeechSynthesisUtterance(description.text);
		utterance.lang = track.srclang;
		this._audioDescriptionUtterance = utterance;
		this._audioDescriptionPlaying = true;

		if (track.pauseVideo && this._media && !this._media.paused) {
			this._audioDescriptionPausedVideo = true;
			this._media.pause();
		}

		const finish = () => {
			if (this._audioDescriptionUtterance !== utterance) return;
			this._audioDescriptionUtterance = null;
			this._audioDescriptionPlaying = false;
			if (this._audioDescriptionPausedVideo) {
				this._audioDescriptionPausedVideo = false;
				this._play();
			}
		};
		utterance.onend = finish;
		utterance.onerror = finish;

		const speak = () => {
			if (this._audioDescriptionUtterance !== utterance) return;
			const voice = this.#getAudioDescriptionVoice(track.srclang);
			if (voice) utterance.voice = voice;
			utterance.volume = this.volume;
			utterance.rate = this._media?.playbackRate || 1;
			window.speechSynthesis.speak(utterance);
		};

		if (window.speechSynthesis.getVoices().length) {
			speak();
			return;
		}

		// Speaking before voices have loaded is silently dropped in some browsers
		const controller = new AbortController();
		const onVoicesChanged = () => {
			controller.abort();
			speak();
		};
		window.speechSynthesis.addEventListener('voiceschanged', onVoicesChanged, { signal: controller.signal });
		const timeout = setTimeout(onVoicesChanged, VOICES_LOAD_TIMEOUT_MS);
		controller.signal.addEventListener('abort', () => clearTimeout(timeout));
	}
};
