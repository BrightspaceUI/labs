import '@brightspace-ui/core/components/button/button.js';
import { css, html, LitElement, nothing } from 'lit';
import { LocalizeLabsElement } from '../localize-labs-element.js';
import { offscreenStyles } from '@brightspace-ui/core/components/offscreen/offscreen.js';

class D2LStep extends LocalizeLabsElement(LitElement) {

	static properties = {
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
		backButtonTitle: {
			type: String,
			attribute: 'back-button-title'
		},
		backButtonTooltip: {
			type: String,
			attribute: 'back-button-tooltip'
		},
		displayBackButton: {
			type: Boolean,
			attribute: 'display-back-button'
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

	static styles = [offscreenStyles, css`
		.d2l-labs-wizard-step-footer {
			display: flex;
			justify-content: space-between;
			width: 100%;
		}

		.d2l-labs-wizard-step-footer-start {
			display: flex;
			gap: 0.6rem;
		}

		.d2l-labs-wizard-step-button-next {
			float: right;
		}
	`];

	constructor() {
		super();
		this.displayBackButton = false;
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
				<div class="d2l-labs-wizard-step-footer-start">
	${this.displayBackButton
		? this.#renderBackButton()
		: nothing}

	${this.hideRestartButton
		? nothing
		: this.#renderRestartButton()}
				</div>

	${this.hideNextButton
		? html`<div></div>`
		: this.#renderNextButton()}

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

	#handleBackClick() {
		this.dispatchEvent(new CustomEvent('stepper-back', { bubbles: true, composed: true }));
	}

	#handleNextClick() {
		this.dispatchEvent(new CustomEvent('stepper-next', { bubbles: true, composed: true }));
	}

	#handleRestartClick() {
		this.dispatchEvent(new CustomEvent('stepper-restart', { bubbles: true, composed: true }));
	}

	#renderBackButton() {
		return html`
			<d2l-button
				title="${!this.backButtonTooltip ? this.localize('components:wizard:back.button.tooltip') : this.backButtonTooltip}"
				@click="${this.#handleBackClick}"
			>
			${!this.backButtonTitle ? this.localize('components:wizard:stepper.defaults.back') : this.backButtonTitle}
			</d2l-button>`;
	}

	#renderNextButton() {
		return html`
			<d2l-button
				class="d2l-labs-wizard-step-button-next"
				title="${!this.nextButtonTooltip ? this.localize('components:wizard:next.button.tooltip') : this.nextButtonTooltip}"
				aria-label="${this.nextButtonAriaLabel}"
				@click="${this.#handleNextClick}"
				primary
				?disabled="${this.disableNextButton}"
			>
			${!this.nextButtonTitle ? this.localize('components:wizard:stepper.defaults.next') : this.nextButtonTitle}
			</d2l-button>`;
	}

	#renderRestartButton() {
		return html`
			<d2l-button
				title="${!this.restartButtonTooltip ? this.localize('components:wizard:restart.button.tooltip') : this.restartButtonTooltip}"
				aria-label="${this.restartButtonAriaLabel}"
				@click="${this.#handleRestartClick}"
			>
			${!this.restartButtonTitle ? this.localize('components:wizard:stepper.defaults.restart') : this.restartButtonTitle}
			</d2l-button>`;
	}
}

customElements.define('d2l-labs-wizard-step', D2LStep);
