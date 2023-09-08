import '@brightspace-ui/core/components/link/link.js';
import '@brightspace-ui/core/components/button/button-subtle.js';
import { html, LitElement } from 'lit';
import { communityUrlFactory } from './directive/community-article.js';
import { LanguageListenerController } from '../../controllers/language-listener/language-listener.js';

class CommunityLink extends LitElement {

	static get properties() {
		return {
			text: { type: String },
			articleMap: { attribute: 'article-map', type: Object }
		};
	}

	constructor() {
		super();
		this.langController = new LanguageListenerController(this);
	}

	connectedCallback() {
		super.connectedCallback();
		this.communityArticleDirective = communityUrlFactory(this.articleMap);
	}

	render() {
		return html`<d2l-link href="${this.communityArticleDirective(this.langController.language)}" target="_blank">${this.text}</d2l-link>`;
	}
}

customElements.define('d2l-labs-link-community', CommunityLink);
