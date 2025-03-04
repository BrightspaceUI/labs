import { createContextControllers } from './context-controllers.js';
import PubSub from '../pub-sub/pub-sub.js';
import StoreConsumer from './store-consumer.js';

const defaultHasChanged = (oldValue, newValue) => oldValue !== newValue;

export default class ReactiveStore {
	static createContextControllers() {
		return createContextControllers(this);
	}

	constructor() {
		this._pubSub = new PubSub();
		this._state = {};

		this.#defineProperties(this.constructor.prototype);
	}

	createConsumer() {
		const store = this;
		return class extends StoreConsumer {
			constructor(host) {
				super(host, store);
			}
		};
	}

	forceUpdate() {
		this._pubSub.publish({ forceUpdate: true });
	}

	subscribe(callback) {
		this._pubSub.subscribe(callback);
	}

	unsubscribe(callback) {
		this._pubSub.unsubscribe(callback);
	}

	#defineProperties(proto) {
		if (!(proto instanceof ReactiveStore)) return;
		this.#defineProperties(Object.getPrototypeOf(proto));

		const { properties } = proto.constructor;
		if (!properties) return;

		Object.keys(properties).forEach((property) => {
			Object.defineProperty(this, property, {
				get() {
					return this._state[property];
				},
				set(value) {
					const { hasChanged = defaultHasChanged } = properties[property];
					if (!hasChanged(this._state[property], value)) return;

					const prevValue = this._state[property];
					this._state[property] = value;

					this._pubSub.publish({ property, value, prevValue, forceUpdate: false });
				}
			});
		});
	}
}
