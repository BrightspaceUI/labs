import '@brightspace-ui/core/components/link/link.js';
import { CommunityBase } from './community-base.js';
import { html } from 'lit';

class CommunityLink extends CommunityBase {

	static get properties() {
		return {
			...CommunityBase.properties,
			text: { type: String },
		};
	}

	render() {
		return html`<d2l-link href="${this.communityArticleDirective(this.langController.language)}" target="_blank">${this.text}</d2l-link>`;
	}
}

customElements.define('d2l-labs-link-community', CommunityLink);
