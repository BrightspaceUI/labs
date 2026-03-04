import { combinedPropertiesSymbol } from './constants.js';

export default class StoreReactor {
	changedProperties;

	constructor(host, store, options = {}) {
		this.#host = host;
		this.#host.addController(this);
		this.#store = store;

		const properties = store.constructor[combinedPropertiesSymbol];

		const {
			dependentProperties = Object.keys(properties),
		} = options;

		this.dependentProperties = new Set(dependentProperties);
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
		if (forceUpdate) return this.#requestUpdate();

		// If the property has changed multiple times within the same update cycle, we want to
		// preserve the value from before the first change.
		if (!this.changedProperties.has(property)) this.changedProperties.set(property, prevValue);

		if (this.dependentProperties.has(property)) this.#requestUpdate();
	};

	#initializeChangedProperties(properties) {
		let shouldUpdate = false;
		Object.keys(properties).forEach((property) => {
			if (this.#store[property] === undefined) return;

			this.changedProperties.set(property, undefined);

			if (this.dependentProperties.has(property)) {
				shouldUpdate = true;
			}
		});

		if (shouldUpdate) this.#requestUpdate();
	}

	#requestUpdate() {
		this.#host.requestUpdate();
		this.#host.updateComplete.then(() => {
			this.changedProperties.clear();
		});
	}
}
