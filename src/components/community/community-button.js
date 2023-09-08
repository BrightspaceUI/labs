import '@brightspace-ui/core/components/button/button-subtle.js';
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

customElements.define('d2l-labs-button-community', CommunityLink);
