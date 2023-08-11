import '@brightspace-ui/core/components/typography/typography.js';
import './flyout-impl.js';
import { css, html, LitElement } from 'lit';

class OptInFlyout extends LitElement {

	static get properties() {
		return {
			open: { type: Boolean, reflect: true },
			title: { type: String },
			shortDescription: { type: String, attribute: 'short-description' },
			longDescription: { type: String, attribute: 'long-description' },
			tabPosition: { type: String, attribute: 'tab-position' },
			tutorialLink: { type: String, attribute: 'tutorial-link' },
			helpDocsLink: { type: String, attribute: 'help-docs-link' }
		};
	}

	static get styles() {
		return css`
			flyout-impl {
				font-size: 20px;
			}
		`;
	}

	constructor() {
		super();
		this.open = false;
	}

	render() {
		return html`
			<flyout-impl
				class="d2l-typography"
				title="${this.title}"
				short-description="${this.shortDescription}"
				long-description="${this.longDescription}"
				tab-position="${this.tabPosition}"
				tutorial-link="${this.tutorialLink}"
				help-docs-link="${this.helpDocsLink}"
				?open="${this.open}"
				@flyout-opened="${this._handleOpened}"
				@flyout-closed="${this._handleClosed}">
			</flyout-impl>
		`;
	}

	_handleClosed() {
		this.open = false;
	}

	_handleOpened() {
		this.open = true;
	}

}

customElements.define('d2l-opt-in-flyout', OptInFlyout);
