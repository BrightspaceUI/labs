import '@brightspace-ui/core/components/inputs/input-number.js';
import '@brightspace-ui/core/components/offscreen/offscreen.js';
import { bodyCompactStyles, bodyStandardStyles } from '@brightspace-ui/core/components/typography/styles.js';
import { css, html, LitElement, nothing } from 'lit';
import { LocalizeLabsElement } from '../localize-labs-element.js';

const numberConverter = {
	fromAttribute: (attr) => { return !attr ? undefined : Number(attr); },
	toAttribute:  (prop) => { return String(prop); }
};

const EXTRA_SPACE = 2.5;
const MIN_WIDTH = 5.5;
const MIN_NEGATIVE_GRADE = -9999999999;
const MIN_POSITIVE_GRADE = 0;

/**
 * @fires d2l-grade-result-grade-change - Dispatched on the change of the grade for a gradeType="Numeric" grade.
 */
export class D2LGradeResultNumericScore extends LocalizeLabsElement(LitElement) {
	static get properties() {
		return {
			label: { type: String },
			scoreNumerator: { attribute: 'score-numerator', type: Number, converter: numberConverter },
			scoreDenominator: { attribute: 'score-denominator', type: Number },
			readonly: { type: Boolean },
			required: { type: Boolean },
			allowNegativeScore: { attribute: 'allow-negative-score', type: Boolean },
			showFlooredScoreWarning: { attribute: 'show-floored-score-warning', type: Boolean },
		};
	}

	static get styles() {
		return [bodyCompactStyles, bodyStandardStyles, css`
			.d2l-grade-result-numeric-score-container {
				align-items: center;
				display: flex;
				flex-direction: row;
			}
			.d2l-grade-result-numeric-score-score-read-only {
				height: calc(2rem + 2px);
				line-height: calc(2rem + 2px);
				max-width: 5.25rem;
			}
			.d2l-grade-result-numeric-score-hint {
				margin: 0 0.3rem;
			}
		`];
	}

	render() {
		const roundedNumerator = isNaN(this.scoreNumerator) ? '' : Math.round((this.scoreNumerator + Number.EPSILON) * 100) / 100;

		const denominatorLength = isNaN(this.scoreDenominator) ? 0 : this.scoreDenominator.toString().length;
		const numeratorLength = roundedNumerator.toString().length;
		const dynamicWidth = numeratorLength <= denominatorLength ? denominatorLength + EXTRA_SPACE : (numeratorLength * 0.5) + (denominatorLength * 0.5) + EXTRA_SPACE;

		return html`
			<div class="d2l-grade-result-numeric-score-container">
				${!this.readonly ? html`
					<div class="d2l-grade-result-numeric-score-score">
						<d2l-form>
							<d2l-input-number
								?required=${this.required}
								id="d2l-grade"
								label=${this.label ? this.label : this.localize('components:gradeResult:gradeScoreLabel')}
								label-hidden
								value="${this.scoreNumerator}"
								input-width="${dynamicWidth > MIN_WIDTH ? dynamicWidth : MIN_WIDTH}rem"
								min="${this.allowNegativeScore ? MIN_NEGATIVE_GRADE : MIN_POSITIVE_GRADE}"
								max="9999999999"
								max-fraction-digits="2"
								unit="/ ${this.scoreDenominator}"
								unit-label=${this.localize('components:gradeResult:outOfDenominator', { denominator: this.scoreDenominator })}
								value-align="end"
								@change=${this._onGradeChange}
							></d2l-input-number>
						</d2l-form>
					</div>
				` : html`
					<div
						aria-hidden="true"
						class="d2l-body-standard d2l-grade-result-numeric-score-score-read-only"
						id="d2l-grade">
						${roundedNumerator} / ${this.scoreDenominator}
					</div>
					<d2l-offscreen>${this.localize('components:gradeResult:numeratorOutOfDenominator', { numerator: roundedNumerator, denominator: this.scoreDenominator })}</d2l-offscreen>
				`}
				${this.showFlooredScoreWarning ? html`
					<div class="d2l-grade-result-numeric-score-hint d2l-body-compact">
						${this.localize('components:gradeResult:cannotBeNegative')}
					</div>
				` : nothing}
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

customElements.define('d2l-labs-grade-result-numeric-score', D2LGradeResultNumericScore);
