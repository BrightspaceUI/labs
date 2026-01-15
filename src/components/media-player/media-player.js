import '@brightspace-ui/core/components/alert/alert.js';
import '@brightspace-ui/core/components/button/button-icon.js';
import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-ui/core/components/dropdown/dropdown.js';
import '@brightspace-ui/core/components/dropdown/dropdown-menu.js';
import '@brightspace-ui/core/components/dropdown/dropdown-button-subtle.js';
import '@brightspace-ui/core/components/icons/icon.js';
import '@brightspace-ui/core/components/loading-spinner/loading-spinner.js';
import '@brightspace-ui/core/components/menu/menu.js';
import '@brightspace-ui/core/components/menu/menu-item.js';
import '@brightspace-ui/core/components/menu/menu-item-link.js';
import '@brightspace-ui/core/components/menu/menu-item-radio.js';
import '@brightspace-ui/core/components/offscreen/offscreen.js';
import './slider-bar.js';
import 'webvtt-parser';
import './media-player-audio-bars.js';
import { css, html, LitElement, unsafeCSS } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import fullscreenApi from './fullscreen-api.js';
import Fuse from 'fuse.js';
import { getFocusPseudoClass } from '@brightspace-ui/core/helpers/focus.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { labelStyles } from '@brightspace-ui/core/components/typography/styles.js';
import { LocalizeLabsElement } from '../localize-labs-element.js';
import parseSRT from 'parse-srt/src/parse-srt.js';
import ResizeObserver from 'resize-observer-polyfill';
import { RtlMixin } from '@brightspace-ui/core/mixins/rtl-mixin.js';
import { styleMap } from 'lit/directives/style-map.js';

const DEFAULT_SPEED = '1.0';
const DEFAULT_VOLUME = '1.0';
const FULLSCREEN_ENABLED = fullscreenApi.isEnabled;
const HIDE_DELAY_MS = 3000;
const KEY_BINDINGS = {
	play: 'k',
	mute: 'm',
	fullscreen: 'f'
};
const MIN_TRACK_WIDTH_PX = 250;
const IS_IOS = /iPad|iPhone|iPod/.test(navigator.platform);
const PLAYBACK_SPEEDS = ['0.25', '0.5', '0.75', DEFAULT_SPEED, '1.25', '1.5', '2.0'];
const PREFERENCES_KEY_PREFIX = 'D2L.MediaPlayer.Preferences';
const PREFERENCES_SPEED_KEY = `${PREFERENCES_KEY_PREFIX}.Speed`;
const PREFERENCES_TRACK_IDENTIFIER_KEY = `${PREFERENCES_KEY_PREFIX}.Track`;
const PREFERENCES_VOLUME_KEY = `${PREFERENCES_KEY_PREFIX}.Volume`;
const SEEK_BAR_UPDATE_PERIOD_MS = 0;
const SOURCE_TYPES = {
	audio: 'audio',
	video: 'video'
};
const TIMEOUT_FOR_DOUBLE_CLICK_MS = 500;
const TRACK_KINDS = {
	captions: 'captions',
	subtitles: 'subtitles'
};
const Url = URL || window.URL;
const FUSE_OPTIONS = options => ({
	keys: ['text'],
	ignoreLocation: true,
	threshold: 0.1,
	...options
});
const SEARCH_CONTAINER_HOVER_CLASS = 'd2l-labs-media-player-search-container-hover';
const DEFAULT_PREVIEW_WIDTH = 160;
const DEFAULT_PREVIEW_HEIGHT = 90;

const SAFARI_EXPIRY_EARLY_SWAP_SECONDS = 10;
const SAFARI_EXPIRY_MIN_ERROR_EMIT_SECONDS = 30;
const isSafari = () => navigator.userAgent.indexOf('Safari') > -1 && navigator.userAgent.indexOf('Chrome') === -1;
const tryParseUrlExpiry = url => {
	try {
		const urlObj = new URL(url);
		return urlObj.searchParams ? urlObj.searchParams.get('Expires') : null;
	} catch {
		return null;
	}
};

class MediaPlayer extends LocalizeLabsElement(RtlMixin(LitElement)) {

	static get properties() {
		return {
			allowDownload: { type: Boolean, attribute: 'allow-download', reflect: true },
			autoplay: { type: Boolean },
			crossorigin: { type: String },
			downloadFilename: { type: String, attribute: 'download-filename' },
			durationHint: { type: Number, attribute: 'duration-hint' },
			hideCaptionsSelection: { type: Boolean, attribute: 'hide-captions-selection' },
			hideSeekBar: { type: Boolean, attribute: 'hide-seek-bar' },
			loop: { type: Boolean },
			mediaType: { type: String, attribute: 'media-type' },
			metadata: { type: Object },
			poster: { type: String },
			src: { type: String },
			thumbnails: { type: String },
			disableSetPreferences: { type: Boolean, attribute: 'disable-set-preferences' },
			transcriptViewerOn: { type: Boolean, attribute: 'transcript-viewer-on' },
			playInView: { type: Boolean, attribute: 'play-in-view' },
			_chapters: { type: Array, attribute: false },
			_currentTime: { type: Number, attribute: false },
			_duration: { type: Number, attribute: false },
			_heightPixels: { type: Number, attribute: false },
			_hoverTime: { type: Number, attribute: false },
			_hovering: { type: Boolean, attribute: false },
			_loading: { type: Boolean, attribute: false },
			_maintainHeight: { type: Number, attribute: false },
			_mediaContainerAspectRatio: { type: Object, attribute: false },
			_message: { type: Object, attribute: false },
			_muted: { type: Boolean, attribute: false },
			_playing: { type: Boolean, attribute: false },
			_posterVisible: { type: Boolean, attribute: false },
			_recentlyShowedCustomControls: { type: Boolean, attribute: false },
			_searchResults: { type: Array, attribute: false },
			_selectedQuality: { type: String, attribute: false },
			_selectedSpeed: { type: String, attribute: false },
			_selectedTrackIdentifier: { type: Object, attribute: false },
			_sources: { type: Object, attribute: false },
			_thumbnailsImage: { type: Object, attribute: false },
			_timelinePreviewOffset: { type: Number, attribute: false },
			_trackFontSizeRem: { type: Number, attribute: false },
			_timeFontSizeRem: { type: Number, attribute: false },
			_trackText: { type: String, attribute: false },
			_tracks: { type: Array, attribute: false },
			_usingVolumeContainer: { type: Boolean, attribute: false },
			_volume: { type: Number, attribute: false },
		};
	}

