import './d2l-grade-result-icon-button.js';
import './d2l-grade-result-numeric-score.js';
import './d2l-grade-result-letter-score.js';
import '@brightspace-ui/core/components/button/button-subtle.js';
import { css, html, LitElement } from 'lit-element';
import { bodySmallStyles } from '@brightspace-ui/core/components/typography/styles.js';
import getLocalizationTranslations from './locale.js';
import { GradeType } from '../controller/Grade.js';
import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize-mixin.js';

export class D2LGradeResultPresentational extends LocalizeMixin(LitElement) {
	static get properties() {
		return {
			gradeType: { type: String },
			labelText: { type: String },
			scoreDenominator: { type: Number },
			scoreNumerator: { type: Number },
			letterGradeOptions: { type: Object },
			selectedLetterGrade: { type: String },
			includeGradeButton: { type: Boolean },
			includeReportsButton: { type: Boolean },
			gradeButtonTooltip: { type: String },
			reportsButtonTooltip: { type: String },
			readOnly: { type: Boolean },
			isGradeAutoCompleted: { type: Boolean },
			isManualOverrideActive: { type: Boolean },
			hideTitle: { type: Boolean },
			customManualOverrideText: { type: String },
			customManualOverrideClearText: { type: String },
			subtitleText: { type: String },
			validationError: { type: String }
		};
	}

	static get styles() {
		return [ bodySmallStyles, css`
			.d2l-grade-result-presentational-container {
				display: flex;
				flex-direction: row;
				align-items: center;
			}
			.d2l-grade-result-presentational-subtitle {
				margin-top: -4px;
				margin-bottom: 4px;
			}
		`];
	}

	static async getLocalizeResources(langs) {
		return await getLocalizationTranslations(langs);
	}

	constructor() {
		super();
		this.readOnly = false;
		this.includeGradeButton = false;
		this.includeReportsButton = false;
		this.selectedLetterGrade = '';
		this.isGradeAutoCompleted = false;
		this.isManualOverrideActive = false;
		this.hideTitle = false;
		this.customManualOverrideText = undefined;
		this.customManualOverrideClearText = undefined;
		this.subtitleText = undefined;
	}

	render() {
		return html`
			<div>
				${this._renderTitle()}
			</div>

			${this._renderSubtitle()}

			<div class="d2l-grade-result-presentational-container">
				${this._renderScoreComponent()}

				${this.includeGradeButton ?  html`
					<d2l-grade-result-icon-button
						.tooltipText=${this.gradeButtonTooltip}
						ariaLabel="Grades"
						icon="tier1:grade"
						@d2l-grade-result-icon-button-click=${this._onGradeButtonClick}
					></d2l-grade-result-icon-button>
				` : html``}

				${this.includeReportsButton ? html`
					<d2l-grade-result-icon-button
						.tooltipText=${this.reportsButtonTooltip}
						ariaLabel="Reports"
						icon="tier1:reports"
						@d2l-grade-result-icon-button-click=${this._onReportsButtonClick}
					></d2l-grade-result-icon-button>
				` : html``}

			</div>

			${this._renderManualOverrideButtonComponent()}
		`;
	}

	_isReadOnly() {
		if (this.isGradeAutoCompleted && !this.isManualOverrideActive) {
			return true;
		}
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

	_onManualOverrideClick() {
		this.dispatchEvent(new CustomEvent('d2l-grade-result-manual-override-click', {
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

	_renderLetterScoreComponent() {
		return html`
			<d2l-grade-result-letter-score
				.availableOptions=${this.letterGradeOptions}
				.selectedOption=${this.selectedLetterGrade}
				.readOnly=${this._isReadOnly()}
			></d2l-grade-result-letter-score>
		`;
	}

	_renderManualOverrideButtonComponent() {
		if (this.isGradeAutoCompleted) {
			let text, icon, onClick;

			if (this.isManualOverrideActive) {
				text = this.customManualOverrideClearText ? this.customManualOverrideClearText : this.localize('clearManualOverride');
				icon = 'tier1:close-default';
				onClick = this._onManualOverrideClearClick;
			} else {
				text = this.customManualOverrideText ? this.customManualOverrideText : this.localize('manuallyOverrideGrade');
				icon = 'tier1:edit';
				onClick = this._onManualOverrideClick;
			}

			return html`
				<d2l-button-subtle
					text=${text}
					icon=${icon}
					@click=${onClick}
				></d2l-button-subtle>
			`;
		}

		return html``;
	}

	_renderNumericScoreComponent() {
		return html`
			<d2l-grade-result-numeric-score
				.scoreNumerator=${this.scoreNumerator}
				.scoreDenominator=${this.scoreDenominator}
				.readOnly=${this._isReadOnly()}
				.validationError=${this.validationError}
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

	_renderSubtitle() {
		if (this.subtitleText) {
			return html`<div class="d2l-grade-result-presentational-subtitle d2l-body-small">
					${this.subtitleText}
				</div>
			`;
		}
		return html``;
	}

	_renderTitle() {
		if (!this.hideTitle && this.labelText) {
			return html`
				<span class="d2l-input-label">
					${this.labelText}
				</span>
			`;
		}

		return html``;
	}

}

customElements.define('d2l-labs-d2l-grade-result-presentational', D2LGradeResultPresentational);
