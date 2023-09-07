import '@brightspace-ui/core/components/link/link.js';
import '@brightspace-ui/core/components/button/button-icon.js';
import { html, LitElement } from 'lit';
import { getDocumentLocaleSettings } from '@brightspace-ui/intl/lib/common.js';

class CommunityLink extends LitElement {

	static get properties() {
		return {
			text: { type: String },
			type: { type: String },
			articleMap: { attribute: 'article-map', type: Object }
		};
	}

	constructor() {
		super();
		this._localeSettings = getDocumentLocaleSettings();
		this._handleUpdate = () => this.requestUpdate();
	}

	get link() {
		const { language } = getDocumentLocaleSettings();
		const { articleCode, langCode } = this._getArticleCode(language);

		return `https://community.d2l.com/brightspace${langCode === 'en' ? '' : `-${langCode}`}/kb/articles/${articleCode}`;
	}

	connectedCallback() {
		super.connectedCallback();
		this._localeSettings.addChangeListener(this._handleUpdate);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this._localeSettings.removeChangeListener(this._handleUpdate);
	}

	render() {
		return this.type === 'button'
			? html`<d2l-button-subtle
				icon="d2l-tier1:help"
				text=${this.text}
				@click="${this._handleButtonClick}"
			>`
			: html`<d2l-link href="${this.link}" target="_blank">${this.text}</d2l-link>`;
	}

	_getArticleCode(langIdent) {
		langIdent = langIdent.toLocaleLowerCase();
		let articleCode = this.articleMap[langIdent];
		let usedLangCode = articleCode !== undefined ? langIdent : undefined;
		if (articleCode === undefined) {
			// try and get a regionless match
			const regionlessLangIdent = langIdent.split('-')[0];
			Object.entries(this.articleMap).forEach(([langCode, currentArticle]) => {
				const regionlessLangCode = langCode.split('-')[0];
				if (regionlessLangIdent === regionlessLangCode) {
					articleCode = currentArticle;
					usedLangCode = langCode;
				}
			});
			// still undefined? use en
			if (articleCode === undefined) {
				articleCode = this.articleMap['en'];
				usedLangCode = 'en';
			}
		}
		return { articleCode, langCode: usedLangCode };
	}

	_handleButtonClick() {
		window.open(this.link, '_blank');
	}

	_onLangChange() {
		this.requestUpdate();
	}
}

customElements.define('d2l-labs-link-community', CommunityLink);
