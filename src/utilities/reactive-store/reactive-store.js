import PubSub from '../pub-sub/pub-sub.js';
import StoreConsumer from './store-consumer.js';
import { createContextControllers } from './context-controllers.js';

const defaultHasChanged = (oldValue, newValue) => oldValue !== newValue;

export default class ReactiveStore {
	static createContextControllers() {
		return createContextControllers(this);
	}

	constructor() {
		this._pubSub = new PubSub();
		this._state = {};
		this._defineProperties(this.constructor.properties);
	}

	createConsumer() {
		const store = this;
		return class extends StoreConsumer {
			constructor(host) {
				super(host, store);
			}
		}
	}

	forceUpdate() {
		this._pubSub.publish({ forceUpdate: true });
	}

	subscribe(callback, initialize = false) {
		this._pubSub.subscribe(callback, initialize);
	}

	unsubscribe(callback) {
		this._pubSub.unsubscribe(callback);
	}

	_defineProperties(properties) {
		Object.keys(properties).forEach((property) => {
			Object.defineProperty(this, property, {
				get() {
					return this._state[property];
				},
				set(value) {
					const { hasChanged = defaultHasChanged } = properties[property];
					if (!hasChanged(this._state[property], value)) return;

					const prevValue = this._state;
					this._state[property] = value;

					this._pubSub.publish({ property, value, prevValue });
				}
			});
		});
	}
}
