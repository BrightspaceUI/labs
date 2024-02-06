import '../../../src/components/colourblind-filter/colourblind-filter-wrapper.js';
import { html, LitElement } from 'lit';
import { selectStyles } from '@brightspace-ui/core/components/inputs/input-select-styles.js';

export const colourblindTypes = Object.freeze({
	none: "None",
	achromatopsia: "Achromatopsia",
	deuteranopia: "Deuteranopia",
	protanopia: "Protanopia",
	tritanopia: "Tritanopia"
});

class ColourblindFilterWrapperDemo extends LitElement {

	static get properties() {
		return {
			_colourblindType: { type: String }
		};
	}

	static get styles() {
		return [  selectStyles ];
	}

	render() {
		return html`
			Filter type:
			<select class="d2l-input-select" @change=${this._onColourblindTypeChanged}>
				${Object.keys(colourblindTypes).map(value => html`
					<option>${value}</option>
				`)}
			</select>
			<d2l-labs-colourblind-filter-wrapper colourblind-type=${this._colourblindType}>
				<div><img src="./colour-wheel.png"></div>
			</d2l-labs-colourblind-filter-wrapper>
		`;
	}

	_onColourblindTypeChanged(e) {
		this._colourblindType = e.target.value;
	}
}

customElements.define('d2l-labs-colourblind-filter-wrapper-demo', ColourblindFilterWrapperDemo);
