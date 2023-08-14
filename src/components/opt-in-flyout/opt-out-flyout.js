import '@brightspace-ui/core/components/typography/typography.js';
import './flyout-impl.js';
import { css, html, LitElement } from 'lit';

class OptOutFlyout extends LitElement {

	static get properties() {
		return {
			opened: { type: Boolean, reflect: true },
			flyoutTitle: { attribute: 'flyout-title', type: String },
			shortDescription: { type: String, attribute: 'short-description' },
			longDescription: { type: String, attribute: 'long-description' },
			tutorialLink: { type: String, attribute: 'tutorial-link' },
			helpDocsLink: { type: String, attribute: 'help-docs-link' },
			hideReason: { type: Boolean, attribute: 'hide-reason' },
			hideFeedback: { type: Boolean, attribute: 'hide-feedback' }
		};
	}

	static get styles() {
		return css`
			d2l-labs-opt-in-flyout-impl {
				font-size: 20px;
			}
		`;
	}

	constructor() {
		super();
		this.opened = false;
	}

	render() {
		return html`
			<d2l-labs-opt-in-flyout-impl
				id="flyout-impl"
				class="d2l-typography"
				opt-out
				flyout-title="${this.flyoutTitle}"
				short-description="${this.shortDescription}"
				long-description="${this.longDescription}"
				tutorial-link="${this.tutorialLink}"
				help-docs-link="${this.helpDocsLink}"
				?hide-reason="${this.hideReason}"
				?hide-feedback="${this.hideFeedback}"
				?opened="${this.opened}"
				@flyout-opened="${this._handleOpened}"
				@flyout-closed="${this._handleClosed}">
				<slot></slot>
			</d2l-labs-opt-in-flyout-impl>
		`;
	}

	focus() {
		if (!this.shadowRoot) {
			return;
		}

		const element = this.shadowRoot.querySelector('d2l-labs-opt-in-flyout-impl');

		if (!element) {
			return;
		}

		element.focus();
	}

	_handleClosed() {
		this.opened = false;
	}

	_handleOpened() {
		this.opened = true;
	}

}

customElements.define('d2l-labs-opt-out-flyout', OptOutFlyout);