	static get styles() {
		return [ labelStyles, css`
			:host {
				display: block;
				min-height: 140px;
				position: relative;
			}

			:host([hidden]) {
				display: none;
			}

			#d2l-labs-media-player-media-container {
				align-items: center;
				justify-content: center;
				/* This max-height prevents the video from growing out of bounds and appearing cut off inside of ISF iframes */
				max-height: 100vh;
				overflow: hidden;
				position: relative;
				width: 100%;
			}

			.d2l-labs-media-player-type-is-audio {
				background-color: #ffffff;
			}

			.d2l-labs-media-player-type-is-video {
				background-color: #000000;
				color: #ffffff;
			}


			#d2l-labs-media-player-video {
				display: block;
				height: 100%;
				max-height: var(--d2l-labs-media-player-video-max-height, 100vh);
				min-height: 100%;
				position: relative;
				width: 100%;
			}

			#d2l-labs-media-player-video-poster {
				cursor: pointer;
				height: auto;
				position: absolute;
				width: 100%;
				z-index: 1;
			}

			#d2l-labs-media-player-video-poster-play-button {
				background-color: rgba(0, 0, 0, 0.69);
				border: none;
				border-radius: 50%;
				cursor: pointer;
				padding: 2em;
				position: absolute;
				z-index: 2;
			}

			#d2l-labs-media-player-video-poster-play-button[transcript] {
				background-color: rgba(0, 0, 0, 0.69);
				border: none;
				border-radius: 50%;
				cursor: pointer;
				left: 10%;
				padding: 2em;
				position: absolute;
				top: 10%;
				transform: scale(0.5);
				z-index: 2;
			}


			#d2l-labs-media-player-video-poster-play-button > d2l-icon {
				color: #ffffff;
			}

			#d2l-labs-media-player-media-controls {
				bottom: 0;
				position: absolute;
				transition: bottom 500ms ease;
				width: 100%;
				z-index: 2;
			}

			.d2l-labs-media-player-type-is-audio #d2l-labs-media-player-media-controls {
				background-color: #ffffff;
			}
			.d2l-labs-media-player-type-is-video #d2l-labs-media-player-media-controls {
				background-color: rgba(0, 0, 0, 0.69);
			}

			#d2l-labs-media-player-media-controls.d2l-labs-media-player-hidden {
				bottom: -8rem;
			}

			#d2l-labs-media-player-seek-bar {
				--d2l-knob-focus-color: #ffffff;
				--d2l-knob-focus-size: 4px;
				--d2l-knob-size: 16px;
				--d2l-outer-knob-color: var(--d2l-color-celestine-plus-1);
				--d2l-progress-border-radius: 0;
				position: absolute;
				top: -9px;
				width: 100%;
				z-index: 1;
			}

			#d2l-labs-media-player-seek-bar:focus {
				--d2l-knob-box-shadow: 0 2px 6px 3px rgba(0, 0, 0, 1);
			}

			#d2l-labs-media-player-buttons {
				align-items: center;
				direction: ltr;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				margin-left: 6px;
			}

			[dir="rtl"] #d2l-labs-media-player-buttons {
				margin-left: 0;
				margin-right: 6px;
			}

			.d2l-labs-media-player-flex-filler {
				flex: auto;
			}

			d2l-button-icon {
				--d2l-button-icon-min-height: 1.8rem;
				--d2l-button-icon-min-width: 1.8rem;
				margin: 6px 6px 6px 0;
			}

			#d2l-labs-media-player-time:hover {
				cursor: auto;
			}

			#d2l-labs-media-player-volume-container {
				position: relative;
			}

			#d2l-labs-media-player-volume-level-container {
				bottom: calc(1.8rem + 6px);
				height: 11px;
				left: 0;
				position: absolute;
				width: 1.8rem;
				z-index: 2;
			}

			#d2l-labs-media-player-volume-level-container.d2l-labs-media-player-hidden {
				left: -10000px;
			}

			#d2l-labs-media-player-volume-level-background {
				align-items: center;
				background-color: rgba(0, 0, 0, 0.69);
				border-radius: 0 0.3rem 0.3rem 0;
				bottom: 4.55rem;
				display: flex;
				height: 1.8rem;
				justify-content: center;
				left: -2.7rem;
				padding: 0 0.625rem;
				position: relative;
				width: 6rem;
			}

			#d2l-labs-media-player-volume-slider-container {
				height: 100%;
				width: 100%;
			}

			#d2l-labs-media-player-volume-slider {
				--d2l-knob-focus-color: #ffffff;
				--d2l-knob-focus-size: 0.25rem;
				--d2l-knob-size: 0.8rem;
				--d2l-outer-knob-color: var(--d2l-color-celestine-plus-1);
				position: relative;
				top: calc(0.5rem + 1px);
			}

			.d2l-labs-media-player-rotated {
				transform: rotate(-90deg);
			}

			#d2l-labs-media-player-audio-bars-container {
				align-items: center;
				display: flex;
				flex-wrap: nowrap;
				height: 8.5rem;
				justify-content: center;
				left: calc(2.1rem + 6px);
				position: absolute;
				top: calc(50% - 5.125rem);
				width: calc(100% - 4.2rem - 12px);
			}

			d2l-labs-media-player-audio-bars {
				height: 2rem;
			}

			#d2l-labs-media-player-track-container {
				align-items: center;
				color: #ffffff;
				display: flex;
				justify-content: center;
				overflow: hidden;
				position: absolute;
				text-align: center;
				transition: bottom 500ms ease;
				width: 100%;
			}

			@media screen and (min-width: 768px) {
				#d2l-labs-media-player-track-container > div {
					align-items: center;
					display: flex;
					justify-content: center;
					min-width: ${MIN_TRACK_WIDTH_PX}px;
					width: 50%;
				}
			}

			@media screen and (max-width: 767px) {
				#d2l-labs-media-player-track-container > div {
					align-items: center;
					display: flex;
					justify-content: center;
					width: 100%;
				}
			}

			#d2l-labs-media-player-track-container > div > span {
				background-color: rgba(0, 0, 0, 0.69);
				box-shadow: 0.3rem 0 0 rgba(0, 0, 0, 0.69), -0.3rem 0 0 rgba(0, 0, 0, 0.69);
				color: white;
				line-height: 1.35rem;
				white-space: pre-wrap;
			}

			#d2l-labs-media-player-audio-play-button-container {
				background-color: white;
				position: absolute;
			}

			#d2l-labs-media-player-audio-play-button {
				background-color: transparent;
				border: none;
				border-radius: 12px;
				margin: 2px;
				padding: 2px;
			}

			#d2l-labs-media-player-audio-play-button:focus {
				outline: none;
			}

			#d2l-labs-media-player-audio-play-button:hover {
				background: var(--d2l-color-mica);
				background-clip: content-box;
				cursor: pointer;
			}

			#d2l-labs-media-player-audio-play-button:${unsafeCSS(getFocusPseudoClass())} {
				border: 2px solid var(--d2l-color-celestine);
			}

			#d2l-labs-media-player-audio-play-button > d2l-icon {
				height: 2.75rem;
				width: 2.75rem;
			}

			.d2l-labs-media-player-chapter-marker, .d2l-labs-media-player-chapter-marker-highlight {
				cursor: pointer;
				height: 6px;
				pointer-events: none;
				position: absolute;
				top: 4px;
				width: 3px;
				z-index: 2;
			}

			.d2l-labs-media-player-chapter-marker {
				background-color: var(--d2l-color-ferrite);
			}

			.d2l-labs-media-player-chapter-marker-highlight {
				background-color: var(--d2l-color-celestine-minus-1);
			}

			.d2l-labs-media-player-chapter-marker[theme="dark"] {
				background-color: white;
			}

			#d2l-labs-media-player-search-container {
				align-items: center;
				display: flex;
			}
			#d2l-labs-media-player-search-container.d2l-labs-media-player-search-container-hidden {
				display: none;
			}

			#d2l-labs-media-player-search-container #d2l-labs-media-player-search-input {
				border-color: rgba(48, 52, 54, 0.1);
				border-radius: 20px;
				color: var(--d2l-color-ferrite);
				font-size: 1rem;
				opacity: 0;
				outline: 0;
				padding: 0;
				position: relative;
				transition: width 0.4s, opacity 0.4s, visibility 0s;
				visibility: hidden;
				width: 0;
			}

			#d2l-labs-media-player-search-container #d2l-labs-media-player-search-input[theme="dark"] {
				background-color: rgba(24, 26, 27, 0.15);
				color: rgb(206, 216, 225);
			}

			#d2l-labs-media-player-search-container #d2l-labs-media-player-search-input:focus,
			#d2l-labs-media-player-search-container #d2l-labs-media-player-search-input:active {
				box-shadow: rgb(24 26 27) 0 0 1px;
				outline-color: initial;
			}

			#d2l-labs-media-player-search-container:hover #d2l-labs-media-player-search-input,
			#d2l-labs-media-player-search-container.d2l-labs-media-player-search-container-hover #d2l-labs-media-player-search-input {
				height: 1.2rem;
				opacity: 1;
				padding: 0 0.35rem;
				visibility: visible;
				width: 6rem;
			}

			#d2l-labs-media-player-timeline-markers-container {
				position: absolute;
				top: -9px;
				transition: all 0.2s;
				width: 100%;
			}

			#d2l-labs-media-player-thumbnails-preview-container {
				bottom: 60px;
				position: absolute;
				transform: translateX(-50%);
				z-index: 2;
			}

			#d2l-labs-media-player-thumbnails-preview-chapter {
				background: #00000072;
				position: absolute;
				text-align: center;
				text-shadow: 0 0 5px rgb(0 0 0 / 75%);
				width: 100%;
				z-index: 2;
			}

			#d2l-labs-media-player-thumbnails-preview-time {
				background: #00000042;
				bottom: 3px;
				font-size: 14px;
				left: 0;
				position: absolute;
				text-align: center;
				text-shadow: 0 0 4px rgb(0 0 0 / 75%);
				width: 100%;
				z-index: 2;
			}

			#d2l-labs-media-player-thumbnails-preview-image {
				background-repeat: no-repeat;
				position: relative;
				width: 100%;
				z-index: 2;
			}

			.d2l-labs-media-player-search-marker {
				color: var(--d2l-color-ferrite);
				cursor: pointer;
				height: 6px;
				pointer-events: none;
				position: absolute;
				top: 4px;
				width: 6px;
				z-index: 2;
			}

			.d2l-labs-media-player-search-marker[theme="dark"] {
				color: white;
			}

			#d2l-labs-media-player-settings-menu {
				bottom: calc(1.8rem + 18px);
				left: calc(0.2rem + 14px);
			}

			[dir="rtl"] #d2l-labs-media-player-settings-menu {
				left: 0;
				right: -0.8rem;
			}

			.d2l-labs-media-player-full-area-centered {
				align-items: center;
				display: flex;
				height: 100%;
				justify-content: center;
				left: 0;
				position: absolute;
				top: 0;
				width: 100%;
				z-index: 2;
			}

			#d2l-labs-media-player-alert-inner {
				display: flex;
				flex-direction: row;
				justify-content: flex-start;
			}

			#d2l-labs-media-player-alert-inner > svg {
				flex-shrink: 0;
				margin-right: 0.5rem;
			}

			#d2l-labs-media-player-alert-inner > span {
				font-size: 1rem;
				line-height: 2.1rem;
			}

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
	` ];
	}

