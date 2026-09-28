import '@brightspace-ui/core/components/button/button-icon.js';
import '@brightspace-ui/core/components/dropdown/dropdown.js';
import '@brightspace-ui/core/components/dropdown/dropdown-menu.js';
import '@brightspace-ui/core/components/icons/icon-custom.js';
import '@brightspace-ui/core/components/menu/menu.js';
import '@brightspace-ui/core/components/menu/menu-item-radio.js';
import '@brightspace-ui/core/components/tooltip/tooltip.js';
import { css, html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

export const AUDIO_DESCRIPTION_REPLAY_KEY = 'r';
export const AUDIO_DESCRIPTION_TRACK_KIND = 'descriptions';
const PREFERENCES_AUDIO_DESCRIPTION_LANGUAGE_KEY = 'D2L.MediaPlayer.Preferences.AudioDescriptionLanguage';
const VOICES_LOAD_TIMEOUT_MS = 1000;

export const MediaPlayerAudioDescriptionsMixin = superclass => class extends superclass {

	static properties = {
		_audioDescriptionPlaying: { type: Boolean, attribute: false },
		_audioDescriptionTracks: { type: Array, attribute: false },
		_canReplayAudioDescription: { type: Boolean, attribute: false },
		_selectedAudioDescriptionLanguage: { type: String, attribute: false },
	};

	static styles = css`
		#d2l-labs-media-player-audio-description-button {
			background-color: transparent;
			border: none;
			border-radius: 0.3rem;
			color: inherit;
			cursor: pointer;
			font-size: 0.7rem;
			font-weight: 700;
			margin: 6px 6px 6px 0;
			min-height: 1.8rem;
			min-width: 1.8rem;
			padding: 0;
		}
	`;

	constructor() {
		super();

		this._audioDescriptionTracks = [];
		this._audioDescriptionIndex = 0;
		this._audioDescriptionPreviousTime = -0.001;
		this._audioDescriptionPausedVideo = false;
		this._audioDescriptionPlaying = false;
		this._canReplayAudioDescription = false;
	}

	disconnectedCallback() {
		this._cancelAudioDescription();
		super.disconnectedCallback();
	}

	_cancelAudioDescription() {
		if (this._audioDescriptionUtterance && window.speechSynthesis) {
			window.speechSynthesis.cancel();
		}
		this._audioDescriptionUtterance = null;
		this._audioDescriptionPausedVideo = false;
		this._audioDescriptionPlaying = false;
	}

	_getAudioDescriptionsButtonView() {
		if (!this._audioDescriptionTracks?.length) return null;

		const tooltip = this.localize('components:mediaPlayer:audioDescriptions');
		const replayTooltip = this.localize('components:mediaPlayer:replayAudioDescription');

		return html`
			${this._selectedAudioDescriptionLanguage ? html`
				<d2l-button-icon
					icon="tier1:undo"
					id="d2l-labs-media-player-audio-description-replay-button"
					text="${replayTooltip}"
					theme="${ifDefined(this._getTheme())}"
					?disabled="${!this._audioDescriptionPlaying}"
					@click="${this._replayAudioDescription}"
				></d2l-button-icon>
				<d2l-tooltip position="top" for="d2l-labs-media-player-audio-description-replay-button">${replayTooltip}</d2l-tooltip>
			` : null}
			<d2l-dropdown>
				<d2l-button-icon
					aria-label="${tooltip}"
					class="d2l-dropdown-opener"
					id="d2l-labs-media-player-audio-description-button"
					title="${tooltip}"
					theme="${ifDefined(this._getTheme())}"
					?active="${this._audioDescriptionPlaying}"
				><d2l-icon-custom slot="icon"><svg width="28" height="14" viewBox="0 0 28 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.89199 8.55L7.21999 3.9805C7.13766 3.77783 7.05216 3.53717 6.96349 3.2585C6.87483 2.97983 6.78616 2.679 6.69749 2.356C6.61516 2.679 6.52966 2.983 6.44099 3.268C6.35233 3.54667 6.26683 3.7905 6.18449 3.9995L4.52199 8.55H8.89199ZM13.4045 13.737H11.4285C11.2068 13.737 11.0263 13.6832 10.887 13.5755C10.7477 13.4615 10.6432 13.3222 10.5735 13.1575L9.54749 10.355H3.85699L2.83099 13.1575C2.78033 13.3032 2.68216 13.4362 2.53649 13.5565C2.39083 13.6768 2.21033 13.737 1.99499 13.737H-7.82078e-06L5.40549 -1.43051e-06H8.00849L13.4045 13.737ZM27.2244 6.8685C27.2244 7.8755 27.0565 8.80017 26.7209 9.6425C26.3852 10.4848 25.9134 11.21 25.3054 11.818C24.6974 12.426 23.9659 12.8978 23.1109 13.2335C22.2559 13.5692 21.3059 13.737 20.2609 13.737H15.0264V-1.43051e-06H20.2609C21.3059 -1.43051e-06 22.2559 0.170999 23.1109 0.512999C23.9659 0.848665 24.6974 1.3205 25.3054 1.9285C25.9134 2.53017 26.3852 3.25217 26.7209 4.0945C27.0565 4.93683 27.2244 5.8615 27.2244 6.8685ZM24.6024 6.8685C24.6024 6.11483 24.501 5.44033 24.2984 4.845C24.102 4.24333 23.8139 3.73667 23.4339 3.325C23.0602 2.907 22.6042 2.58717 22.0659 2.3655C21.5339 2.14383 20.9322 2.033 20.2609 2.033H17.5914V11.704H20.2609C20.9322 11.704 21.5339 11.5932 22.0659 11.3715C22.6042 11.1498 23.0602 10.8332 23.4339 10.4215C23.8139 10.0035 24.102 9.49683 24.2984 8.9015C24.501 8.29983 24.6024 7.62217 24.6024 6.8685Z" fill="white"/>
</svg></d2l-icon-custom></d2l-button-icon>
				<d2l-dropdown-content no-padding no-pointer theme="${ifDefined(this._getTheme())}">
					<div slot="header">${this.localizeHTML('components:mediaPlayer:extendedAudioDescription')}</div>
                    <d2l-menu label="${tooltip}" @d2l-menu-item-change=${this._onAudioDescriptionMenuItemChange} theme="${ifDefined(this._getTheme())}">
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
		`;
	}

	_getAudioDescriptionVoice(language) {
		const normalizedLanguage = (language || '').toLowerCase();
		if (!normalizedLanguage || !window.speechSynthesis?.getVoices) return null;

		const voices = window.speechSynthesis.getVoices();
		if (!voices.length) return null;

		const bestMatch = voices.find(voice => (voice.lang || '').toLowerCase() === normalizedLanguage)
			|| voices.find(voice => (voice.lang || '').toLowerCase().startsWith(`${normalizedLanguage.split('-')[0]}-`))
			|| voices.find(voice => (voice.lang || '').toLowerCase().startsWith(`${normalizedLanguage.split('-')[0]}_`))
			|| voices.find(voice => (voice.lang || '').toLowerCase().startsWith(normalizedLanguage.split('-')[0]))
			|| voices.find(voice => (voice.lang || '').toLowerCase().includes(normalizedLanguage.split('-')[0]))
			|| voices[0];
		return bestMatch || null;
	}

	async _loadAudioDescriptionTrack(node) {
		if (!node.label) {
			console.warn("d2l-labs-media-player component requires 'label' text on track");
			return;
		}

		if (!node.src) {
			console.warn("d2l-labs-media-player component requires 'src' text on track");
			return;
		}

		if (!node.srclang) {
			console.warn("d2l-labs-media-player component requires 'srclang' text on track");
			return;
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

	_onAudioDescriptionMenuItemChange(e) {
		this._cancelAudioDescription();
		this._selectedAudioDescriptionLanguage = e.target.value || null;
		this._resetAudioDescriptionCursor(this.currentTime);
		if (this._selectedAudioDescriptionLanguage) {
			this._setPreference(PREFERENCES_AUDIO_DESCRIPTION_LANGUAGE_KEY, this._selectedAudioDescriptionLanguage);
		} else {
			this._clearPreference(PREFERENCES_AUDIO_DESCRIPTION_LANGUAGE_KEY);
		}
	}

	_onAudioDescriptionTimeUpdate(currentTime) {
		const track = this._audioDescriptionTracks?.find(track => track.srclang === this._selectedAudioDescriptionLanguage);
		if (!track) return;

		if (currentTime < this._audioDescriptionPreviousTime) {
			this._audioDescriptionIndex = track.descriptions.findIndex(description => description.time >= currentTime);
			if (this._audioDescriptionIndex < 0) this._audioDescriptionIndex = track.descriptions.length;
			this._cancelAudioDescription();
		}

		const next = track.descriptions[this._audioDescriptionIndex];
		if (next && this._audioDescriptionPreviousTime < next.time && currentTime >= next.time) {
			this._audioDescriptionIndex += 1;
			this._speakAudioDescription(next, track);
		}
		this._audioDescriptionPreviousTime = currentTime;
	}

	_replayAudioDescription() {
		if (!this._audioDescriptionPlaying) return;
		const track = this._audioDescriptionTracks?.find(track => track.srclang === this._selectedAudioDescriptionLanguage);
		const description = track?.descriptions.findLast(description => description.time <= this.currentTime);
		if (!description) return;

		// Preserve the pause from the original playback so the video still resumes after the replay
		const pausedVideo = this._audioDescriptionPausedVideo;
		this._speakAudioDescription(description, track);
		if (pausedVideo) this._audioDescriptionPausedVideo = true;
	}

	_resetAudioDescriptionCursor(time) {
		this._cancelAudioDescription();
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

	_speakAudioDescription(description, track) {
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
			const voice = this._getAudioDescriptionVoice(track.srclang);
			if (voice) utterance.voice = voice;
			window.speechSynthesis.speak(utterance);
		};

		if (window.speechSynthesis.getVoices().length) {
			speak();
			return;
		}

		// Speaking before voices have loaded is silently dropped in some browsers
		let timeout;
		const onVoicesChanged = () => {
			clearTimeout(timeout);
			window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
			speak();
		};
		timeout = setTimeout(onVoicesChanged, VOICES_LOAD_TIMEOUT_MS);
		window.speechSynthesis.addEventListener('voiceschanged', onVoicesChanged);
	}
};
