import '@brightspace-ui/core/components/button/button-subtle.js';
import { html, LitElement } from 'lit';
import { CommunityBase } from './community-base.js';

class CommunityLink extends CommunityBase(LitElement) {

	static get properties() {
		return {
			text: { type: String },
		};
	}

	render() {
		return html`<d2l-button-subtle
			icon="d2l-tier1:help"
			text=${this.text}
			@click="${this._handleButtonClick}"
		></d2l-button-subtle>`;
	}

	_handleButtonClick() {
		const link = this.communityArticleDirective(this.langController.language);
		window.open(link, '_blank');
	}
}

customElements.define('d2l-labs-community-button', CommunityLink);
