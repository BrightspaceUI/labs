import { css, html, LitElement } from 'lit';
import ResizeObserver from 'resize-observer-polyfill';
import { styleMap } from 'lit/directives/style-map.js';

const AUDIO_BARS_GRADIENTS = [
	{
		from: '29A6FF',
		weight: 9
	},
	{
		from: '00D2ED',
		weight: 9
	},
	{
		from: '2DE2C0',
		weight: 2
	},
	{
		start: true,
		from: '29A6FF',
		weight: 76
	}
];
const { AUDIO_BARS_GRADIENTS_OFFSET, AUDIO_BARS_GRADIENTS_DISPLAYED_WEIGHT } = AUDIO_BARS_GRADIENTS.reduce((r, gradient) => {
	if (gradient.start || r.AUDIO_BARS_GRADIENTS_DISPLAYED_WEIGHT > 0) {
		r.AUDIO_BARS_GRADIENTS_DISPLAYED_WEIGHT += gradient.weight;
	} else {
		r.AUDIO_BARS_GRADIENTS_OFFSET += gradient.weight;
	}

	return r;
}, { AUDIO_BARS_GRADIENTS_OFFSET: 0, AUDIO_BARS_GRADIENTS_DISPLAYED_WEIGHT: 0 });

AUDIO_BARS_GRADIENTS.forEach((gradient, i) => {
	gradient.fractionPassedNonInclusive = 0;
	gradient.fractionPassedInclusive = gradient.weight / (AUDIO_BARS_GRADIENTS_OFFSET + AUDIO_BARS_GRADIENTS_DISPLAYED_WEIGHT);

	if (i > 0) {
		gradient.fractionPassedNonInclusive = AUDIO_BARS_GRADIENTS[i - 1].fractionPassedInclusive;
		gradient.fractionPassedInclusive += gradient.fractionPassedNonInclusive;
	}

	if (i < AUDIO_BARS_GRADIENTS.length - 1) {
		gradient.to = AUDIO_BARS_GRADIENTS[i + 1].from;
	} else {
		gradient.to = AUDIO_BARS_GRADIENTS[0].from;
	}
});
const AUDIO_BAR_HEIGHTS = [35, 54, 65, 86, 81, 67, 100, 90, 100, 98, 75, 99, 98, 96, 96, 95, 65, 50, 50, 60, 64, 54, 50, 44, 45, 46, 47, 45, 53, 67, 68, 76, 65, 63, 67, 91, 97, 86, 88, 86, 84, 84, 82, 0, 0, 0, 0, 0, 0, 0, 0, 69, 70, 68, 67, 72, 76, 86, 81, 83, 67, 65, 67, 21, 44, 45, 97, 86, 85, 81, 84, 70, 65, 67, 67, 72, 79, 76, 76, 63, 44, 42, 50, 54, 49, 33, 42, 44, 33, 38, 38, 36, 37, 35, 34];
const AUDIO_BAR_HORIZONTAL_MARGIN_REM = 0.05;
const AUDIO_BAR_WIDTH_REM = 0.25;
const FULL_BYTE = 255;
const GAMMA = 0.43;
const GAMMA_ADJUSTMENT_EXPONENT = 2.4;
const LINEAR_OFFSET = 0.055;
const UNDER_LINEAR_THRESHOLD_FACTOR = 12.92;
const UPDATE_PERIOD_MS = 50;

const FONT_SIZE = getComputedStyle(document.documentElement).fontSize;
const PX_PER_REM = FONT_SIZE.substr(0, FONT_SIZE.indexOf('px'));
const AUDIO_BAR_WIDTH_PX = AUDIO_BAR_WIDTH_REM * PX_PER_REM;
const AUDIO_BAR_HORIZONTAL_MARGIN_PX = AUDIO_BAR_HORIZONTAL_MARGIN_REM * PX_PER_REM;

class MediaPlayerAudioBars extends LitElement {
	static get properties() {
		return {
			playing: { type: Boolean },
			_visibleAudioBars: { type: Array, attribute: false },
		};
	}

