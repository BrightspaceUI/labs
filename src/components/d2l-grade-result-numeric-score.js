import '@brightspace-ui/core/components/inputs/input-number.js';
import { bodyStandardStyles, labelStyles } from '@brightspace-ui/core/components/typography/styles.js';
import { css, html, LitElement } from 'lit-element';
import getLocalizationTranslations from './locale.js';
import { inputLabelStyles } from '@brightspace-ui/core/components/inputs/input-label-styles.js';
import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize-mixin.js';

export class D2LGradeResultNumericScore extends LocalizeMixin(LitElement) {
	static get properties() {
		return {
			scoreNumerator: { type: String },
			scoreDenominator: { type: Number },
			readOnly: { type: Boolean },
			validationError: { type: String },
			isValidScore: { type: Boolean },
			disallowNull: {
				attribute: 'disallow-null',
				type: Boolean
			}
		};
	}

	constructor() {
		super();
		this.isValidScore = true;
	}

	static get styles() {
		return [bodyStandardStyles, labelStyles, inputLabelStyles, css`
			.d2l-grade-result-numeric-score-container {
				display: flex;
				flex-direction: row;
				align-items: center;
			}
			.d2l-grade-result-numeric-score-score {
				max-width: 5.25rem;
			}
			.d2l-grade-result-numeric-score-score-read-only {
				max-width: 5.25rem;
				margin-right: 0.5rem;
			}
			.d2l-grade-result-numeric-score-score-text {
				margin-left: 0.5rem;
				margin-right: 0.25rem;
				text-align: center;
			}
			:host([dir="rtl"]) .d2l-grade-result-numeric-score-score-read-only {
				margin-left: 0.5rem;
				margin-right: 0rem;
			}
			:host([dir="rtl"]) .d2l-grade-result-numeric-score-score-text {
				margin-right: 0.5rem;
				margin-left: 0.25rem;
			}
		`];
	}
	static async getLocalizeResources(langs) {
		return await getLocalizationTranslations(langs);
	}

	render() {
		let inputNumberLabel;
		const roundedNumerator = Math.round((Number(this.scoreNumerator) + Number.EPSILON) * 100) / 100;
		if (!this.scoreDenominator) {
			inputNumberLabel = this.localize('gradeScoreLabel', { numerator: roundedNumerator || 'blank' });
		} else {
			inputNumberLabel = this.localize('fullGradeScoreLabel', { numerator: roundedNumerator || 'blank', denominator: this.scoreDenominator });
		}

		this.isValidScore = this._checkIsValidScore(this.scoreNumerator);
		console.log('rendering d2l-validation-custom');
		console.log('          score =', this.scoreNumerator);
		console.log('          validationError =', this.validationError);
		console.log('          isValidScore =', this.isValidScore);

		return html`
			<div class="d2l-grade-result-numeric-score-container">

				${!this.readOnly ? html`
					<div class="d2l-grade-result-numeric-score-score">
						<d2l-form>
							<d2l-input-number
								id="grade-input"
								label=${inputNumberLabel}
								label-hidden
								value="${Number(this.scoreNumerator)}"
								min="0"
								max="9999999999"
								max-fraction-digits="2"
								@change=${this._onGradeChange}
								?validate-on-init=${this.isValidScore}
							></d2l-input-number>
							<d2l-validation-custom
								for="grade-input"
								failure-text=${this.validationError}
								@d2l-validation-custom-validate=${this._checkValidationError}
							></d2l-validation-custom>
						</d2l-form>
					</div>
					<div class="d2l-grade-result-numeric-score-score-text">
						${!isNaN(this.scoreDenominator) ? html`
							<span class="d2l-body-standard">/ ${this.scoreDenominator}</span>
						` : html``}
					</div>
				` : html`
					<div class="d2l-grade-result-numeric-score-score-read-only">
						<span class="d2l-body-standard">${this.scoreNumerator ? roundedNumerator : 0} / ${this.scoreDenominator}</span>
					</div>
				`}

			</div>
		`;
	}

	_checkIsValidScore(score) {
		console.log('_checkIsValidScore for score =', score);
		if (this.disallowNull && typeof score === 'undefined') {
			console.log('          score UNDEFINED - setting isValidScore to false');
			return false;
		}
		//  if no validationError is defined, then the score is considered valid
		console.log('          validationError =', this.validationError, '(', typeof this.validationError, ')');
		console.log('          setting isValidScore to', (!this.validationError || typeof this.validationError === 'undefined' || this.validationError === ''));
		return !this.validationError || typeof this.validationError === 'undefined';
	}

	_checkValidationError(event) {
		this.isValidScore = this._checkIsValidScore(this.scoreNumerator);
		console.log('RESOLVING PROMISE for score =', this.scoreNumerator);
		console.log('          with isValidScore =', this.isValidScore);
		event.detail.resolve(this.isValidScore);
	}

	_onGradeChange(e) {
		const newScore = e.target.value;
		console.log('GRADE-RESULT _onGradeChange');
		console.log('          for score = ', newScore);
		this.dispatchEvent(new CustomEvent('d2l-grade-result-grade-change', {
			bubbles: true,
			composed: true,
			detail: {
				value: newScore
			}
		}));
		this.isValidScore = this._checkIsValidScore(newScore);
	}

}

customElements.define('d2l-grade-result-numeric-score', D2LGradeResultNumericScore);