	constructor() {
		super();

		this.allowDownload = false;
		this.autoplay = false;
		this.loop = false;
		this.playInView = false;

		this._chapters = [];
		this._currentTime = 0;
		this._determiningSourceType = true;
		this._duration = this.durationHint || 1;
		this._heightPixels = null;
		this._hoverTime = 0;
		this._hovering = false;
		this._hoveringMediaControls = false;
		this._loading = false;
		this._message = {
			text: null,
			type: null
		};
		this._muted = false;
		this._playing = false;
		this._posterVisible = true;
		this._recentlyShowedCustomControls = false;
		this._searchInputFocused = false;
		this._searchInstances = {};
		this._searchResults = [];
		this._settingsMenu = null;
		this._sources = {};
		this._timelinePreviewOffset = 0;
		this._trackFontSizeRem = 1;
		this._timeFontSizeRem = 0.95; // 0.95rem is the default font size for d2l-typography
		this._trackText = null;
		this._tracks = [];
		this._usingVolumeContainer = false;
		this._videoClicked = false;
		this._volume = 1;
		this._webVTTParser = new window.WebVTTParser();
		this._playRequested = false;
		this._mediaContainerAspectRatio = {
		};
		this.afterCaptions = [];
		this.beforeCaptions = [];
	}

	get currentTime() {
		return this._currentTime;
	}

	set currentTime(time) {
		this._currentTime = time;
		if (this._media) {
			this._media.currentTime = time;
		}
		this._syncDisplayedTrackTextToSelectedTrack();
	}

	get volume() {
		return this._media ? this._media.volume : 0;
	}

	set volume(volume) {
		if (this._media) {
			this._media.volume = volume;
		}
		this._setPreference(PREFERENCES_VOLUME_KEY, volume);
	}

	get activeCue() {
		if (!this._media) return null;
		for (let i = 0; i < this._media.textTracks.length; i++) {
			if (this._media.textTracks[i].mode === 'hidden') {
				if (this._media &&
					this._media.textTracks &&
					this._media.textTracks[0] &&
					this._media.textTracks[0].activeCues &&
					this._media.textTracks[0].activeCues[0]) {
					return this._media.textTracks[0].activeCues[0];
				} else {
					return null;
				}
			}
		}
		return null;
	}

	get duration() {
		return this._duration;
	}

	get ended() {
		return (this._media && this._media.ended);
	}

	get isIOSVideo() {
		return IS_IOS && this.mediaType === SOURCE_TYPES.video;
	}

	get paused() {
		return (this._media && this._media.paused);
	}

	get selectedTrackSrcLang() {
		return this._getSrclangFromTrackIdentifier(this._selectedTrackIdentifier);
	}

	get textTracks() {
		return this._media ? this._media.textTracks : null;
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		if (!this.src) {
			const sourceNodes = Array.from(this.getElementsByTagName('source'));
			if (sourceNodes.length < 1) console.warn('d2l-labs-media-player component requires source tags if src is not set');
		}

		this._mediaContainer = this.shadowRoot.getElementById('d2l-labs-media-player-media-container');
		this._playButton = this.shadowRoot.getElementById('d2l-labs-media-player-play-button');
		this._seekBar = this.shadowRoot.getElementById('d2l-labs-media-player-seek-bar');
		this._settingsMenu = this.shadowRoot.getElementById('d2l-labs-media-player-settings-menu');
		this._speedLevelBackground = this.shadowRoot.getElementById('d2l-labs-media-player-speed-level-background');
		this._volumeSlider = this.shadowRoot.getElementById('d2l-labs-media-player-volume-slider');
		this._searchInput = this.shadowRoot.getElementById('d2l-labs-media-player-search-input');
		this._searchContainer = this.shadowRoot.getElementById('d2l-labs-media-player-search-container');

		this._getMetadata();

		this._startUpdatingCurrentTime();
		new ResizeObserver((entries) => {
			for (const entry of entries) {
				const { height, width } = entry.contentRect;
				// Handles potential flickering of video dimensions - given two heights (A, B), if we see that
				// the heights alternate A -> B -> A (height === two heights ago), we set the height to the larger of A/B
				// Furthermore, check that the height difference was within the threshold of a flicker (i.e., not a full screen toggle)
				const flickerThreshold = 20;
				if ((height === this._twoHeightsAgo && width === this._twoWidthsAgo)
					&& Math.abs(this._lastHeight - height) < flickerThreshold
				) {
					this._heightPixels = Math.floor(Math.max(height, this._lastHeight));
				} else {
					this._heightPixels = null;
				}

				this._twoHeightsAgo = this._lastHeight;
				this._lastHeight = height;

				this._twoWidthsAgo = this._lastWidth;
				this._lastWidth = width;

				const multiplier = Math.sqrt(Math.min(height, width) / MIN_TRACK_WIDTH_PX);
				this._trackFontSizeRem = multiplier;
				this._timeFontSizeRem = Math.min(multiplier * 0.9 * 0.95, 0.95);
			}
		}).observe(this._mediaContainer);
	}

