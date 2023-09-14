import './link-temp.js';
import { html, LitElement } from 'lit';
import { CommunityBase } from './community-base.js';

class CommunityLink extends CommunityBase(LitElement) {

	static get properties() {
		return {
			text: { type: String },
			small: { type: Boolean }
		};
	}

	render() {
		return html`<d2l-labs-link-temp new-window href="${this.communityArticleDirective(this.langController.language)}" ?small=${this.small} >${this.text}</d2l-labs-link-temp>`;
	}
}

customElements.define('d2l-labs-community-link', CommunityLink);
