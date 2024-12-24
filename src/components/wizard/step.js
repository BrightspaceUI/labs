import '@brightspace-ui/core/components/button/button.js';
import { css, html, LitElement } from 'lit';
import { LocalizeLabsElement } from '../localize-labs-element.js';
import { offscreenStyles } from '@brightspace-ui/core/components/offscreen/offscreen.js';

class D2LStep extends LocalizeLabsElement(LitElement) {
	static get properties() {
		return {
			nextButtonTitle: {
				type: String,
				attribute: 'next-button-title'
			},
			nextButtonTooltip: {
				type: String,
				attribute: 'next-button-tooltip'
			},
			restartButtonTitle: {
				type: String,
				attribute: 'restart-button-title'
			},
			restartButtonTooltip: {
				type: String,
				attribute: 'restart-button-tooltip'
			},
			hideRestartButton: {
				type: Boolean,
				attribute: 'hide-restart-button'
			},
			hideNextButton: {
				type: Boolean,
				attribute: 'hide-next-button'
			},
			disableNextButton: {
				type: Boolean,
				attribute: 'disable-next-button'
			},
			nextButtonAriaLabel: {
				type: String,
				attribute: 'next-button-aria-label'
			},
			restartButtonAriaLabel: {
				type: String,
				attribute: 'restart-button-aria-label'
			},
			ariaTitle: {
				type: String,
				attribute: 'aria-title'
			},
			stepTitle: {
				type: String,
				attribute: 'step-title'
			},
			stepCount: {
				type: Number,
				attribute: 'step-count'
			},
			thisStep: {
				type: Number,
				attribute: 'this-step'
			}
		};
	}

	static get styles() {
		return [offscreenStyles, css`
			.d2l-labs-wizard-step-footer {
				display: flex;
				justify-content: space-between;
				width: 100%;
			}

			.d2l-labs-wizard-step-button-next {
				float: right;
			}
		`];
	}

	constructor() {
		super();
		this.hideRestartButton = false;
		this.hideNextButton = false;
		this.disableNextButton = false;
		this.nextButtonAriaLabel = '';
		this.restartButtonAriaLabel = '';
		this.ariaTitle = '';
		this.stepTitle = '';
		this.stepCount = 1;
		this.thisStep = 1;
	}

	render() {
		return html`
			<div id="aria-title" tabindex="0" class="d2l-offscreen">${this._getAriaTitle()}</div>
			<slot></slot>
			<div class="d2l-labs-wizard-step-footer">
	${this.hideRestartButton
		? html`<div></div>`
		: html`
			<d2l-button
				title="${!this.restartButtonTooltip ? this.localize('components:wizard:restart.button.tooltip') : this.restartButtonTooltip}"
				aria-label="${this.restartButtonAriaLabel}"
				@click="${this._restartClick}"
			>
			${!this.restartButtonTitle ? this.localize('components:wizard:stepper.defaults.restart') : this.restartButtonTitle}
			</d2l-button>`}

	${this.hideNextButton
		? html`<div></div>`
		: html`
			<d2l-button
				class="d2l-labs-wizard-step-button-next"
				title="${!this.nextButtonTooltip ? this.localize('components:wizard:next.button.tooltip') : this.nextButtonTooltip}"
				aria-label="${this.nextButtonAriaLabel}"
				@click="${this._nextClick}"
				primary
				?disabled="${this.disableNextButton}"
			>
			${!this.nextButtonTitle ? this.localize('components:wizard:stepper.defaults.next') : this.nextButtonTitle}
			</d2l-button>`}

			</div>
		`;
	}

	_getAriaTitle() {
		if (this.ariaTitle) {
			return this.ariaTitle;
		} else if (this.stepTitle) {
			return `${this.stepTitle}. ${this._getStepLabel()}`;
		}
		return this._getStepLabel();
	}

	_getStepLabel() {
		return this.localize('components:wizard:aria.steplabel', 'totalSteps', this.stepCount, 'currentStep', this.thisStep);
	}

	_nextClick() {
		this.dispatchEvent(new CustomEvent('stepper-next', { bubbles: true, composed: true }));
	}

	_restartClick() {
		this.dispatchEvent(new CustomEvent('stepper-restart', { bubbles: true, composed: true }));
	}
}

customElements.define('d2l-labs-wizard-step', D2LStep);