	render() {
		const fullscreenIcon = fullscreenApi.isFullscreen ? 'tier1:smallscreen' : 'tier1:fullscreen';
		const playIcon = this._playing ? 'tier1:pause' : 'tier1:play';
		const volumeIcon = this._muted ? 'tier1:volume-muted' : 'tier1:volume';

		const fullscreenTooltip = `${fullscreenApi.isFullscreen ? this.localize('components:mediaPlayer:exitFullscreen') : this.localize('components:mediaPlayer:fullscreen')} (${KEY_BINDINGS.fullscreen})`;
		const playTooltip = `${this._playing ? this.localize('components:mediaPlayer:pause') : this.localize('components:mediaPlayer:play')} (${KEY_BINDINGS.play})`;
		const volumeTooltip = `${this._muted ? this.localize('components:mediaPlayer:unmute') : this.localize('components:mediaPlayer:mute')} (${KEY_BINDINGS.mute})`;

		const height = this._maintainHeight ? `${this._maintainHeight}px` : (this._heightPixels ? `${this._heightPixels}px` : '100%');
		const mediaContainerStyle = {
			cursor: !this._hidingCustomControls() ? 'auto' : 'none',
			display: 'flex',
			minHeight: this.mediaType === SOURCE_TYPES.audio ? 'min(17rem, 90vh)' : 'auto',
			height,
			...this._mediaContainerAspectRatio,
		};
		const timeStyle = {
			fontSize: `${this._timeFontSizeRem}rem`,
			margin: `0 ${this._timeFontSizeRem * 0.79}rem`, // At max size, this is 15px.
			lineHeight: `${this._timeFontSizeRem * 1.05263158}rem`, // At max size, this is 1rem.
		};

		const trackContainerStyle = { bottom: this._hidingCustomControls() ? '12px' : 'calc(1.8rem + 38px)' };
		const trackSpanStyle = { fontSize: `${this._trackFontSizeRem}rem`, lineHeight: `${this._trackFontSizeRem * 1.2}rem` };

		const mediaContainerClass = { 'd2l-labs-media-player-type-is-audio': this.mediaType === SOURCE_TYPES.audio, 'd2l-labs-media-player-type-is-video': this.mediaType === SOURCE_TYPES.video };
		const mediaControlsClass = { 'd2l-labs-media-player-hidden': this._hidingCustomControls() };
		const theme = this.mediaType === SOURCE_TYPES.video ? 'dark' : undefined;
		const volumeLevelContainerClass = { 'd2l-labs-media-player-hidden': !this._usingVolumeContainer || this._hidingCustomControls() };
		const searchContainerClass = { 'd2l-labs-media-player-search-container-hidden' : !this._searchInstances[this._getSrclangFromTrackIdentifier(this._selectedTrackIdentifier)] };
		this._captionsMenuReturnItem?.setAttribute('text', (this.transcriptViewerOn ? this.localize('components:mediaPlayer:language') : this.localize('components:mediaPlayer:captions')));

		const fullscreenButton = this.mediaType === SOURCE_TYPES.video ? html`<d2l-button-icon
			class="d2l-dropdown-opener"
			icon="${fullscreenIcon}"
			text="${fullscreenTooltip}"
			theme="${ifDefined(theme)}"
			@click="${this._toggleFullscreen}"></d2l-button-icon>` : null;

		return html`
		<slot @slotchange=${this._onSlotChange}></slot>

		${this._getLoadingSpinnerView()}

		<div id="d2l-labs-media-player-media-container" class=${classMap(mediaContainerClass)} style=${styleMap(mediaContainerStyle)} @mousemove=${this._onVideoContainerMouseMove} @keydown=${this._listenForKeyboard}>
			${this.transcriptViewerOn ? this._renderTranscriptViewer() : ''}
			${this._getMediaAreaView()}

			${this.isIOSVideo ? null : html`
				${!this._trackText || this.transcriptViewerOn ? null : html`
				<div id="d2l-labs-media-player-track-container" style=${styleMap(trackContainerStyle)} @click=${this._onTrackContainerClick}>
					<div>
						<span style=${styleMap(trackSpanStyle)} role="status">${this._trackText}</span>
					</div>
				</div>
				`}

			<div class=${classMap(mediaControlsClass)} id="d2l-labs-media-player-media-controls" @mouseenter=${this._startHoveringControls} @mouseleave=${this._stopHoveringControls}>
				${this._getTimelinePreview()}
				<div id="d2l-labs-media-player-timeline-markers-container">
					${this._getSearchResultsView()}
					${this._getChapterMarkersView()}
				</div>
				${this.hideSeekBar ? '' : html`
					<d2l-labs-slider-bar
						id="d2l-labs-media-player-seek-bar"
						fullWidth
						solid
						min="0"
						max="${Math.floor(this._getSeekbarValue(this.duration))}"
						value="${this._getSeekbarValue(this._currentTime)}"
						label="${this.localize('components:mediaPlayer:seekSlider')}"
						@drag-start=${this._onDragStartSeek}
						@drag-end=${this._onDragEndSeek}
						@position-change=${this._onPositionChangeSeek}
						@hovering-move=${this._onHoverMove}
						@hovering-start=${this._onHoverStart}
						@hovering-end=${this._onHoverEnd}
					></d2l-labs-slider-bar>
				`}
				<div id="d2l-labs-media-player-buttons">
					<d2l-button-icon icon="${playIcon}" text="${playTooltip}"  @click="${this._togglePlay}" theme="${ifDefined(theme)}"></d2l-button-icon>

					<div id="d2l-labs-media-player-volume-container" @mouseenter="${this._startUsingVolumeContainer}" @mouseleave="${this._stopUsingVolumeContainer}" ?hidden="${IS_IOS}">
						<d2l-button-icon
							class="d2l-dropdown-opener"
							icon="${volumeIcon}"
							text="${volumeTooltip}"
							theme="${ifDefined(theme)}"
							@blur="${this._stopUsingVolumeContainer}"
							@click="${this._toggleMute}"
							@focus="${this._startUsingVolumeContainer}"
						></d2l-button-icon>
						<div id="d2l-labs-media-player-volume-level-container" class=${classMap(volumeLevelContainerClass)}>
							<div class="d2l-labs-media-player-rotated" id="d2l-labs-media-player-volume-level-background">
								<div id="d2l-labs-media-player-volume-slider-container">
									<d2l-labs-slider-bar solid
										id="d2l-labs-media-player-volume-slider"
										vertical
										value="${Math.round(this._volume * 100)}"
										label="${this.localize('components:mediaPlayer:volumeSlider')}"
										@drag-start=${this._onDragStartVolume}
										@focus=${this._startUsingVolumeContainer}
										@focusout=${this._stopUsingVolumeContainer}
										@position-change=${this._onPositionChangeVolume}
									></d2l-labs-slider-bar>
								</div>
							</div>
						</div>
					</div>

					<div id="d2l-labs-media-player-time"
						aria-live="off"
						aria-hidden="true"
						tabindex="-1"
						style=${styleMap(timeStyle)}
						@focus=${this._onPlayerTimeFocus}
						@blur=${this._onPlayerTimeBlur}>
						${MediaPlayer._formatTime(this.currentTime)} / ${MediaPlayer._formatTime(this.duration)}
					</div>

					<div class="d2l-labs-media-player-flex-filler"></div>

					<div
						@mouseenter=${this._onSearchContainerHover}
						@mouseleave=${this._onSearchContainerHover}
						class=${classMap(searchContainerClass)}
						id="d2l-labs-media-player-search-container"
					><d2l-button-icon
							icon="tier1:search"
							id="d2l-labs-media-player-search-button"
							text=${this.localize('components:mediaPlayer:showSearchInput')}
							theme="${ifDefined(theme)}"
						></d2l-button-icon>
						<input
							@blur=${this._onSearchInputBlur}
							@focus=${this._onSearchInputFocus}
							@input=${this._onSearchInputChanged}
							id="d2l-labs-media-player-search-input"
							placeholder="${this.localize('components:mediaPlayer:searchPlaceholder')}"
							theme="${ifDefined(theme)}"
							type="text"
						></input>
					</div>
					<d2l-dropdown>
						<d2l-button-icon class="d2l-dropdown-opener" icon="tier1:gear" text="${this.localize('components:mediaPlayer:settings')}" theme="${ifDefined(theme)}"></d2l-button-icon>
						<d2l-dropdown-menu id="d2l-labs-media-player-settings-menu" no-pointer theme="${ifDefined(theme)}">
							<d2l-menu label="${this.localize('components:mediaPlayer:settings')}" theme="${ifDefined(theme)}">
								<d2l-menu-item id="d2l-labs-media-player-playback-speeds" text="${this.localize('components:mediaPlayer:playbackSpeed')}">
									<div slot="supporting">${this._selectedSpeed}</div>
									<d2l-menu @d2l-menu-item-change=${this._onPlaybackSpeedsMenuItemChange} theme="${ifDefined(theme)}">
										${PLAYBACK_SPEEDS.map(speed => html`
											<d2l-menu-item-radio
												?selected="${speed === this._selectedSpeed}"
												text="${speed === DEFAULT_SPEED ? `${DEFAULT_SPEED} (${this.localize('components:mediaPlayer:default')})` : speed}"
												value="${speed}"
											></d2l-menu-item-radio>
										`)}
									</d2l-menu>
								</d2l-menu-item>
								${this._getTracksMenuView()}
								${this._getQualityMenuView()}
								${(this.allowDownload && this._getCurrentSource()) ? this._getDownloadButtonView() : ''}
								<slot name="settings-menu-item"></slot>
							</d2l-menu>
						</d2l-dropdown-menu>
					</d2l-dropdown>

					${fullscreenButton}

				</div>
			</div>`}
		</div>
		`;
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		if (changedProperties.has('src') || changedProperties.has('mediaType')) {
			this._reloadSource();
		}

		if (changedProperties.has('metadata')) {
			this._getMetadata();
		}

		if (changedProperties.has('thumbnails')) {
			this._getThumbnails();
		}
	}

	exitFullscreen() {
		if (!fullscreenApi.isFullscreen) return;

		this._toggleFullscreen();
	}

	async getLoadingComplete() {
		do {
			await new Promise((resolve) => setTimeout(() => resolve(), 1000));
		} while (this._loading);
	}

	load() {
		if (this._media && this._media.paused) {
			this._media.load();
		}
	}

	pause() {
		if (this._media && !this._media.paused) {
			this._togglePlay();
		}
	}

	play() {
		if (this._media && this._media.paused) {
			this._togglePlay();
		}
	}

	requestFullscreen() {
		if (fullscreenApi.isFullscreen) {
			return;
		}

		this._toggleFullscreen();
	}

	get _media() {
		if (!this.shadowRoot) return null;
		switch (this.mediaType) {
			case SOURCE_TYPES.audio:
				return this.shadowRoot.getElementById('d2l-labs-media-player-audio');
			case SOURCE_TYPES.video:
				return this.shadowRoot.getElementById('d2l-labs-media-player-video');
			default:
				return null;
		}
	}

	get _selectedTrackLabel() {
		for (let i = 0; i < this._tracks.length; i++) {
			const track = this._tracks[i];

			if (track.srclang === this._getSrclangFromTrackIdentifier(this._selectedTrackIdentifier) &&
				track.kind === this._getKindFromTrackIdentifier(this._selectedTrackIdentifier)
			) {
				return track.label;
			}
		}

		return this.localize('components:mediaPlayer:off');
	}

	#searchTimeout = null;

	_clearPreference(preferenceKey) {
		localStorage.removeItem(preferenceKey);
	}

	_closeTranscript() {
		this.dispatchEvent(new CustomEvent('close-transcript', { bubbles: true, composed: true }));
	}

	_disableNativeCaptions() {
		if (!this._media) return;
		for (let i = 0; i < this._media.textTracks.length; i++) {
			const textTrack = this._media.textTracks[i];

			if (this._selectedTrackIdentifier && textTrack.language === this._getSrclangFromTrackIdentifier(this._selectedTrackIdentifier) && textTrack.kind === this._getKindFromTrackIdentifier(this._selectedTrackIdentifier)) {
				textTrack.mode = 'hidden';
			} else {
				textTrack.mode = 'disabled';
			}
		}
	}

	_downloadCaptions() {
		this.dispatchEvent(new CustomEvent('download-captions', { bubbles: true, composed: true }));
	}

	_downloadTranscript() {
		this.dispatchEvent(new CustomEvent('download-transcript', { bubbles: true, composed: true }));
	}

	static _formatTime(totalSeconds) {
		totalSeconds = Math.floor(totalSeconds);

		const str = [];

		const minutes = Math.floor((totalSeconds % 3600) / 60);
		const hours = Math.floor(totalSeconds / 3600);

		if (hours > 0) {
			str.push(`${hours}:`);

			if (minutes < 10) {
				str.push('0');
			}
		}

		str.push(`${minutes}:`);

		const seconds = totalSeconds % 60;
		if (seconds < 10) {
			str.push('0');
		}

		str.push(seconds);

		return str.join('');
	}

	_getAbsoluteUrl(url) {
		const a = document.createElement('a');
		a.setAttribute('href', url);

		return a.href;
	}

