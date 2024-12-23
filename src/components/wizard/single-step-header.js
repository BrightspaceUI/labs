import { css, html, LitElement, nothing } from 'lit';
import { bodySmallStyles } from '@brightspace-ui/core/components/typography/styles.js';
import { LocalizeLabsElement } from '../localize-labs-element.js';

class D2LSingleStepHeader extends LocalizeLabsElement(LitElement) {

	static get properties() {
		return {
			title: {
				type: String,
				attribute: 'title'
			},
			totalSteps: {
				type: Number,
				attribute: 'total-steps'
			},
			currentStep: {
				type: Number,
				attribute: 'current-step'
			},
			selectedStep: {
				type: Number,
				attribute: 'selected-step'
			},
			fillHeaderWidth: {
				type: Boolean,
				attribute: 'fill-header-width',
				reflect: true
			}
		};
	}

	static get styles() {
		return [bodySmallStyles, css`
			.d2l-labs-single-step-header-circle {
				border: 2px solid;
				border-radius: 50%;
				height: 26px;
				width: 26px;
			}

			.d2l-labs-single-step-header-inner-progress-circle {
				background-color: var(--d2l-color-celestine);
				border-radius: 50%;
				height: 22px;
				margin: 2px;
				width: 22px;
			}

			.d2l-labs-single-step-header-step {
				display: inline-block;
				text-align: center;
			}

			hr {
				height: 4px;
				margin: auto;
				width: 60px;
			}

			.d2l-labs-single-step-header-step-header {
				display: flex;
			}

			.d2l-labs-single-step-header-step-title {
				background: none !important;
				border: none !important;
				color: var(--d2l-color-ferrite);
				margin: auto;
				max-width: 120px;
				overflow-wrap: break-word;
			}

			:host([fill-header-width]) .d2l-labs-single-step-header-step-title {
				max-width: 150px;
			}

			.d2l-labs-single-step-header-done-icon {
				color: var(--d2l-color-olivine);
				height: 20px;
				padding: 2px;
				width: 20px;
			}

			.d2l-labs-single-step-header-done {
				border-color: var(--d2l-color-olivine);
				color: var(--d2l-color-olivine);
			}

			.d2l-labs-single-step-header-done hr,
			.d2l-labs-single-step-header-in-progress hr:first-child {
				background: var(--d2l-color-olivine);
				border: var(--d2l-color-olivine);
			}

			.d2l-labs-single-step-header-in-progress {
				border-color: var(--d2l-color-celestine);
				color: var(--d2l-color-celestine);
			}

			.d2l-labs-single-step-header-not-started .d2l-labs-single-step-header-circle {
				background-color: var(--d2l-color-mica);
				border-color: var(--d2l-color-mica);
			}

			.d2l-labs-single-step-header-in-progress hr:last-child,
			.d2l-labs-single-step-header-not-started hr {
				background: var(--d2l-color-mica);
				border: var(--d2l-color-mica);
			}

			.d2l-labs-single-step-header-first hr:first-child,
			.d2l-labs-single-step-header-last hr:last-child {
				visibility: hidden;
			}
		`];
	}

	constructor() {
		super();

		this.title = '';
		this.totalSteps = 0;
		this.currentStep = 0;
		this.selectedStep = 0;
		this.fillHeaderWidth = false;
	}

	render() {
		return html`
			<div class="${this._getIsFirst()} ${this._getIsLast()}">
				<div class="d2l-labs-single-step-header-step">
					<div class="${this._getProgressStatus()} d2l-labs-single-step-header-step-header">
						<hr>

						<div class="d2l-labs-single-step-header-circle" title="${this._getStepLabel()}">
							${this._isDone() ? html`<d2l-icon class="d2l-labs-single-step-header-done-icon" icon="d2l-tier1:check"></d2l-icon>` : nothing}
							${this._isInProgress() ? html`<div class="d2l-labs-single-step-header-inner-progress-circle"></div>` : nothing}
						</div>

						<hr>
					</div>
					<div class="${this._getProgressStatus()} d2l-labs-single-step-header-step-title d2l-body-small">${this.title}</div>
				</div>
			</div>
		`;
	}

	_getIsFirst() {
		if (this.currentStep === 0) {
			return 'd2l-labs-single-step-header-first';
		}
		return '';
	}

	_getIsLast() {
		if (this.totalSteps === this.currentStep + 1) {
			return 'd2l-labs-single-step-header-last';
		}
		return '';
	}

	_getProgressStatus() {
		let className = 'd2l-labs-single-step-header-not-started';
		if (this._isDone()) {
			className = 'd2l-labs-single-step-header-done';
		} else if (this._isInProgress()) {
			className = 'd2l-labs-single-step-header-in-progress';
		}
		return className;
	}

	_getStepLabel() {
		return this.localize('components:wizard:aria.steplabel', 'totalSteps', this.totalSteps, 'currentStep', this.currentStep + 1);
	}

	_isDone() {
		return this.currentStep < this.selectedStep;
	}

	_isInProgress() {
		return this.currentStep === this.selectedStep;
	}

}

customElements.define('d2l-labs-single-step-header', D2LSingleStepHeader);
