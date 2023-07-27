import { LocalizeDynamicMixin } from '@brightspace-ui/core/mixins/localize-dynamic-mixin.js';

export const LocalizeLabsElement = superclass => class extends LocalizeDynamicMixin(superclass) {

	static get localizeConfig() {
		return {
			importFunc: async lang => (await import(`../src/lang/${lang}.js`)).default
		};
	}

};
