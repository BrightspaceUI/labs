import './grade-result-icon-button.js';
import './grade-result-numeric-score.js';
import './grade-result-letter-score.js';
import './grade-result-student-grade-preview.js';
import '@brightspace-ui/core/components/button/button-subtle.js';
import { bodySmallStyles, labelStyles } from '@brightspace-ui/core/components/typography/styles.js';
import { css, html, LitElement, nothing } from 'lit';
import { GradeType } from './controllers/Grade.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { LocalizeLabsElement } from '../localize-labs-element.js';

const numberConverter = {
	fromAttribute: (attr) => { return !attr ? undefined : Number(attr); },
	toAttribute:  (prop) => { return String(prop); }
};

/**
 * @fires d2l-grade-result-grade-button-click - Dispatched when the grade button is clicked.
 * @fires d2l-grade-result-manual-override-clear-click - Dispatched when the manual override clear is clicked.
 * @fires d2l-grade-result-reports-button-click - Dispatched when the reports button is clicked.
 */
export class D2LGradeResultPresentational extends LocalizeLabsElement(LitElement) {
	static get properties() {
		return {
			/**
			 * Set to true if negative scores can be entered
			 * @type {boolean}
			 */
			allowNegativeScore: { type: Boolean },
			/**
			 * This property will substitute the stock text on the "Clear Manual Override" button
			 * @type {string}
			 */
			customManualOverrideClearText: { type: String },
			/**
			 * @type {boolean}
			 */
			displayStudentGradePreview: { type: Boolean, attribute: 'display-student-grade-preview' },
			/**
			 * The text that is inside of the tooltip when hovering over the grades button
			 * @type {string}
			 */
			gradeButtonTooltip: { type: String },
			/**
			 * Specifies the type of grade that the component is meant to render
			 * @type {'Numeric'|'LetterGrade'}
			 */
			gradeType: { type: String },
			/**
			 * This property will hide the "Overall Grade" title above the component
			 * @type {boolean}
			 */
			hideTitle: { type: Boolean },
			/**
			 * Determines whether the grades icon button is rendered
			 * @type {boolean}
			 */
			includeGradeButton: { type: Boolean },
			/**
			 * Determines whether the reports icon button is rendered
			 * @type {boolean}
			 */
			includeReportsButton: { type: Boolean },
			/**
			 * This property sets the label that will be used inside the aria-label and validation error tooltips
			 * @type {string}
			 */
			inputLabelText: { type: String },
			/**
			 * Set to true if the user is currently manually overriding the grade. This will display the button to 'Clear Manual Override'.
			 * @type {boolean}
			 */
			isManualOverrideActive: { type: Boolean },
			/**
			 * @type {number}
			 */
			labelHeadingLevel: { type: Number },
			/**
			 * The text that appears above the component
			 * @type {string}
			 */
			labelText: { type: String },
			/**
			 * A dictionary where the key is a unique id and the value is an object containing the LetterGrade text and the PercentStart
			 * @type {object}
			 */
			letterGradeOptions: { type: Object },
			/**
			 * Set to true if the user does not have permissions to edit the grade
			 * @type {boolean}
			 */
			readonly: { type: Boolean },
			/**
			 * The text that is inside of the tooltip when hovering over the reports button
			 * @type {string}
			 */
			reportsButtonTooltip: { type: String },
			/**
			 * Set to true if an undefined/blank grade is not considered valid
			 * @type {boolean}
			 */
			required: { type: Boolean },
			/**
			 * The denominator of the numeric score that is given
			 * @type {number}
			 */
			scoreDenominator: { type: Number },
			/**
			 * The numerator of the numeric score that is given
			 * @type {number}
			 */
			scoreNumerator: { type: Number, converter: numberConverter },
			/**
			 * The current selected letter grade of the options given
			 * @type {string}
			 */
			selectedLetterGrade: { type: String },
			/**
			 * Set to true if displaying a negative grade that has been floored at 0
			 * @type {boolean}
			 */
			showFlooredScoreWarning: { type: Boolean },
			/**
			 * This property will show the given text under the title
			 * @type {string}
			 */
			subtitleText: { type: String },
			/**
			 * @type {object}
			 */
			studentGradePreview: { type: Object, attribute: 'student-grade-preview' },
		};
	}

	static get styles() {
		return [ bodySmallStyles, labelStyles, css`
			.d2l-grade-result-presentational-container {
				display: flex;
				flex-wrap: wrap;
				gap: 0 0.9rem;
			}
			.d2l-grade-result-presentational-score-container {
				display: flex;
				flex-wrap: wrap;
				gap: 0.3rem;
			}
			.d2l-grade-result-manual-override-clear {
				margin-top: 0.3rem;
			}
			.d2l-label-text {
				line-height: 1.6rem;
				margin-bottom: 0.4rem;
			}
			.d2l-grade-result-presentational-subtitle {
				font-weight: bold;
				margin-top: -4px;
			}
		`];
	}

