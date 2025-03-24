import { LocalizeDynamicMixin } from '@brightspace-ui/core/mixins/localize-dynamic-mixin.js';

const InternalDynamicLocalizeMixinClass = superClass => class extends LocalizeDynamicMixin(superClass) {
	static get localizeConfig() {
		return {
			importFunc: async lang => {
				return (await import(`../../../../lang/${lang}.js`)).default;
			}
		};
	}
};

export const InternalDynamicLocalizeMixin = InternalDynamicLocalizeMixinClass;
