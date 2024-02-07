import '@brightspace-ui/core/components/alert/alert.js';
import { css, html, LitElement } from 'lit';
import { bodyCompactStyles } from '@brightspace-ui/core/components/typography/styles.js';
import { classMap } from 'lit/directives/class-map.js';
import { offscreenStyles } from '@brightspace-ui/core/components/offscreen/offscreen.js';
import { selectStyles } from '@brightspace-ui/core/components/inputs/input-select-styles.js';
import { styleMap } from 'lit/directives/style-map.js';

export const DISABILITY_TYPES = Object.freeze({
	no_vision: 'no-vision',
	low_vision: 'low-vision',
	motor_impairment: 'motor-impairment',
	colourblind_achromatopsia: 'colourblind-achromatopsia',
	colourblind_deuteranopia: 'colourblind-deuteranopia',
	colourblind_protanopia: 'colourblind-protanopia',
	colourblind_tritanopia: 'colourblind-tritanopia'
});

// Would it be worth it to localize the terms?

class AccessibilityDisabilitySimulator extends LitElement {

	static get properties() {
		return {
			/**
			 * Type of scenario to simulate
			 * @type {'no-vision'|'low-vision'|'motor-impairment'|'colourblind-achromatopsia'|'colourblind-deuteranopia'|'colourblind-protanopia'|'colourblind-tritanopia'}
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
			_sliderValue: { state: true }
		};
	}

	static get styles() {
		return [ bodyCompactStyles, offscreenStyles, selectStyles, css`
			// :host([disability-type="low-vision"]) .wrapper-slot {
			// 	filter: blur(${this._sliderValue / 20}px);
			// }

			.handler {
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

			.message {
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

			:host([disability-type="colourblind-achromatopsia"]) .wrapper-slot {
				filter: grayscale(1);
			}

			:host([disability-type="colourblind-deuteranopia"]) .wrapper-slot {
				filter: url("#deuteranopia");
			}

			:host([disability-type="colourblind-protanopia"]) .wrapper-slot {
				filter: url("#protanopia");
			}

			:host([disability-type="colourblind-tritanopia"]) .wrapper-slot {
				filter: url("#tritanopia");
			}
		` ];
	}

	constructor() {
		super();
		this._disabilityTypes = ['none', ...Object.values(DISABILITY_TYPES)];
		this._sliderValue = 50;
	}

	render() {
		const wrapperClasses = {
			'wrapper-slot': true,
			'd2l-offscreen': this.disabilityType === DISABILITY_TYPES.no_vision
		};
		const wrapperStyles = {
			...(this.disabilityType === DISABILITY_TYPES.low_vision && { filter: `blur(${this._sliderValue / 20}px)` })
		}
		return html`
			${this._renderColourblindFilters()}

			${this._renderControls()}

			${this._renderAlert()}

			<div class="${classMap(wrapperClasses)}" style="${styleMap(wrapperStyles)}">
				<slot></slot>
			</div>
		`;
	}

	_onDisabilityTypeChanged(e) {
		this.disabilityType = e.target.value;
	}

	_onSliderChanged(e) {
		this._sliderValue = e.target.value;
	}

	_renderAlert() {
		if (this.hideAlert) return; // should the alert be hidden by default or shown by default?

		let alertMessage;

		if (this.disabilityType === DISABILITY_TYPES.no_vision) {
			alertMessage = 'Enable your screenreader and tab into the content';
		} else if (this.disabilityType === DISABILITY_TYPES.motor_impairment) {
			alertMessage = 'Keyboard interactions only';
		} else {
			return;
		}

		return html`
			<d2l-alert class="message" no-padding><span class="d2l-body-compact">${alertMessage}</span></d2l-alert>
		`;
	}

	_renderColourblindFilters() {
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
			<div class="handler">
				Filter type:
				<select class="d2l-input-select" @change=${this._onDisabilityTypeChanged}>
					${this._disabilityTypes.map(value => html`
						<option>${value}</option>
					`)}
				</select>

				${this.disabilityType === DISABILITY_TYPES['low_vision'] ? html`
					<div class="low-vision-slider">
						<label for="blur" class="d2l-body-compact">Blur Level</label>
						<input type="range" min="1" max="100" value="${this._sliderValue}" @input="${this._onSliderChanged}" name="blur">
					</div>
				` : null}
			</div>
		`;
	}
}

customElements.define('d2l-labs-accessibility-disability-simulator', AccessibilityDisabilitySimulator);
