import { css, html, LitElement } from 'lit';

export const colourblindTypes = Object.freeze({
	none: "None",
	achromatopsia: "Achromatopsia",
	deuteranopia: "Deuteranopia",
	protanopia: "Protanopia",
	tritanopia: "Tritanopia"
});

class ColourblindFilterWrapper extends LitElement {

	static get properties() {
		return {
			colourblindType: { reflect: true, type: String, attribute: 'colourblind-type' }
		};
	}

	static get styles() {
		return [ css`
			:host([colourblind-type="tritanopia"]) .wrapper-slot {
				filter: url("#tritanopia");
			}

			:host([colourblind-type="protanopia"]) .wrapper-slot {
				filter: url("#protanopia");
			}

			:host([colourblind-type="deuteranopia"]) .wrapper-slot {
				filter: url("#deuteranopia");
			}

			:host([colourblind-type="achromatopsia"]) .wrapper-slot {
				filter: grayscale(1);
			}
		` ];
	}

	render() {
		return html`
			${this._renderColourblindFilters()}

			<div class="wrapper-slot">
				<slot></slot>
			</div>
		`;
	}

	_renderColourblindFilters() {
		return html`
			<svg xmlns="http://www.w3.org/2000/svg" height="0">
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
}

customElements.define('d2l-labs-colourblind-filter-wrapper', ColourblindFilterWrapper);
