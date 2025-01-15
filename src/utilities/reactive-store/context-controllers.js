import {
	createContext,
	ContextConsumer as LitContextConsumer,
	ContextProvider as LitContextProvider
} from '@lit/context';
import StoreConsumer from './store-consumer.js';

export class ContextProvider {
	constructor(host, StoreClass, store = new StoreClass()) {
		const { properties } = StoreClass;
		this._storeConsumer = new StoreConsumer(host, store, properties);
		this._provider = new LitContextProvider(host, {
			context: createContext(StoreClass),
			initialValue: store,
		});
		this._defineProperties(properties);
	}

	get changedProperties() {
		return this._storeConsumer.changedProperties;
	}

	_defineProperties(properties) {
		Object.keys(properties).forEach((property) => {
			Object.defineProperty(this, property, {
				get() {
					return this._storeConsumer[property];
				},
				set(value) {
					this._storeConsumer[property] = value;
				}
			});
		});
	}
}
export class ContextConsumer {
	constructor(host, StoreClass) {
		const { properties } = StoreClass;
		this._contextConsumer = new LitContextConsumer(host, {
			context: createContext(StoreClass),
			callback: (store) => {
				this._storeConsumer = new StoreConsumer(host, store, properties);
				this._defineProperties(properties);
			},
		});
	}

	get changedProperties() {
		return this._storeConsumer?.changedProperties;
	}

	_defineProperties(properties) {
		Object.keys(properties).forEach((property) => {
			Object.defineProperty(this, property, {
				get() {
					return this._storeConsumer[property];
				},
				set(value) {
					this._storeConsumer[property] = value;
				}
			});
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
