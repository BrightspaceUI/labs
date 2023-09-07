import '@brightspace-ui/core/components/link/link.js';

import { getDocumentLocaleSettings } from '@brightspace-ui/intl/lib/common.js';

const Link = customElements.get('d2l-link');

class CommunityLink extends Link {

	static get properties() {
		return {
			...Link.properties,
			articleMap: { attribute: 'article-map', type: Object }
		};
	}

	get link() {
		const { language } = getDocumentLocaleSettings();
		const { articleCode, langCode } = this._getArticleCode(language);

		return `https://community.d2l.com/brightspace${langCode === 'en' ? '' : `-${langCode}`}/kb/articles/${articleCode}`;
	}

	render() {
		this.href = this.link;
		return super.render();
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
}

customElements.define('d2l-community-link', CommunityLink);