	_getChapterMarkersView() {
		if (this._chapters.length === 0) return;

		let start, end;
		if (this._chapters[this._chapters.length - 1].time === Math.floor(this._duration)) this._chapters.pop();

		for (let i = 0; i < this._chapters.length; i++) {
			if (i === this._chapters.length - 1) {
				start = this._chapters[i].time;
				break;
			}
			else if (this._hoverTime >= this._chapters[i].time && this._hoverTime < this._chapters[i + 1].time) {
				start = this._chapters[i].time;
				end = this._chapters[i + 1].time;
				break;
			}
		}

		return this._chapters.map(chapter => {
			const highlight = this._hovering && this._hoverTime >= this._chapters[0].time && (chapter.time === start || chapter.time === end);
			return chapter.time > 0 ? html`
				<div
					class=${highlight ? 'd2l-labs-media-player-chapter-marker-highlight' : 'd2l-labs-media-player-chapter-marker'}
					theme="${ifDefined(this._getTheme())}"
					style=${styleMap({ left: `${this._getPercentageTime(chapter.time)}%` })}
				></div>
			` : null;
		});
	}

	_getChapterTitle() {
		if (!(this._chapters.length > 0 && this._hoverTime >= this._chapters[0].time)) return;

		const chapter = this._chapters.find((_chapter, index, chapters) => (
			index === chapters.length - 1 || (this._hoverTime >= chapters[0].time && this._hoverTime < chapters[index + 1].time)
		));
		const chapterTitle = chapter && chapter.title;

		if (!chapterTitle) return;

		if (typeof chapterTitle === 'string') {
			return chapterTitle;
		}

		for (const locale in chapterTitle) {
			if (locale.split('-')[0] === 'en') {
				return chapterTitle[locale];
			}
		}
	}

	_getCurrentSource() {
		return this.src || this._sources[this._selectedQuality];
	}

	_getDownloadButtonView() {
		const linkHref = this._getDownloadLink();
		return html`
			<d2l-menu-item-link href="${linkHref}" text="${this.localize('components:mediaPlayer:download')}" download=${this.downloadFilename}></d2l-menu-item-link>
		`;
	}

	_getDownloadLink() {
		const srcUrl = this._getCurrentSource();
		if (!srcUrl) return '';
		if (srcUrl.startsWith('blob:')) {
			return srcUrl;
		}

		// Due to Ionic rewriter bug we need to use '_' as a first query string parameter
		const attachmentUrl = `${srcUrl}${srcUrl && srcUrl.indexOf('?') === -1 ? '?_' : ''}`;
		const url = new Url(this._getAbsoluteUrl(attachmentUrl));
		url.searchParams.append('attachment', 'true');
		return url.toString();
	}

	_getKindFromTrackIdentifier(trackIdentifier) {
		return !trackIdentifier ? null : trackIdentifier.kind;
	}

	_getLoadingSpinnerView() {
		return this._loading ? html`
			<div class="d2l-labs-media-player-full-area-centered">
				<d2l-loading-spinner size="100"></d2l-loading-spinner>
			</div>
		` : null;
	}

	_getMediaAreaView() {
		const playIcon = `tier3:${this._playing ? 'pause' : 'play'}`;
		const playTooltip = `${this._playing ? this.localize('components:mediaPlayer:pause') : this.localize('components:mediaPlayer:play')} (${KEY_BINDINGS.play})`;

		switch (this.mediaType) {
			case SOURCE_TYPES.video:
				return html`
					${this._getPosterView()}
					<video
						id="d2l-labs-media-player-video"
						?controls="${IS_IOS}"
						?autoplay="${this.autoplay}"
						?loop="${this.loop}"
						crossorigin="${ifDefined(this.crossorigin)}"
						preload="${this.poster ? 'metadata' : 'auto'}"
						@click=${this._onVideoClick}
						@contextmenu=${this._onContextMenu}
						@durationchange=${this._onDurationChange}
						@ended=${this._onEnded}
						@error=${this._onError}
						@loadeddata=${this._onLoadedData}
						@play=${this._onPlay}
						@playing=${this._onPlaying}
						@pause=${this._onPause}
						@loadedmetadata=${this._onLoadedMetadata}
						tabindex="-1"
						@timeupdate=${this._onTimeUpdate}
						@volumechange=${this._onVolumeChange}
					>
						<source @error=${this._onError}>
					</video>
				`;
			case SOURCE_TYPES.audio:
				return html`
					<audio
						id="d2l-labs-media-player-audio"
						?autoplay="${this.autoplay}"
						?loop="${this.loop}"
						crossorigin="${ifDefined(this.crossorigin)}"
						preload="auto"
						@contextmenu=${this._onContextMenu}
						@durationchange=${this._onDurationChange}
						@ended=${this._onEnded}
						@error=${this._onError}
						@loadeddata=${this._onLoadedData}
						@play=${this._onPlay}
						@playing=${this._onPlaying}
						@pause=${this._onPause}
						@loadedmetadata=${this._onLoadedMetadata}
						@timeupdate=${this._onTimeUpdate}
						@volumechange=${this._onVolumeChange}
					>
						<source @error=${this._onError}></source>
					</audio>
					${this.transcriptViewerOn ? null : html`
					<div id="d2l-labs-media-player-audio-bars-container">
						<div id="d2l-labs-media-player-audio-play-button-container">
							<button id="d2l-labs-media-player-audio-play-button" title="${playTooltip}" aria-label="${playTooltip}" @click=${this._togglePlay}>
								<d2l-icon icon="${playIcon}"></d2l-icon>
							</button>
						</div>

						<d2l-labs-media-player-audio-bars ?playing="${this._playing}"></d2l-labs-media-player-audio-bars>
					</div>`}
				`;
			default:
				return null;
		}
	}

	_getMetadata() {
		if (!this.metadata) return;

		const data = (typeof this.metadata === 'string' || this.metadata instanceof String) ? JSON.parse(this.metadata) : this.metadata;
		if (!(data && data.chapters && data.chapters.length > 0)) return;
		let chapters = data.chapters.map(({ time, title }) => {
			return {
				time: parseInt(time),
				title
			};
		}).sort((a, b) => a.time - b.time);

		if (!data.cuts) {
			data.cuts = [];
		}

		// updating the chapter times based on the cuts, loops over all chapters per cut because it can change multiple chapters
		let cutDiff = 0;
		for (const cut of data.cuts) {
			const cutIn = cut.in - cutDiff;

			const newChapters = new Map(); // using map to preserve sort ordering

			if (!cut.out) { // if cut is until the end of the video
				for (const chapter of chapters) {
					if (chapter.time < cutIn) {
						newChapters.set(chapter.time, chapter.title);
					}
				}
			} else {
				const cutOut = cut.out - cutDiff;
				const cutLength = cutOut - cutIn;

				for (const chapter of chapters) {
					let newTime = chapter.time;
					if (chapter.time > cutIn && chapter.time <= cutOut) {
						newTime = cutIn;
					} else if (chapter.time > cutOut) {
						newTime = chapter.time - cutLength;
					}

					newChapters.set(newTime, chapter.title);
				}

				cutDiff += cutLength;
			}

			chapters = [...newChapters].map(([chapterTime, chapterTitle]) => ({
				time: chapterTime,
				title: chapterTitle
			}));
		}
		this._chapters = chapters;
	}

	_getPercentageTime(time) {
		if (this._media) return (time / this.duration) * 100;
	}

	_getPosterView() {
		if (!this.poster || this.autoplay || !this._posterVisible) return;

		const playIcon = !this._loading ? html`
			<button id="d2l-labs-media-player-video-poster-play-button" aria-label=${this.localize('components:mediaPlayer:play')} title=${this.localize('components:mediaPlayer:play')} transcript="${ifDefined(this.transcriptViewerOn ? true : undefined)}"
				@click=${this._onVideoClick}>
				<d2l-icon icon="tier1:play" theme="${ifDefined(this._getTheme())}"></d2l-icon>
			</button>
		` : null;

		return html`
			${playIcon}
			<img
				id="d2l-labs-media-player-video-poster"
				src="${ifDefined(this.poster)}"
				@click=${this._onVideoClick}
			/>
		`;
	}

	_getPreference(preferenceKey) {
		return localStorage.getItem(preferenceKey);
	}

	_getQualityFromNode(node) {
		return node.getAttribute('label');
	}

	_getQualityMenuView() {
		return !this.src && this._sources && Object.keys(this._sources).length > 1 && this._selectedQuality ? html`
			<d2l-menu-item text="${this.localize('components:mediaPlayer:quality')}">
				<div slot="supporting">${this._selectedQuality}</div>
				<d2l-menu @d2l-menu-item-change=${this._onQualityMenuItemChange} theme="${ifDefined(this._getTheme())}">
					${Object.keys(this._sources).map(quality => html`
						<d2l-menu-item-radio
							?selected=${this._selectedQuality === quality}
							text=${quality}
							value=${quality}
						></d2l-menu-item-radio>
					`)}
				</d2l-menu>
			</d2l-menu-item>
		` : null;
	}

	_getSearchResultsView() {
		return this._searchResults.map(result => {
			return html`
				<d2l-icon
					@click=${this._onTimelineMarkerClick(result)}
					class="d2l-labs-media-player-search-marker"
					icon="tier1:subscribe-filled"
					theme="${ifDefined(this._getTheme())}"
					style=${styleMap({ left: `${this._getPercentageTime(result)}%` })}
				></d2l-icon>
			`;
		});
	}

