import './d2l-grade-result-icon-button.js';
import './d2l-grade-result-numeric-score.js';
import './d2l-grade-result-letter-score.js';
import './d2l-grade-result-student-grade-preview.js';
import '@brightspace-ui/core/components/button/button-subtle.js';
import { bodySmallStyles, labelStyles } from '@brightspace-ui/core/components/typography/styles.js';
import { css, html, LitElement, nothing } from 'lit';
import { GradeType } from '../controller/Grade.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { Localizer } from './locale.js';

const numberConverter = {
	fromAttribute: (attr) => { return !attr ? undefined : Number(attr); },
	toAttribute:  (prop) => { return String(prop); }
};

export class D2LGradeResultPresentational extends Localizer(LitElement) {
	static get properties() {
		return {
			gradeType: { type: String },
			labelText: { type: String },
			scoreDenominator: { type: Number },
			scoreNumerator: { type: Number, converter: numberConverter },
			letterGradeOptions: { type: Object },
			selectedLetterGrade: { type: String },
			includeGradeButton: { type: Boolean },
			includeReportsButton: { type: Boolean },
			gradeButtonTooltip: { type: String },
			reportsButtonTooltip: { type: String },
			readOnly: { type: Boolean },
			isManualOverrideActive: { type: Boolean },
			hideTitle: { type: Boolean },
			customManualOverrideClearText: { type: String },
			subtitleText: { type: String },
			required: { type: Boolean },
			inputLabelText: { type: String },
			labelHeadingLevel: { type: Number },
			allowNegativeScore: { type: Boolean },
			showFlooredScoreWarning: { type: Boolean },
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
				margin-top: -4px;
				font-weight: bold;
			}
		`];
	}

	constructor() {
		super();
		this.readOnly = false;
		this.includeGradeButton = false;
		this.includeReportsButton = false;
		this.selectedLetterGrade = '';
		this.isManualOverrideActive = false;
		this.showFlooredScoreWarning = false;
		this.hideTitle = false;
		this.customManualOverrideClearText = undefined;
		this.subtitleText = undefined;
		this.allowNegativeScore = false;
		this.labelHeadingLevel = undefined;
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

	_isReadOnly() {
		return Boolean(this.readOnly);
	}

	_onGradeButtonClick() {
		this.dispatchEvent(new CustomEvent('d2l-grade-result-grade-button-click', {
			bubbles: true,
			composed: true,
		}));
	}

	_onManualOverrideClearClick() {
		this.dispatchEvent(new CustomEvent('d2l-grade-result-manual-override-clear-click', {
			composed: true,
			bubbles: true
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
			<d2l-grade-result-icon-button
				text=${this.gradeButtonTooltip}
				icon="tier1:grade"
				@d2l-grade-result-icon-button-click=${this._onGradeButtonClick}
			></d2l-grade-result-icon-button>
		`;
	}

	_renderGradeReportIconButton() {
		if (!this.includeReportsButton) {
			return nothing;
		}

		return html`
			<d2l-grade-result-icon-button
				text=${this.reportsButtonTooltip}
				icon="tier1:reports"
				@d2l-grade-result-icon-button-click=${this._onReportsButtonClick}
			></d2l-grade-result-icon-button>
		`;
	}

	_renderLetterScoreComponent() {
		return html`
			<d2l-grade-result-letter-score
				.availableOptions=${this.letterGradeOptions}
				.label=${this.inputLabelText}
				.selectedOption=${this.selectedLetterGrade}
				.readOnly=${this._isReadOnly()}
			></d2l-grade-result-letter-score>
		`;
	}

	_renderManualOverrideButtonComponent() {
		if (!this.isManualOverrideActive) {
			return nothing;
		}

		const text = this.customManualOverrideClearText ? this.customManualOverrideClearText : this.localize('clearManualOverride');

		return html`
			<d2l-button-subtle
				class="d2l-grade-result-manual-override-clear"
				text=${text}
				icon="tier1:close-default"
				@click=${this._onManualOverrideClearClick}
			></d2l-button-subtle>
		`;
	}

	_renderNumericScoreComponent() {
		return html`
			<d2l-grade-result-numeric-score
				.label=${this.inputLabelText}
				.scoreNumerator=${this.scoreNumerator}
				.scoreDenominator=${this.scoreDenominator}
				.readOnly=${this._isReadOnly()}
				?required=${this.required}
				?showFlooredScoreWarning=${this.showFlooredScoreWarning}
				?allowNegativeScore=${this.allowNegativeScore}
			></d2l-grade-result-numeric-score>
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
				class="d2l-label-text"
				role=${this.labelHeadingLevel ? 'heading' : ''}
				aria-level=${ifDefined(this.labelHeadingLevel)}
				for="d2l-grade">
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
		return html`
			<d2l-grade-result-student-grade-preview
				.studentGradePreview=${this.studentGradePreview}
				out-of=${this.scoreDenominator}>
			</d2l-grade-result-student-grade-preview>
		`;
	}

}

customElements.define('d2l-labs-d2l-grade-result-presentational', D2LGradeResultPresentational);