	constructor() {
		super();
		this.allowNegativeScore = false;
		this.customManualOverrideClearText = undefined;
		this.hideTitle = false;
		this.includeGradeButton = false;
		this.includeReportsButton = false;
		this.isManualOverrideActive = false;
		this.labelHeadingLevel = undefined;
		this.readonly = false;
		this.selectedLetterGrade = '';
		this.showFlooredScoreWarning = false;
		this.subtitleText = undefined;
	}

	render() {
		return html`
			<div class="d2l-grade-result-presentational-container">
				<div>
					${this._renderScoreLabel()}
					${this._renderScoreSubtitle()}
					<div class="d2l-grade-result-presentational-score-container">
						${this._renderScoreComponent()}
						${this._renderGradeIconButton()}
						${this._renderGradeReportIconButton()}
					</div>
				</div>
				${this._renderStudentGradePreview()}
			</div>
			${this._renderManualOverrideButtonComponent()}
		`;
	}

	_onGradeButtonClick() {
		this.dispatchEvent(new CustomEvent('d2l-grade-result-grade-button-click', {
			bubbles: true,
			composed: true,
		}));
	}

	_onManualOverrideClearClick() {
		this.dispatchEvent(new CustomEvent('d2l-grade-result-manual-override-clear-click', {
			bubbles: true,
			composed: true
		}));
	}

	_onReportsButtonClick() {
		this.dispatchEvent(new CustomEvent('d2l-grade-result-reports-button-click', {
			bubbles: true,
			composed: true,
		}));
	}

	_renderGradeIconButton() {
		if (!this.includeGradeButton) {
			return nothing;
		}

		return html`
			<d2l-labs-grade-result-icon-button
				icon="tier1:grade"
				text=${this.gradeButtonTooltip}
				@d2l-grade-result-icon-button-click=${this._onGradeButtonClick}
			></d2l-labs-grade-result-icon-button>
		`;
	}

	_renderGradeReportIconButton() {
		if (!this.includeReportsButton) {
			return nothing;
		}

		return html`
			<d2l-labs-grade-result-icon-button
				icon="tier1:reports"
				text=${this.reportsButtonTooltip}
				@d2l-grade-result-icon-button-click=${this._onReportsButtonClick}
			></d2l-labs-grade-result-icon-button>
		`;
	}

	_renderLetterScoreComponent() {
		return html`
			<d2l-labs-grade-result-letter-score
				.availableOptions=${this.letterGradeOptions}
				label=${this.inputLabelText}
				?readonly=${this.readonly}
				selected-option=${ifDefined(this.selectedLetterGrade)}
			></d2l-labs-grade-result-letter-score>
		`;
	}

	_renderManualOverrideButtonComponent() {
		if (!this.isManualOverrideActive) {
			return nothing;
		}

		const text = this.customManualOverrideClearText ? this.customManualOverrideClearText : this.localize('components:gradeResult:clearManualOverride');

		return html`
			<d2l-button-subtle
				class="d2l-grade-result-manual-override-clear"
				icon="tier1:close-default"
				text=${text}
				@click=${this._onManualOverrideClearClick}
			></d2l-button-subtle>
		`;
	}

	_renderNumericScoreComponent() {
		return html`
			<d2l-labs-grade-result-numeric-score
				?allow-negative-score=${this.allowNegativeScore}
				label=${this.inputLabelText}
				?readonly=${this.readonly}
				?required=${this.required}
				score-denominator=${ifDefined(this.scoreDenominator)}
				score-numerator=${ifDefined(this.scoreNumerator)}
				?show-floored-score-warning=${this.showFlooredScoreWarning}
			></d2l-labs-grade-result-numeric-score>
		`;
	}

	_renderScoreComponent() {
		if (this.gradeType === GradeType.Number) {
			return this._renderNumericScoreComponent();
		} else if (this.gradeType === GradeType.Letter) {
			return this._renderLetterScoreComponent();
		} else {
			throw new Error('INVALID GRADE TYPE PROVIDED');
		}
	}

	_renderScoreLabel() {
		if (this.hideTitle || !this.labelText) {
			return nothing;
		}

		return html`
			<label
				aria-level=${ifDefined(this.labelHeadingLevel)}
				class="d2l-label-text"
				for="d2l-grade"
				role=${this.labelHeadingLevel ? 'heading' : ''}>
				${this.labelText}
			</label>
		`;
	}

	_renderScoreSubtitle() {
		if (!this.subtitleText) {
			return nothing;
		}

		return html`
			<div class="d2l-grade-result-presentational-subtitle d2l-body-small">
				${this.subtitleText}
			</div>
		`;
	}

	_renderStudentGradePreview() {
		if (!this.studentGradePreview) {
			return nothing;
		}

		return html`
			<d2l-labs-grade-result-student-grade-preview
				?hidden=${!this.displayStudentGradePreview}
				out-of=${this.scoreDenominator}
				.studentGradePreview=${this.studentGradePreview}
			></d2l-labs-grade-result-student-grade-preview>
		`;
	}

}

customElements.define('d2l-labs-grade-result-presentational', D2LGradeResultPresentational);