	_getSeekbarResolutionMultipler() {
		return this._duration < 10 ? 1000 : this._duration < 100 ? 100 : 10;
	}

	_getSeekbarValue(time) {
		return time * this._getSeekbarResolutionMultipler();
	}

	_getSelectedTextTrack() {
		if (!this._media) return null;
		const selectedTrackSrcLang = this._getSrclangFromTrackIdentifier(this._selectedTrackIdentifier);
		for (let i = 0; i < this._media.textTracks.length; i++) {
			if (this._media.textTracks[i].language === selectedTrackSrcLang) {
				return this._media.textTracks[i];
			}
		}
		return null;
	}

	_getSrclangFromTrackIdentifier(trackIdentifier) {
		return !trackIdentifier ? null : trackIdentifier.srclang;
	}

	_getTheme() {
		return this.mediaType === SOURCE_TYPES.video ? 'dark' : undefined;
	}

	_getThumbnails() {
		if (!this.thumbnails) return;
		this._thumbnailsImage = new Image();
		this._thumbnailsImage.src = this.thumbnails;
	}

	_getTimelinePreview() {
		if (!this._hovering) return;
		const chapterTitleLabel = this._getChapterTitle();

		if (!(this.thumbnails && this._thumbnailsImage))
			return html`
				<div id="d2l-labs-media-player-thumbnails-preview-container"
					style="width: ${DEFAULT_PREVIEW_WIDTH}px; left: clamp(${DEFAULT_PREVIEW_WIDTH / 2}px, ${this._timelinePreviewOffset}%, calc(100% - ${DEFAULT_PREVIEW_WIDTH / 2}px));">
					<div
						id="d2l-labs-media-player-thumbnails-preview-image"
					>
						<span id="d2l-labs-media-player-thumbnails-preview-time">${MediaPlayer._formatTime(this._hoverTime)}</span>
					</div>
					${chapterTitleLabel &&
						html`<span class="d2l-label-text" id="d2l-labs-media-player-thumbnails-preview-chapter" style="bottom: ${DEFAULT_PREVIEW_HEIGHT - 60}px">${chapterTitleLabel}</span>`}
				</div>
			`;

		// format of the thumbnail is either [url]/timelineThumbnails-h<height>w<height>i<interval>-<hash>.[png|jpg]
		// or [url]/th<height>w<height>i<interval>-<hash>.[png|jpg]
		const matches = this.thumbnails.match(/(timelineThumbnails-|t)h(\d+)w(\d+)i(\d+)[^/]*$/i);
		if (matches && matches.length !== 5) return; // no matches
		const [ , , thumbHeight, thumbWidth, interval] = matches;

		const width = this._thumbnailsImage.width;
		const height = this._thumbnailsImage.height;

		const rows = height / thumbHeight;
		const columns = width / thumbWidth;

		let thumbNum = Math.floor(this._hoverTime / interval);
		if (thumbNum >= rows * columns) thumbNum = rows * columns - 1;

		const row = Math.floor(thumbNum / columns);
		const column = thumbNum % columns;

		return html`
			<div id="d2l-labs-media-player-thumbnails-preview-container"
				style="width: ${thumbWidth}px; left: clamp(${thumbWidth / 2}px, ${this._timelinePreviewOffset}%, calc(100% - ${thumbWidth / 2}px));">
				<div
					id="d2l-labs-media-player-thumbnails-preview-image"
					style="height: ${thumbHeight}px; background: url(${this._thumbnailsImage.src}) ${-column * thumbWidth}px ${-row * thumbHeight}px / ${width}px ${height}px;"
				>
					<span id="d2l-labs-media-player-thumbnails-preview-time">${MediaPlayer._formatTime(this._hoverTime)}</span>
				</div>
				${chapterTitleLabel &&
					html`<span class="d2l-label-text" id="d2l-labs-media-player-thumbnails-preview-chapter" style="bottom: ${thumbHeight}px">${chapterTitleLabel}</span>`}
			</div>
		`;
	}

	_getTrackIdentifier(srclang, kind) {
		return JSON.stringify({
			kind,
			srclang
		});
	}

	_getTracksMenuView() {
		const isTrackSelected = (track) => (
			track.srclang === this._getSrclangFromTrackIdentifier(this._selectedTrackIdentifier) &&
			track.kind === this._getKindFromTrackIdentifier(this._selectedTrackIdentifier)
		);

		return this._tracks.length > 0 && !this.hideCaptionsSelection ? html`
			<d2l-menu-item text="${this.transcriptViewerOn ? this.localize('components:mediaPlayer:language') : this.localize('components:mediaPlayer:captions')}">
				<div slot="supporting">${this._selectedTrackLabel}</div>
				<d2l-menu id="d2l-labs-media-player-captions-menu"
					@d2l-menu-item-change=${this._onTracksMenuItemChange} theme="${ifDefined(this._getTheme())}">
					${this.transcriptViewerOn ? '' : html`
					<d2l-menu-item-radio text="${this.localize('components:mediaPlayer:off')}" ?selected="${!this._selectedTrackIdentifier}"></d2l-menu-item-radio>`}
					${this._tracks.map(track => html`
						<d2l-menu-item-radio
							?selected="${isTrackSelected(track)}"
							text="${`${track.label}${track.kind === TRACK_KINDS.captions ? ` (${this.localize('components:mediaPlayer:closedCaptionsAcronym')})` : ''}`}"
							value="${this._getTrackIdentifier(track.srclang, track.kind)}"
						></d2l-menu-item-radio>
					`)}
				</d2l-menu>
			</d2l-menu-item>
		` : null;
	}

	_hidingCustomControls() {
		const settingsMenuOpened = this._settingsMenu && this._settingsMenu.opened;
		return this.isIOSVideo || (this._playing && !this._recentlyShowedCustomControls && !this._hoveringMediaControls && !settingsMenuOpened && !this._usingVolumeContainer && this.mediaType === SOURCE_TYPES.video);
	}

	_listenForKeyboard(e) {
		if (this._searchInputFocused) {
			return;
		}
		this._showControls(true);
		switch (e.key) {
			case KEY_BINDINGS.play:
				this._togglePlay();
				break;
			case KEY_BINDINGS.mute:
				this._toggleMute();
				break;
			case KEY_BINDINGS.fullscreen:
				this._toggleFullscreen();
				break;
		}
	}

	_loadVisibilityObserver({ target }) {
		if (this._observer) return;
		this._observer = new IntersectionObserver(([ioEvent]) => {
			if (!ioEvent.isIntersecting && this._playing) {
				this.pause();
				this._observer.unobserve(target);
				this._observer.disconnect();
				delete this._observer;
			}
		}, {
			root: null, // entire viewport
			rootMargin: '0px',
			threshold: 0.05, // if 5% of the target is in the viewport
		});
		this._observer.observe(target);
	}

	_onContextMenu(e) {
		if (!this.allowDownload) e.preventDefault();
	}

	async _onCueChange() {
		if (this.transcriptViewerOn) {
			if (!this._transcriptViewer) {
				this._transcriptViewer = this.shadowRoot.getElementById('video-transcript-viewer')
					|| this.shadowRoot.getElementById('audio-transcript-viewer');
			}
			this._updateTranscriptViewerCues();
			await this.requestUpdate();
			this._scrollTranscriptViewer();
		}
		for (let i = 0; i < this._media.textTracks.length; i++) {
			if (this._media.textTracks[i].mode === 'hidden') {
				if (this._media.textTracks[i].activeCues?.length > 0) {
					this._trackText = this._sanitizeText(this._media.textTracks[i].activeCues[0].text);
				} else this._trackText = null;

				this.dispatchEvent(new CustomEvent('cuechange'));
			}
		}
	}

	_onDownloadButtonPress() {
		const linkHref = this._getDownloadLink();

		const anchor = document.createElement('a');
		anchor.href = linkHref;
		anchor.download = '';
		anchor.click();
		anchor.remove();
	}

	_onDragEndSeek() {
		// _onDragEndSeek() is called once before firstUpdated()
		if (this._seekBar) {
			this._updateCurrentTimeFromSeekbarProgress();

			if (this._pausedForSeekDrag) {
				this._media.play();
			}
			this._dragging = false;
		}

		this.dispatchEvent(new CustomEvent('seeked'));
	}

	_onDragStartSeek() {
		if (this._playing) {
			this._media.pause();
			this._pausedForSeekDrag = true;
		}

		this._dragging = true;
		setTimeout(() => {
			this._updateCurrentTimeFromSeekbarProgress();
		}, 0);

		this.dispatchEvent(new CustomEvent('seeking'));
	}

	_onDragStartVolume() {
		setTimeout(() => {
			this._onPositionChangeVolume();
		}, 0);
	}

	_onDurationChange(e) {
		const newDuration = e.target.duration;
		const newDurationIsValid = isFinite(newDuration) && !isNaN(newDuration);
		const hintIsValid = isFinite(this.durationHint) && !isNaN(this.durationHint);
		this._duration = newDurationIsValid || !hintIsValid
			? newDuration
			: this.durationHint;
		this.dispatchEvent(new CustomEvent('durationchange'));
	}

