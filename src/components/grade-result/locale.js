import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize/localize-mixin.js';

export const Localizer = superclass => class extends LocalizeMixin(superclass) {

	static get localizeConfig() {
		return {
			importFunc: async lang => (await import(`../../lang/${lang}.js`)).default,
		};
	}
};
