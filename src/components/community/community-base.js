import { communityUrlFactory } from './community-url-factory.js';
import { LanguageListenerController } from '../../controllers/language-listener/language-listener.js';

export const CommunityBase = (superClass) => class CommunityBaseMixin extends superClass {

	static get properties() {
		return {
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

	update() {
		super.update();
		this.communityArticleDirective = communityUrlFactory(this.articleMap);
	}
};