	_onEnded() {
		this._playRequested = false;
		this.dispatchEvent(new CustomEvent('ended'));
	}

	_onError() {
		this.dispatchEvent(new CustomEvent('error'));
	}

	_onHoverEnd() {
		this._hovering = false;
	}

	_onHoverMove() {
		if (this._hovering && this._seekBar) {
			this._hoverTime = this._seekBar.hoverValue / this._getSeekbarResolutionMultipler();
			this._timelinePreviewOffset = (this._hoverTime / this._duration) * 100;
		}
	}

	_onHoverStart() {
		this._hovering = true;
	}

	_onLoadedData() {
		const media = this._media;
		const width = media.videoWidth;
		const height = media.videoHeight;
		const aspectRatio = width / height;
		this._mediaContainerAspectRatio = { 'aspect-ratio': Number.isNaN(aspectRatio) ? 'auto' : aspectRatio.toString() };
		this._disableNativeCaptions();
		this.dispatchEvent(new CustomEvent('loadeddata'));
	}

	_onLoadedMetadata() {
		if (this._stateBeforeLoad) {
			this.currentTime = this._stateBeforeLoad.currentTime;
			this._media.autoplay = this._stateBeforeLoad.autoplay;

			if (!this._stateBeforeLoad.paused) {
				this.play();
			}

			this._stateBeforeLoad = null;
		}

		this._maintainHeight = null;
		this._loading = false;

		const speed = this._getPreference(PREFERENCES_SPEED_KEY) || DEFAULT_SPEED;
		this._onPlaybackSpeedsMenuItemChange({
			target: {
				value: speed
			}
		});

		const volume = this._getPreference(PREFERENCES_VOLUME_KEY) || DEFAULT_VOLUME;
		this.volume = volume;

		this.dispatchEvent(new CustomEvent('loadedmetadata'));
	}

	_onPause() {
		this._playing = false;
		this.dispatchEvent(new CustomEvent('pause'));
	}

	_onPlay() {
		this.dispatchEvent(new CustomEvent('play'));
	}

	_onPlaybackSpeedsMenuItemChange(e) {
		const speed = e.target.value;
		this._media.playbackRate = speed;
		this._selectedSpeed = speed;
		this._setPreference(PREFERENCES_SPEED_KEY, speed);
	}

	_onPlayerTimeBlur(event) {
		if (event && event.target) {
			event.target.setAttribute('aria-live', 'off');
			event.target.setAttribute('aria-hidden', 'true');
		}
	}

	_onPlayerTimeFocus(event) {
		if (event && event.target) {
			event.target.setAttribute('aria-live', 'polite');
			event.target.removeAttribute('aria-hidden');
		}
	}

	_onPlaying() {
		this._playing = true;
		this._pausedForSeekDrag = false;
	}

	_onPositionChangeSeek() {
		this._updateCurrentTimeFromSeekbarProgress();
		this._showControls(true);
	}

	_onPositionChangeVolume() {
		this.volume = this._volumeSlider.immediateValue / 100;
	}

	_onQualityMenuItemChange(e) {
		if (
			!this._sources ||
			!Object.keys(this._sources) > 0 ||
			e.target.value === this._selectedQuality ||
			!(e.target.value in this._sources)
		) return;

		this._selectedQuality = e.target.value;
		this._reloadSource();
	}

	_onRetryButtonPress() {
		this._loading = true;
	}

	_onSearchButtonPress() {
		if (this._searchContainer.classList.includes((SEARCH_CONTAINER_HOVER_CLASS))) {
			this._searchContainer.classList.remove(SEARCH_CONTAINER_HOVER_CLASS);
		} else {
			this._onSearchContainerHover(true);
		}
	}

	_onSearchContainerHover() {
		if (this._searchInput.value === '') {
			this._searchContainer.classList.remove(SEARCH_CONTAINER_HOVER_CLASS);
		} else {
			this._searchContainer.classList.add(SEARCH_CONTAINER_HOVER_CLASS);
		}
	}

	_onSearchInputBlur() {
		this._searchInputFocused = false;
	}

