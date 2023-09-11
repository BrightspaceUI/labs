import '@brightspace-ui/core/components/link/link.js';
import { html, LitElement } from 'lit';
import { CommunityBase } from './community-base.js';

class CommunityLink extends CommunityBase(LitElement) {

	static get properties() {
		return {
			text: { type: String },
		};
	}

	render() {
		return html`<d2l-link href="${this.communityArticleDirective(this.langController.language)}" target="_blank">${this.text}</d2l-link>`;
	}
}

customElements.define('d2l-labs-community-link', CommunityLink);
