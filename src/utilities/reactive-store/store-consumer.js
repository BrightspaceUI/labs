export default class StoreConsumer {
	constructor(host, store, properties = store.constructor.properties) {
		this._host = host;
		this._host.addController(this);
		this._store = store;

		this.changedProperties = new Map();

		this._onPropertyChange = this._onPropertyChange.bind(this);
		this._store.subscribe(this._onPropertyChange);

		this._defineProperties(properties);
		this._initializeChangedProperties(properties);
	}

	forceUpdate() {
		this._store.forceUpdate();
	}

	hostDisconnected() {
		this._store.unsubscribe(this._onPropertyChange);
	}

	_defineProperties(properties) {
		Object.keys(properties).forEach((property) => {
			Object.defineProperty(this, property, {
				get() {
					return this._store[property];
				},
				set(value) {
					this._store[property] = value;
				}
			});
		});
	}

	_initializeChangedProperties(properties) {
		let shouldUpdate = false;
		Object.keys(properties).forEach((property) => {
			if (this._store[property] === undefined) return;

			this.changedProperties.set(property, undefined);
			shouldUpdate = true;
		});

		if (!shouldUpdate) return;

		this._host.requestUpdate();
		this._host.updateComplete.then(() => {
			this.changedProperties.clear();
		});
	}

	_onPropertyChange({
		property,
		prevValue,
		forceUpdate = false,
	}) {
		if (!forceUpdate && !this.changedProperties.has(property)) this.changedProperties.set(property, prevValue);

		this._host.requestUpdate();
		this._host.updateComplete.then(() => {
			this.changedProperties.clear();
		});
	}
}
