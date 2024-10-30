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
			allowNegativeScore: { type: Boolean },
			customManualOverrideClearText: { type: String },
			displayStudentGradePreview: { type: Boolean, attribute: 'display-student-grade-preview' },
			gradeButtonTooltip: { type: String },
			gradeType: { type: String },
			hideTitle: { type: Boolean },
			includeGradeButton: { type: Boolean },
			includeReportsButton: { type: Boolean },
			inputLabelText: { type: String },
			isManualOverrideActive: { type: Boolean },
			labelHeadingLevel: { type: Number },
			labelText: { type: String },
			letterGradeOptions: { type: Object },
			readOnly: { type: Boolean },
			reportsButtonTooltip: { type: String },
			required: { type: Boolean },
			scoreDenominator: { type: Number },
			scoreNumerator: { type: Number, converter: numberConverter },
			selectedLetterGrade: { type: String },
			showFlooredScoreWarning: { type: Boolean },
			subtitleText: { type: String },
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
		this.allowNegativeScore = false;
		this.customManualOverrideClearText = undefined;
		this.hideTitle = false;
		this.includeGradeButton = false;
		this.includeReportsButton = false;
		this.isManualOverrideActive = false;
		this.labelHeadingLevel = undefined;
		this.readOnly = false;
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
			<d2l-grade-result-icon-button
				icon="tier1:grade"
				text=${this.gradeButtonTooltip}
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
				icon="tier1:reports"
				text=${this.reportsButtonTooltip}
				@d2l-grade-result-icon-button-click=${this._onReportsButtonClick}
			></d2l-grade-result-icon-button>
		`;
	}

	_renderLetterScoreComponent() {
		return html`
			<d2l-grade-result-letter-score
				.availableOptions=${this.letterGradeOptions}
				.label=${this.inputLabelText}
				.readOnly=${this._isReadOnly()}
				.selectedOption=${this.selectedLetterGrade}
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
				icon="tier1:close-default"
				text=${text}
				@click=${this._onManualOverrideClearClick}
			></d2l-button-subtle>
		`;
	}

	_renderNumericScoreComponent() {
		return html`
			<d2l-grade-result-numeric-score
				?allowNegativeScore=${this.allowNegativeScore}
				.label=${this.inputLabelText}
				.readOnly=${this._isReadOnly()}
				?required=${this.required}
				.scoreDenominator=${this.scoreDenominator}
				.scoreNumerator=${this.scoreNumerator}
				?showFlooredScoreWarning=${this.showFlooredScoreWarning}
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
			<d2l-grade-result-student-grade-preview
				?hidden=${!this.displayStudentGradePreview}
				out-of=${this.scoreDenominator}
				.studentGradePreview=${this.studentGradePreview}
			></d2l-grade-result-student-grade-preview>
		`;
	}

}

customElements.define('d2l-labs-d2l-grade-result-presentational', D2LGradeResultPresentational);
