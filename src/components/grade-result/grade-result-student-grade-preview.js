import '@brightspace-ui/core/components/offscreen/offscreen.js';
import { bodyCompactStyles, bodySmallStyles, labelStyles } from '@brightspace-ui/core/components/typography/styles.js';
import { css, html, LitElement, nothing } from 'lit';
import { formatNumber } from '@brightspace-ui/intl/lib/number.js';
import { LocalizeLabsElement } from '../localize-labs-element.js';

const previewOptions = {
	colour: 'colour',
	score: 'score',
	symbol: 'symbol'
};

export class D2LGradeResultStudentGradePreview extends LocalizeLabsElement(LitElement) {

	static get properties() {
		return {
			hideLabel: {
				type: Boolean,
				attribute: 'hide-label'
			},
			outOf: {
				type: Number,
				attribute: 'out-of'
			},
			studentGradePreview: {
				type: Object,
				attribute: 'student-grade-preview'
			}
		};
	}

	static get styles() {
		return [bodySmallStyles, bodyCompactStyles, labelStyles, css`
			:host {
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}
			.d2l-grade-result-student-grade-preview-container {
				align-items: center;
				display: flex;
				flex-direction: row;
				gap: 0.5rem;
				min-height: calc(2rem + 2px);
			}
			.d2l-grade-result-student-grade-preview-colour {
				border-radius: 6px;
				height: 0.9rem;
				width: 0.9rem;
			}
			.d2l-label-text {
				line-height: 1.6rem;
				margin-bottom: 0.4rem;
			}
		`];
	}

	constructor() {
		super();
		this.hideLabel = false;
	}

	render() {
		if (!this.studentGradePreview) {
			return nothing;
		}

		let label = nothing;
		if (!this.hideLabel) {
			label = html`
				<label class="d2l-label-text d2l-skeletize" for="d2l-grade-result-student-grade-preview">
					${this.localize('components:gradeResult:studentGradePreviewLabel')}
				</label>
			`;
		}

		const shouldDisplayAny = Object.values(previewOptions).some(option => this._shouldDisplay(option));
		if (!shouldDisplayAny) {
			return html`
				${label}
				<div class="d2l-body-small d2l-grade-result-student-grade-preview-container" id="d2l-grade-result-student-grade-preview">
					${this.localize('components:gradeResult:studentGradePreviewNotShown')}
				</div>
			`;
		}

		return html`
			${label}
			<div id="d2l-grade-result-student-grade-preview" class="d2l-grade-result-student-grade-preview-container">
				${this._renderColour()}
				${this._renderScoreAndSymbol()}
			</div>
		`;
	}

	_renderColour()	{
		if (!this._shouldDisplay(previewOptions.colour) || !this.studentGradePreview.colour) {
			return nothing;
		}

		return html`
			<div class="d2l-grade-result-student-grade-preview-colour"
				style="background-color: ${this.studentGradePreview.colour};">
			</div>
		`;
	}

	_renderScoreAndSymbol() {
		if (!this._shouldDisplay(previewOptions.score) && !this._shouldDisplay(previewOptions.symbol)) {
			return nothing;
		}

		const score = this._shouldDisplay(previewOptions.score)
			? `${this.studentGradePreview?.score && typeof this.studentGradePreview?.score === 'number' ? formatNumber(this.studentGradePreview?.score) : ''} / ${this.outOf && typeof this.outOf === 'number' ? formatNumber(this.outOf) : 0}`
			: '';
		const accessibleScore = this._shouldDisplay(previewOptions.score) ? this.localize('components:gradeResult:numeratorOutOfDenominator', { numerator: this.studentGradePreview?.score, denominator: this.outOf }) : '';

		const symbol = this._shouldDisplay(previewOptions.symbol) ? this.studentGradePreview?.symbol : '';

		const separator = score && symbol ? ' - ' : '';

		return html`
			<div aria-hidden="true" class="d2l-body-compact">
				${`${score}${separator}${symbol}`}
			</div>
			<d2l-offscreen>
				${`${accessibleScore}${separator}${symbol}`}
			</d2l-offscreen>
		`;
	}

	_shouldDisplay(property) {
		return Object.prototype.hasOwnProperty.call(this.studentGradePreview, property);
	}

}

customElements.define('d2l-labs-grade-result-student-grade-preview', D2LGradeResultStudentGradePreview);