	static get styles() {
		return css`
			:host {
				width: 100%;
			}

			#d2l-labs-media-player-audio-bars-row {
				align-items: center;
				display: flex;
				flex-direction: row;
				height: 100%;
				justify-content: center;
			}

			#d2l-labs-media-player-audio-bar-container {
				display: flex;
				flex-direction: column;
				height: 100%;
			}

			.d2l-labs-media-player-audio-bar {
				border-top-left-radius: 0.075rem;
				border-top-right-radius: 0.075rem;
				margin: 0 ${AUDIO_BAR_HORIZONTAL_MARGIN_REM}rem;
				width: ${AUDIO_BAR_WIDTH_REM}rem;
			}
`;
	}

	constructor() {
		super();

		this._audioBarColours = [];
		this._changingAudioBarsInterval = null;
		this._gradientAudioBars = [];
		this._numVisibleAudioBars = 0;
		this._visibleAudioBars = [];
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		new ResizeObserver((entries) => {
			for (const entry of entries) {
				const { width } = entry.contentRect;

				const numAudioBarsThatCanFit = Math.floor(width / (AUDIO_BAR_WIDTH_PX + 2 * AUDIO_BAR_HORIZONTAL_MARGIN_PX));
				const numAudioBarsThatCanFitNextOdd = numAudioBarsThatCanFit % 2 === 1 ? numAudioBarsThatCanFit : numAudioBarsThatCanFit - 1;
				this._numVisibleAudioBars = Math.min(numAudioBarsThatCanFitNextOdd, AUDIO_BAR_HEIGHTS.length);
				const numAudioBarColours = Math.floor(this._numVisibleAudioBars * (1 + (AUDIO_BARS_GRADIENTS_OFFSET / AUDIO_BARS_GRADIENTS_DISPLAYED_WEIGHT)));

				this._audioBarColours = [];
				this._visibleAudioBars = [];
				for (let i = 0; i < this._numVisibleAudioBars; i++) {

					let height;

					if (this._numVisibleAudioBars < AUDIO_BAR_HEIGHTS.length) {
						height = AUDIO_BAR_HEIGHTS[i + Math.floor((AUDIO_BAR_HEIGHTS.length - this._numVisibleAudioBars) / 2)];
					} else {
						height = AUDIO_BAR_HEIGHTS[i];
					}

					this._visibleAudioBars.push({
						height
					});
				}

				for (let i = 0; i < numAudioBarColours; i++) {
					this._audioBarColours.push(0);
				}

				for (let i = 0; i < numAudioBarColours; i++) {
					this._audioBarColours[i] = this._getRgbOfAudioBar(i);
				}

				this._startChangingAudioBars();
			}
		}).observe(this.shadowRoot.getElementById('d2l-labs-media-player-audio-bars-row'));
	}

	render() {
		return html`
			<div id="d2l-labs-media-player-audio-bars-row">
				${this._visibleAudioBars.map(audioBar => html`
					<div id="d2l-labs-media-player-audio-bar-container">
						<div style="flex: auto;"></div>
						<div class="d2l-labs-media-player-audio-bar" style=${styleMap({ backgroundColor: `rgba(${audioBar.red}, ${audioBar.green}, ${audioBar.blue}, 1)`, height: `${audioBar.height}%` })}></div>
					</div>
				`)}
			</div>
		`;
	}

	_changeColoursOfAudioBars() {
		const newVisibleAudioBars = [];

		this._visibleAudioBars.forEach((visibleAudioBar, i) => {
			const audioBarI = (i + this._visibleAudioBarsOffset) % this._audioBarColours.length;

			const colour = this._audioBarColours[audioBarI];

			newVisibleAudioBars.push({
				...visibleAudioBar,
				...colour
			});
		});

		this._visibleAudioBars = newVisibleAudioBars;

		this._visibleAudioBarsOffset = this._visibleAudioBarsOffset === 0 ? this._audioBarColours.length - 1 : this._visibleAudioBarsOffset - 1;
	}

	/**
	 * Converts a [0..255] SRGB value to a [0..1] linear value.
	 * @param {Number} rgb SRGB representation of the colour.
	 * @returns {Number} Linear value of the colour.
	 */
	static _fromSRGB(rgb) {
		rgb /= FULL_BYTE;

		return rgb <= 0.04045 ? rgb / UNDER_LINEAR_THRESHOLD_FACTOR : Math.pow((rgb + LINEAR_OFFSET) / (1 + LINEAR_OFFSET), GAMMA_ADJUSTMENT_EXPONENT);
	}

