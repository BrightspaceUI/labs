import { combinedPropertiesSymbol } from './constants.js';
import StoreReactor from './store-reactor.js';

export default class StoreConsumer {
	constructor(host, store, options = {}) {
		const {
			detectDependentProperties = false,
			dependentProperties = detectDependentProperties ? [] : undefined,
			...restOptions
		} = options;

		const properties = store.constructor[combinedPropertiesSymbol];
		const storeReactor = new StoreReactor(host, store, {
			dependentProperties,
			...restOptions,
		});

		return new Proxy(store, {
			get(target, prop) {
				if (prop in storeReactor) return storeReactor[prop];

				if (detectDependentProperties && prop in properties)
					storeReactor.dependentProperties.add(prop);

				return Reflect.get(target, prop);
			},
			set(target, prop, value) {
				if (prop in storeReactor) {
					storeReactor[prop] = value;
					return true;
				}

				if (detectDependentProperties && prop in properties)
					storeReactor.dependentProperties.add(prop);

				return Reflect.set(target, prop, value);
			}
		});
	}
}
