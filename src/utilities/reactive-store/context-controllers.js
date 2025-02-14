import {
	createContext,
	ContextConsumer as LitContextConsumer,
	ContextProvider as LitContextProvider
} from '@lit/context';
import StoreReactor from './store-reactor.js';

export class ContextProvider {
	constructor(host, StoreClass, store = new StoreClass()) {
		const { properties } = StoreClass;
		const storeReactor = new StoreReactor(host, store, properties);
		new LitContextProvider(host, {
			context: createContext(StoreClass),
			initialValue: store,
		});

		return new Proxy(store, {
			get(target, prop) {
				if (prop in storeReactor) return storeReactor[prop];
				return Reflect.get(target, prop);
			},
			set(target, prop, value) {
				if (prop in storeReactor) {
					storeReactor[prop] = value;
					return true;
				}
				return Reflect.set(target, prop, value);
			}
		});
	}
}
export class ContextConsumer {
	constructor(host, StoreClass) {
		const { properties } = StoreClass;
		const target = {
			store: {},
			storeReactor: {},
		};
		new LitContextConsumer(host, {
			context: createContext(StoreClass),
			callback: (store) => {
				target.store = store;
				target.storeReactor = new StoreReactor(host, store, properties);
			},
		});

		return new Proxy(target, {
			get({ store, storeReactor }, prop) {
				if (prop in storeReactor) return storeReactor[prop];
				return Reflect.get(store, prop);
			},
			set({ store, storeReactor }, prop, value) {
				if (prop in storeReactor) {
					storeReactor[prop] = value;
					return true;
				}
				return Reflect.set(store, prop, value);
			}
		});
	}
}

export function createContextControllers(StoreClass) {
	return {
		Provider: class extends ContextProvider {
			constructor(host, store = new StoreClass()) {
				super(host, StoreClass, store);
			}
		},
		Consumer: class extends ContextConsumer {
			constructor(host) {
				super(host, StoreClass);
			}
		},
	};
}
