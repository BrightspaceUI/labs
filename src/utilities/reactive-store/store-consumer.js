import StoreReactor from './store-reactor.js';

export default class StoreConsumer {
	constructor(host, store, properties = store.constructor.properties) {
		const storeReactor = new StoreReactor(host, store, properties);

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