	static _getGradientFromFraction(fraction) {
		for (let i = 0; i < AUDIO_BARS_GRADIENTS.length; i++) {
			if (fraction < AUDIO_BARS_GRADIENTS[i].fractionPassedInclusive) return AUDIO_BARS_GRADIENTS[i];
		}
	}

	_getRgbOfAudioBar(i) {
		const fraction = i / this._audioBarColours.length;

		const { from, to, fractionPassedNonInclusive, fractionPassedInclusive } = MediaPlayerAudioBars._getGradientFromFraction(fraction);

		const innerFraction = (fraction - fractionPassedNonInclusive) / (fractionPassedInclusive - fractionPassedNonInclusive);

		const fromRedSRGB = parseInt(from.substr(0, 2), 16);
		const fromRedLinear = MediaPlayerAudioBars._fromSRGB(fromRedSRGB);
		const fromGreenSRGB = parseInt(from.substr(2, 2), 16);
		const fromGreenLinear = MediaPlayerAudioBars._fromSRGB(fromGreenSRGB);
		const fromBlueSRGB = parseInt(from.substr(4, 2), 16);
		const fromBlueLinear = MediaPlayerAudioBars._fromSRGB(fromBlueSRGB);
		const fromBrightness = Math.pow(fromRedLinear + fromGreenLinear + fromBlueLinear, GAMMA);

		const toRedSRGB = parseInt(to.substr(0, 2), 16);
		const toRedLinear = MediaPlayerAudioBars._fromSRGB(toRedSRGB);
		const toGreenSRGB = parseInt(to.substr(2, 2), 16);
		const toGreenLinear = MediaPlayerAudioBars._fromSRGB(toGreenSRGB);
		const toBlueSRGB = parseInt(to.substr(4, 2), 16);
		const toBlueLinear = MediaPlayerAudioBars._fromSRGB(toBlueSRGB);
		const toBrightness = Math.pow(toRedLinear + toGreenLinear + toBlueLinear, GAMMA);

		const brightness = Math.pow(MediaPlayerAudioBars._weightedAverage(fromBrightness, toBrightness, innerFraction), 1 / GAMMA);

		const redWithoutBrightness = MediaPlayerAudioBars._weightedAverage(fromRedLinear, toRedLinear, innerFraction);
		const greenWithoutBrightness = MediaPlayerAudioBars._weightedAverage(fromGreenLinear, toGreenLinear, innerFraction);
		const blueWithoutBrightness = MediaPlayerAudioBars._weightedAverage(fromBlueLinear, toBlueLinear, innerFraction);

		const sumWithoutBrightness = redWithoutBrightness + greenWithoutBrightness + blueWithoutBrightness;

		return {
			red: MediaPlayerAudioBars._toSRGB(redWithoutBrightness * brightness / sumWithoutBrightness),
			green: MediaPlayerAudioBars._toSRGB(greenWithoutBrightness * brightness / sumWithoutBrightness),
			blue: MediaPlayerAudioBars._toSRGB(blueWithoutBrightness * brightness / sumWithoutBrightness)
		};
	}

	_startChangingAudioBars() {
		this._visibleAudioBarsOffset = this._audioBarColours.length - this._visibleAudioBars.length + 1;

		this._changeColoursOfAudioBars();

		clearInterval(this._changingAudioBarsInterval);

		this._changingAudioBarsInterval = setInterval(() => {
			if (!this.playing) return;

			this._changeColoursOfAudioBars();
		}, UPDATE_PERIOD_MS);
	}

	/**
	 * Converts a [0..1] linear value to a [0..255] SRGB value.
	 * @param {Number} rgb Linear representation of the colour.
	 * @returns {Number} SRGB value of the colour.
	 */
	static _toSRGB(rgb) {
		if (rgb <= 0.0031308) {
			rgb *= UNDER_LINEAR_THRESHOLD_FACTOR;
		} else {
			rgb = ((1 + LINEAR_OFFSET) * (Math.pow(rgb, 1 / GAMMA_ADJUSTMENT_EXPONENT))) - LINEAR_OFFSET;
		}

		return (FULL_BYTE + 1) * rgb;
	}

	static _weightedAverage(a, b, weightOfB) {
		return a + (b - a) * weightOfB;
	}
}

customElements.define('d2l-labs-media-player-audio-bars', MediaPlayerAudioBars);
