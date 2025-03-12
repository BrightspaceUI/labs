import { combinedPropertiesSymbol } from './constants.js';

export default class StoreReactor {
	changedProperties;

	constructor(host, store, properties = store.constructor[combinedPropertiesSymbol]) {
		this.#host = host;
		this.#host.addController(this);
		this.#store = store;

		this.changedProperties = new Map();

		this.#store.subscribe(this.#onPropertyChange);

		this.#initializeChangedProperties(properties);
	}

	hostDisconnected() {
		this.#store.unsubscribe(this.#onPropertyChange);
	}

	#host;
	#store;

	#onPropertyChange = ({
		property,
		prevValue,
		forceUpdate = false,
	}) => {
		if (!forceUpdate && !this.changedProperties.has(property)) this.changedProperties.set(property, prevValue);

		this.#host.requestUpdate();
		this.#host.updateComplete.then(() => {
			this.changedProperties.clear();
		});
	};

	#initializeChangedProperties(properties) {
		let shouldUpdate = false;
		Object.keys(properties).forEach((property) => {
			if (this.#store[property] === undefined) return;

			this.changedProperties.set(property, undefined);
			shouldUpdate = true;
		});

		if (!shouldUpdate) return;

		this.#host.requestUpdate();
		this.#host.updateComplete.then(() => {
			this.changedProperties.clear();
		});
	}
}
