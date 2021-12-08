import { css, html, LitElement } from 'lit-element';
import { bodyStandardStyles } from '@brightspace-ui/core/components/typography/styles.js';
import { selectStyles } from '@brightspace-ui/core/components/inputs/input-select-styles';

export class D2LGradeResultLetterScore extends LitElement {

	static get properties() {
		return {
			availableOptions: { type: Object },
			selectedOption: { type: String },
			readOnly: { type: Boolean }
		};
	}

	static get styles() {
		return [selectStyles, bodyStandardStyles, css`
			.d2l-grade-result-letter-score-container {
				width: 8rem;
				margin-right: 0.5rem;
			}
			.d2l-grade-result-letter-score-select {
				width: 100%;
			}
			.d2l-grade-result-letter-score-score-read-only {
				margin-right: 0.5rem;
			}
		`];
	}

	constructor() {
		super();
		this.availableOptions = null;
		this.selectedOption = '';
	}

	render() {
		if (!this.readOnly) {
			return html`
				<div class="d2l-grade-result-letter-score-container">
					<select
						class="d2l-input-select d2l-grade-result-letter-score-select"
						@change=${this._onOptionSelected}
						.value=${this.selectedOption}
					>
						${this._renderOptions()}
					</select>
				</div>
			`;
		} else {
			return html`
				<div class="d2l-grade-result-letter-score-score-read-only">
					<span class="d2l-body-standard">${this._selectedOptionText()}</span>
				</div>
			`;
		}
	}

	_onOptionSelected(e) {
		this.dispatchEvent(new CustomEvent('d2l-grade-result-letter-score-selected', {
			composed: true,
			bubbles: true,
			detail: {
				value: e.target.value
			}
		}));
	}

	_renderOptions() {
		const itemTemplate = [];
		for (const [id, option] of Object.entries(this.availableOptions)) {
			if (this.selectedOption === id) {
				itemTemplate.push(html`<option selected value=${id}>${option.LetterGrade}</option>`);
			} else {
				itemTemplate.push(html`<option value=${id}>${option.LetterGrade}</option>`);
			}
		}
		return itemTemplate;
	}

	_selectedOptionText() {
		if (this.availableOptions[this.selectedOption]) {
			return this.availableOptions[this.selectedOption].LetterGrade;
		}
	}

}

customElements.define('d2l-grade-result-letter-score', D2LGradeResultLetterScore);