	_onSearchInputChanged() {
		if (this.#searchTimeout) {
			clearTimeout(this.#searchTimeout);
		}
		this.#searchTimeout = setTimeout(() => {
			this._onSearchContainerHover();
			if (this._searchInput.value.length < 2) {
				this._searchResults = [];
				return;
			}
			const srclang = this._getSrclangFromTrackIdentifier(this._selectedTrackIdentifier);
			const searcher = this._searchInstances[srclang];
			this._searchResults = searcher.search(this._searchInput.value)
				.map(result => (isNaN(result.item.startTime) ? result.item.start : result.item.startTime));
		}, 500);
	}

	_onSearchInputFocus() {
		this._searchInputFocused = true;
	}

	async _onSlotChange(e) {
		this._tracks = [];
		const nodes = e.target.assignedNodes();
		let defaultTrack;

		// this.src case is handled in updated() event
		if (!this.src) {
			// The onSlotChange event does not monitor changes to slot children, so we need
			// to detect the change to the <source> element via a MutationObserver
			const sourceNodes = nodes.filter(node => node.nodeType === Node.ELEMENT_NODE && node.nodeName === 'SOURCE');
			const observer = new MutationObserver(mutationList => {
				mutationList.forEach(mutation => {
					this._parseSourceNode(mutation.target);
				});

				this._reloadSource();
			});
			sourceNodes.map(node => {
				observer.observe(node, { attributes: true });
			});
			this._updateSources(sourceNodes);
			this._reloadSource();
		}

		for (let i = 0; i < nodes.length; i++) {
			const node = nodes[i];

			if (node.nodeType !== Node.ELEMENT_NODE || node.nodeName !== 'TRACK') continue;

			if (!(node.kind in TRACK_KINDS)) {
				console.warn(`d2l-labs-media-player component requires 'kind' text on track to be one of ${Object.keys(TRACK_KINDS)}`);
				continue;
			}

			if (!node.label) {
				console.warn("d2l-labs-media-player component requires 'label' text on track");
				continue;
			}

			if (!node.src) {
				console.warn("d2l-labs-media-player component requires 'src' text on track");
				continue;
			}

			if (!node.srclang) {
				console.warn("d2l-labs-media-player component requires 'srclang' text on track");
				continue;
			}

			const res = await fetch(node.src);
			if (res.status !== 200) {
				console.warn(`d2l-labs-media-player component could not load track from '${node.src}'`);
				this.dispatchEvent(new CustomEvent('trackloadfailed'));
				continue;
			}

			const text = await res.text();

			try {
				node.cues = parseSRT(text);
				node.srt = true;
			} catch {
				node.srt = false;
			}

			this._tracks.push({
				cues: node.cues,
				kind: node.kind,
				label: node.label,
				src: node.src,
				srclang: node.srclang,
				srt: node.srt,
				default: node.default || node['default-ignore-preferences'],
				text
			});

			const defaultIgnorePreferences = node.attributes['default-ignore-preferences'];
			if (node.default || defaultIgnorePreferences) {
				// Stringified to be parsed in initializeTracks
				defaultTrack = {
					srclang: node.srclang,
					kind: node.kind,
					ignorePreferences: !!defaultIgnorePreferences,
				};
			}
		}

		await new Promise(resolve => {
			const interval = setInterval(() => {
				if (!this._media) return;

				clearInterval(interval);

				resolve();
			});
		});

		const oldTracks = this._media.querySelectorAll('track');
		oldTracks.forEach(track => this._media.removeChild(track));

		this._tracks.forEach(track => {
			if (track.srt) {
				const trackElement = this._media.addTextTrack(track.kind, track.label, track.srclang);
				trackElement.oncuechange = this._onCueChange.bind(this);

				track.cues.forEach(cue => {
					trackElement.addCue(new VTTCue(cue.start, cue.end, cue.text));
				});
				this.dispatchEvent(new CustomEvent('trackloaded'));
				if (track.srclang === this._getSrclangFromTrackIdentifier(this._selectedTrackIdentifier)) {
					this._syncDisplayedTrackTextToSelectedTrack();
				}

				this._searchInstances[track.srclang] = new Fuse(track.cues, FUSE_OPTIONS({
					sortFn: (a, b) => a.start - b.start
				}));
			} else {
				const trackElement = document.createElement('track');
				trackElement.src = track.src;
				trackElement.label = track.label;
				trackElement.kind = track.kind;
				trackElement.srclang = track.srclang;
				trackElement.default = track.default ? '' : undefined;
				trackElement.oncuechange = this._onCueChange.bind(this);
				this._media.appendChild(trackElement);
				trackElement.addEventListener('load', () => {
					this.dispatchEvent(new CustomEvent('trackloaded'));
					if (track.srclang === this._getSrclangFromTrackIdentifier(this._selectedTrackIdentifier)) {
						this._syncDisplayedTrackTextToSelectedTrack();
					}
				});

				const { cues } = this._webVTTParser.parse(track.text, 'metadata');
				this._searchInstances[track.srclang] = new Fuse(cues, FUSE_OPTIONS({
					sortFn: (a, b) => a.startTime - b.startTime,
				}));
			}
		});

		// Safari sets the mode of text tracks itself, which have to be overwritten here
		// It has been observed to happen synchronously, or during the next event loop
		// Changing the mode in this event loop and the next catches both scenarios
		// Needs to be caught right away, since the cuechange event can be emitted immediately
		// Set default track to 'hidden'
		const initializeTracks = (() => {
			if (defaultTrack && defaultTrack.ignorePreferences) {
				this._selectedTrackIdentifier = defaultTrack;
			} else {
				const trackPreference = this._getPreference(PREFERENCES_TRACK_IDENTIFIER_KEY);
				this._selectedTrackIdentifier = trackPreference ? JSON.parse(trackPreference) : defaultTrack;
			}

			this._disableNativeCaptions();
		}).bind(this);

		initializeTracks();
		setTimeout(initializeTracks, 0);
	}

	_onTimelineMarkerClick(time) {
		return () => this.currentTime = time;
	}

	_onTimeUpdate() {
		this.dispatchEvent(new CustomEvent('timeupdate'));
	}

	_onTrackContainerClick() {
		if (this.mediaType === SOURCE_TYPES.video) {
			this._onVideoClick();
		}
	}

	_onTracksMenuItemChange(e) {
		setTimeout(() => {
			this.dispatchEvent(new CustomEvent('tracksmenuitemchanged'));
		}, 0);
		this._trackText = null;

		this._selectedTrackIdentifier = e.target.value;

		if (this._selectedTrackIdentifier) {
			this._setPreference(PREFERENCES_TRACK_IDENTIFIER_KEY, this._selectedTrackIdentifier);
			this._selectedTrackIdentifier = JSON.parse(this._selectedTrackIdentifier);
		} else {
			this._clearPreference(PREFERENCES_TRACK_IDENTIFIER_KEY);
		}

		for (let i = 0; i < this._media.textTracks.length; i++) {
			const track = this._media.textTracks[i];

			if (track.language === this._getSrclangFromTrackIdentifier(this._selectedTrackIdentifier) &&
				track.kind === this._getKindFromTrackIdentifier(this._selectedTrackIdentifier)
			) {
				this._media.textTracks[i].mode = 'hidden';
			} else {
				this._media.textTracks[i].mode = 'disabled';
			}
		}
		if (this.transcriptViewerOn) {
			this._updateTranscriptViewerCues();
		}
		this._onSearchInputChanged();
	}

	_onVideoClick() {
		// Given that we are currently not rendering custom controls on the iOS video player,
		//  we let the native controls/player handle the play/pause toggling
		if (IS_IOS) {
			if (this._posterVisible) this._togglePlay();
			return;
		}

		this._togglePlay();
		this._showControls(true);

		if (this._videoClicked) {
			this._toggleFullscreen();
		} else {
			setTimeout(() => {
				if (this._videoClicked) {
					this._videoClicked = false;
				}
			}, TIMEOUT_FOR_DOUBLE_CLICK_MS);
		}

		this._videoClicked = !this._videoClicked;
	}

	_onVideoContainerMouseMove() {
		this._showControls(true);
	}

	_onVolumeChange() {
		this._volume = this.volume;
		this._muted = this._volume === 0;
	}

	_parseSourceNode(node) {
		const quality = this._getQualityFromNode(node);
		if (!quality) {
			console.warn("d2l-labs-media-player component requires 'label' text on source");
			return;
		}
		if (!node.src) {
			console.warn("d2l-labs-media-player component requires 'src' text on source");
			return;
		}

		this._sources[quality] = node.src;
		return quality;
	}

	_reloadSource() {
		if (this._media) {
			const oldSourceNode = this._media.getElementsByTagName('source')[0];
			const updatedSource = this._getCurrentSource();
			if (oldSourceNode.getAttribute('src') !== updatedSource) {
				this._loading = true;

				oldSourceNode.setAttribute('src', updatedSource);

				// Note: Safari doesn't emit an error if a URL expires during playback. To work
				// around this, we manually fire an error slightly before the URL is expected
				// to expire. Note that this only currently works with URLs that include the
				// "Expires" query parameter (e.g. CloudFront signed URLs). It's also not a
				// good long-term solution since it depends on a somewhat accurate client
				// system time.
				if (isSafari() && updatedSource !== undefined) {
					const expires = tryParseUrlExpiry(updatedSource);
					if (expires) {
						const timeToExpiry = (expires * 1000) - Date.now() - SAFARI_EXPIRY_EARLY_SWAP_SECONDS;
						const timeoutPeriod = Math.max(timeToExpiry, SAFARI_EXPIRY_MIN_ERROR_EMIT_SECONDS);
						setTimeout(() => this._onError(), timeoutPeriod);
					}
				}

				// Maintain the height while loading the new source to prevent
				// the video object from resizing temporarily
				this._maintainHeight = this._media.clientHeight;

				if (!this._stateBeforeLoad) {
					this._stateBeforeLoad = {
						paused: !this._pausedForSeekDrag && this.paused && !this._playRequested,
						autoplay: this._media.autoplay,
						currentTime: this.currentTime
					};
				}

				this.pause();
				this.load();
			}
		}
	}

	_renderTranscriptViewer() {
		if (!this._media) {
			return;
		}
		const captionsMenu = this.shadowRoot.getElementById('d2l-labs-media-player-captions-menu');
		if (captionsMenu) {
			this._captionsMenuReturnItem = captionsMenu.shadowRoot.querySelector('d2l-menu-item-return');
			this._captionsMenuReturnItem?.setAttribute('text', this.localize('components:mediaPlayer:language'));
		}

		if (!this._transcriptViewer) {
			this._onCueChange();
		}

		const isVideo = this.mediaType === SOURCE_TYPES.video;
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

	_sanitizeText(text) {
		return text.replace(/<br \/>/g, '\n');
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

	_setPreference(preferenceKey, value) {
		if (!this.disableSetPreferences) {
			localStorage.setItem(preferenceKey, value);
		}
	}

	_showControls(temporarily) {
		this._recentlyShowedCustomControls = true;
		clearTimeout(this._showControlsTimeout);

		if (temporarily && !(this._searchInput && this._searchInput.value)) {
			this._showControlsTimeout = setTimeout(() => {
				this._recentlyShowedCustomControls = false;
			}, HIDE_DELAY_MS);
		}
	}

	_startHoveringControls() {
		this._hoveringMediaControls = true;
		this._showControls(false);
	}

	_startUpdatingCurrentTime() {
		setInterval(() => {
			if (this._media && !this._dragging) {
				this._currentTime = this._media.currentTime;
			}
		}, SEEK_BAR_UPDATE_PERIOD_MS);
	}

	_startUsingVolumeContainer() {
		setTimeout(() => {
			this._usingVolumeContainer = true;
		}, 0);
	}

	_stopHoveringControls() {
		this._hoveringMediaControls = false;
		this._showControls(true);
	}

	_stopUsingVolumeContainer() {
		setTimeout(() => {
			this._usingVolumeContainer = false;
		}, 0);
	}

	_syncDisplayedTrackTextToSelectedTrack() {
		this._trackText = null;
		const selectedTextTrack = this._getSelectedTextTrack();

		if (!selectedTextTrack || !selectedTextTrack.cues) return;

		for (let i = 0; i < selectedTextTrack.cues.length; i++) {
			const cue = selectedTextTrack.cues[i];
			if (
				(cue.startTime <= this.currentTime) &&
				(cue.endTime >= this.currentTime)
			) {
				this._trackText = this._sanitizeText(cue.text);
				this.dispatchEvent(new CustomEvent('cuechange'));
			}
		}
	}

	_toggleFullscreen() {
		if (!FULLSCREEN_ENABLED) return;

		if (this.mediaType !== SOURCE_TYPES.video) return;

		if (fullscreenApi.isFullscreen) {
			fullscreenApi.exit();
		} else {
			fullscreenApi.request(this._mediaContainer);
		}
	}

	_toggleMute() {
		if (this._muted) {
			this.volume = this.preMuteVolume || 1;
		} else {
			this.preMuteVolume = this.volume;
			this.volume = 0;
		}

		this._muted = !this._muted;
	}

	_togglePlay() {
		this._posterVisible = false;
		if (this._media.paused) {
			if (this.playInView) {
				this._loadVisibilityObserver({ target: this._mediaContainer });
			}
			this._playRequested = true;
			this._media.play();
		} else {
			this._playRequested = false;
			this._media.pause();
		}
	}

	_updateCurrentTimeFromSeekbarProgress() {
		this.currentTime = this._seekBar.immediateValue / this._getSeekbarResolutionMultipler();
	}

	_updateSources(nodes) {
		this._selectedQuality = null;
		nodes.forEach((node, index) => {
			if (node.nodeType === Node.ELEMENT_NODE && node.nodeName === 'SOURCE') {
				const quality = this._parseSourceNode(node);
				if (quality && ((index === 0) || node.hasAttribute('default'))) {
					this._selectedQuality = quality;
				}
			}
		});
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
}

customElements.define('d2l-labs-media-player', MediaPlayer);
