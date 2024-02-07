import '@brightspace-ui/core/components/alert/alert.js';
import { css, html, LitElement } from 'lit';
import { bodyCompactStyles } from '@brightspace-ui/core/components/typography/styles.js';
import { classMap } from 'lit/directives/class-map.js';
import { LocalizeLabsElement } from '../localize-labs-element.js';
import { offscreenStyles } from '@brightspace-ui/core/components/offscreen/offscreen.js';
import { selectStyles } from '@brightspace-ui/core/components/inputs/input-select-styles.js';
import { styleMap } from 'lit/directives/style-map.js';

const DISABILITY_TYPES = Object.freeze({
	none: 'none',
	noVision: 'no-vision',
	lowVision: 'low-vision',
	motorImpairment: 'motor-impairment',
	colorblindAchromatopsia: 'colorblind-achromatopsia',
	colorblindDeuteranopia: 'colorblind-deuteranopia',
	colorblindProtanopia: 'colorblind-protanopia',
	colorblindTritanopia: 'colorblind-tritanopia'
});

class AccessibilityDisabilitySimulator extends LocalizeLabsElement(LitElement) {

	static get properties() {
		return {
			/**
			 * The type of disability you want to simulate
			 * @type {'no-vision'|'low-vision'|'motor-impairment'|'colorblind-achromatopsia'|'colorblind-deuteranopia'|'colorblind-protanopia'|'colorblind-tritanopia'}
			 */
			disabilityType: { type: String, attribute: 'disability-type', reflect: true },
			/**
			 * Whether or not the alert should be shown or not
			 * @type {Boolean}
			 */
			hideAlert: { type: Boolean, attribute: 'hide-alert' },
			/**
			 * Whether you want to show the controls or not
			 * @type {Boolean}
			 */
			hideControls: { type: Boolean, attribute: 'hide-controls' },
			_blurriness: { state: true }
		};
	}

	static get styles() {
		return [ bodyCompactStyles, offscreenStyles, selectStyles, css`
			.simulator-controls {
				align-items: center;
				display: flex;
				gap: 0.5rem;
				margin-bottom: 1rem;
			}

			.low-vision-slider {
				align-items: center;
				display: flex;
				gap: 0.5rem;
			}

			.alert-message {
				display: inline-block;
				margin-bottom: 1rem;
				padding: 0.5rem;
			}

			.svg-filter {
				display: none;
			}

			:host([disability-type="motor-impairment"]) .wrapper-slot {
				pointer-events: none;
			}

			:host([disability-type="no-vision"]) .wrapper-slot {
				filter: grayscale(1);
			}

			:host([disability-type="colorblind-achromatopsia"]) .wrapper-slot {
				filter: grayscale(1);
			}

			:host([disability-type="colorblind-deuteranopia"]) .wrapper-slot {
				filter: url("#deuteranopia");
			}

			:host([disability-type="colorblind-protanopia"]) .wrapper-slot {
				filter: url("#protanopia");
			}

			:host([disability-type="colorblind-tritanopia"]) .wrapper-slot {
				filter: url("#tritanopia");
			}
		` ];
	}

	constructor() {
		super();
		this._blurriness = 50;
	}

	render() {
		const wrapperClasses = {
			'wrapper-slot': true,
			'd2l-offscreen': this.disabilityType === DISABILITY_TYPES.noVision
		};
		const wrapperStyles = {
			...(this.disabilityType === DISABILITY_TYPES.lowVision && { filter: `blur(${this._blurriness / 20}px)` })
		};
		return html`
			${this._renderColorblindFilters()}
			${this._renderControls()}
			${this._renderAlert()}

			<div class="${classMap(wrapperClasses)}" style="${styleMap(wrapperStyles)}">
				<slot></slot>
			</div>
		`;
	}

	_localize(key) {
		return this.localize(`components:accessibilityDisabilitySimulator:${key}`);
	}

	_onDisabilityTypeChanged(e) {
		this.disabilityType = e.target.value;
	}

	_onSliderChanged(e) {
		this._blurriness = e.target.value;
	}

	_renderAlert() { // rather than have an alert, maybe have it in the dropdown (i.e. "Motor Impairment (mouse & keyboard only)")
		if (this.hideAlert) return; // should the alert be hidden by default or shown by default?

		let alertMessage;

		if (this.disabilityType === DISABILITY_TYPES.noVision) {
			alertMessage = this._localize('screenreaderAndTabAlert');
		} else if (this.disabilityType === DISABILITY_TYPES.motorImpairment) {
			alertMessage = this._localize('keyboardOnlyAlert');
		} else {
			return;
		}

		return html`
			<d2l-alert class="alert-message" no-padding><span class="d2l-body-compact">${alertMessage}</span></d2l-alert>
		`;
	}

	_renderColorblindFilters() {
		return html`
			<svg xmlns="http://www.w3.org/2000/svg" class="svg-filter">
				<filter id="tritanopia" color-interpolation-filters="linearRGB">
					<feColorMatrix type="matrix" in="SourceGraphic" result="ProjectionOnPlane1" values="
						1.01354, 0.14268, -0.15622, 0, 0
						-0.01181, 0.87561, 0.13619, 0, 0
						0.07707, 0.81208, 0.11085, 0, 0
						7.92482, -5.66475, -2.26007, 1, -0.2"/>

					<feComponentTransfer in="ProjectionOnPlane1" result="ProjectionOnPlane1">
						<feFuncA type="discrete" tableValues="0 0 0 0 1"/>
					</feComponentTransfer>

					<feColorMatrix type="matrix" in="SourceGraphic" result="ProjectionOnPlane2" values="
						0.93337, 0.19999, -0.13336, 0, 0
						0.05809, 0.82565, 0.11626, 0, 0
						-0.37923, 1.13825, 0.24098, 0, 0
						0,0,0,1,0"
					/>

					<feBlend in="ProjectionOnPlane1" in2="ProjectionOnPlane2" mode="normal"/>
				</filter>

				<filter id="deuteranopia" color-interpolation-filters="linearRGB">
					<feColorMatrix type="matrix" in="SourceGraphic" values="
						0.29031, 0.70969, 0, 0, 0
						0.29031, 0.70969, 0, 0, 0
						-0.02197, 0.02197, 1, 0, 0
						0, 0, 0, 1, 0"
					/>
				</filter>

				<filter id="protanopia" color-interpolation-filters="linearRGB">
					<feColorMatrix type="matrix" in="SourceGraphic" values="
						0.10889, 0.89111, 0, 0, 0
						0.10889, 0.89111, 0, 0, 0
						0.00447, -0.00447, 1, 0, 0
						0, 0, 0, 1, 0"
					/>
				</filter>
			</svg>
		`;
	}

	_renderControls() {
		if (this.hideControls) return;

		return html`
			<div class="simulator-controls">
				${this._localize('filterType')}
				<select class="d2l-input-select" @change=${this._onDisabilityTypeChanged}>
					${Object.entries(DISABILITY_TYPES).map(type => html`
						<option value="${type[1]}" ?selected=${this.disabilityType === type[1]}>${this._localize(type[0])}</option>
					`)}
				</select>

				${this.disabilityType === DISABILITY_TYPES.lowVision ? html`
					<div class="low-vision-slider">
						<label for="blur" class="d2l-body-compact">${this._localize('blurriness')}</label>
						<input type="range" min="1" max="100" .value="${this._blurriness}" @input="${this._onSliderChanged}" name="blur">
					</div>
				` : null}
			</div>
		`;
	}
}

customElements.define('d2l-labs-accessibility-disability-simulator', AccessibilityDisabilitySimulator);
