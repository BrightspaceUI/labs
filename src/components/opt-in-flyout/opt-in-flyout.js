import '@brightspace-ui/core/components/typography/typography.js';
import './flyout-impl.js';
import { css, html, LitElement } from 'lit';

class OptInFlyout extends LitElement {

	static get properties() {
		return {
			opened: { type: Boolean, reflect: true },
			flyoutTitle: { attribute: 'flyout-title', type: String },
			shortDescription: { type: String, attribute: 'short-description' },
			longDescription: { type: String, attribute: 'long-description' },
			tabPosition: { type: String, attribute: 'tab-position' },
			tutorialLink: { type: String, attribute: 'tutorial-link' },
			helpDocsLink: { type: String, attribute: 'help-docs-link' }
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
				class="d2l-typography"
				flyout-title="${this.flyoutTitle}"
				short-description="${this.shortDescription}"
				long-description="${this.longDescription}"
				tab-position="${this.tabPosition}"
				tutorial-link="${this.tutorialLink}"
				help-docs-link="${this.helpDocsLink}"
				?opened="${this.opened}"
				@flyout-opened="${this._handleOpened}"
				@flyout-closed="${this._handleClosed}">
			</d2l-labs-opt-in-flyout-impl>
		`;
	}

	_handleClosed() {
		this.opened = false;
	}

	_handleOpened() {
		this.opened = true;
	}

}

customElements.define('d2l-labs-opt-in-flyout', OptInFlyout);
