import '@brightspace-ui/core/components/inputs/input-number.js';
import { bodyStandardStyles, labelStyles } from '@brightspace-ui/core/components/typography/styles.js';
import { css, html, LitElement } from 'lit-element';
import getLocalizationTranslations from './locale.js';
import { inputLabelStyles } from '@brightspace-ui/core/components/inputs/input-label-styles.js';
import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize-mixin.js';

const numberConverter = {
	fromAttribute: (attr) => { return !attr ? undefined : Number(attr); },
	toAttribute:  (prop) => { return String(prop); }
};

const extraSpace = 2.5;
const minWidth = 5.5;

export class D2LGradeResultNumericScore extends LocalizeMixin(LitElement) {
	static get properties() {
		return {
			label: { type: String },
			scoreNumerator: { type: Number, converter: numberConverter },
			scoreDenominator: { type: Number },
			readOnly: { type: Boolean },
			required: { type: Boolean }
		};
	}

	static get styles() {
		return [bodyStandardStyles, labelStyles, inputLabelStyles, css`
			.d2l-grade-result-numeric-score-container {
				display: flex;
				flex-direction: row;
				align-items: center;
			}
			.d2l-grade-result-numeric-score-score-read-only {
				max-width: 5.25rem;
				margin-right: 0.5rem;
			}
			:host([dir="rtl"]) .d2l-grade-result-numeric-score-score-read-only {
				margin-left: 0.5rem;
				margin-right: 0rem;
			}
		`];
	}
	static async getLocalizeResources(langs) {
		return await getLocalizationTranslations(langs);
	}

	render() {
		let roundedNumerator = Math.round((this.scoreNumerator + Number.EPSILON) * 100) / 100;
		if (isNaN(this.scoreNumerator)) {
			roundedNumerator = '';
		}

		const denominatorLength = isNaN(this.scoreDenominator) ? 0 : this.scoreDenominator.toString().length;
		const numeratorLength = isNaN(roundedNumerator) ? 0 : roundedNumerator.toString().length;
		const dynamicWidth = numeratorLength <= denominatorLength ? denominatorLength + extraSpace : (numeratorLength * 0.5) + (denominatorLength * 0.5)  + extraSpace;

		return html`
			<div class="d2l-grade-result-numeric-score-container">
				${!this.readOnly ? html`
					<div class="d2l-grade-result-numeric-score-score">
						<d2l-form>
							<d2l-input-number
								?required=${this.required}
								id="grade-input"
								label=${this.label ? this.label : this.localize('gradeScoreLabel')}
								label-hidden
								value="${this.scoreNumerator}"
								input-width="${dynamicWidth > minWidth ? dynamicWidth : minWidth}rem"
								min="0"
								max="9999999999"
								max-fraction-digits="2"
								unit="/ ${this.scoreDenominator}"
								unit-label=${this.localize('outOfDenominator', { denominator: this.scoreDenominator })}
								value-align="end"
								@change=${this._onGradeChange}
							></d2l-input-number>
						</d2l-form>
					</div>
				` : html`
					<div class="d2l-grade-result-numeric-score-score-read-only">
						<span aria-hidden="true" class="d2l-body-standard">${roundedNumerator} / ${this.scoreDenominator}</span>
						<d2l-offscreen>${this.localize('numeratorOutOfDenominator', { numerator: roundedNumerator, denominator: this.scoreDenominator })}</d2l-offscreen>
					</div>
				`}
			</div>
		`;
	}

	_onGradeChange(e) {
		const newScore = e.target.value;
		this.dispatchEvent(new CustomEvent('d2l-grade-result-grade-change', {
			bubbles: true,
			composed: true,
			detail: {
				value: newScore
			}
		}));
	}

}

customElements.define('d2l-grade-result-numeric-score', D2LGradeResultNumericScore);
