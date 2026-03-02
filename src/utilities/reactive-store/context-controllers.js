import {
	createContext,
	ContextConsumer as LitContextConsumer,
	ContextProvider as LitContextProvider
} from '@lit/context';
import { combinedPropertiesSymbol } from './constants.js';
import StoreReactor from './store-reactor.js';

export class ContextProvider {
	constructor(host, StoreClass, options = {}) {
		const {
			detectDependentProperties = false,
			dependentProperties = detectDependentProperties ? [] : undefined,
			store = new StoreClass(),
			...restOptions
		} = options;

		const properties = StoreClass[combinedPropertiesSymbol];
		const storeReactor = new StoreReactor(host, store, {
			dependentProperties,
			...restOptions,
		});
		new LitContextProvider(host, {
			context: createContext(StoreClass),
			initialValue: store,
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
export class ContextConsumer {
	constructor(host, StoreClass, options = {}) {
		const {
			detectDependentProperties = false,
			dependentProperties = detectDependentProperties ? [] : undefined,
			...restOptions
		} = options;

		const properties = StoreClass[combinedPropertiesSymbol];
		const target = {
			store: {},
			storeReactor: {},
		};
		new LitContextConsumer(host, {
			context: createContext(StoreClass),
			callback: (store) => {
				target.store = store;
				target.storeReactor = new StoreReactor(host, store, {
					dependentProperties,
					...restOptions,
				});
			},
		});

		return new Proxy(target, {
			get({ store, storeReactor }, prop) {
				if (prop in storeReactor) return storeReactor[prop];

				if (detectDependentProperties && prop in properties)
					storeReactor.dependentProperties.add(prop);

				return Reflect.get(store, prop);
			},
			set({ store, storeReactor }, prop, value) {
				if (prop in storeReactor) {
					storeReactor[prop] = value;
					return true;
				}

				if (detectDependentProperties && prop in properties)
					storeReactor.dependentProperties.add(prop);

				return Reflect.set(store, prop, value);
			}
		});
	}
}

export function createContextControllers(StoreClass) {
	return {
		Provider: class extends ContextProvider {
			constructor(host, options) {
				super(host, StoreClass, options);
			}
		},
		Consumer: class extends ContextConsumer {
			constructor(host, options) {
				super(host, StoreClass, options);
			}
		},
	};
}
