import { DataLayerItem } from './data-layer-item.js';

export class DataLayerGroup {
	constructor() {
		this._items = new Map();

		this._initProperties(Object.getPrototypeOf(this), 'data', (key, value) => {
			this._items.set(key, new DataLayerItem(value, { callingContext: this }));
			Object.defineProperty(this, key, {
				configurable: true,
				get: () => this._items.get(key).value,
				set: value => { this._items.get(key).value = value; },
			});
		});

		this._initProperties(Object.getPrototypeOf(this), 'actions', (key, value) => {
			this[key] = value.bind(this);
		});
	}

	getItem(key) {
		return this._items.get(key);
	}

	_initProperties(base, field, initializer) {
		const properties = base.constructor[field];
		if (!properties) return;

		this._initProperties(Object.getPrototypeOf(base));

		Object.keys(properties).forEach(key => {
			if (key in this) throw new Error(`Cannot define duplicate property ${key} in ${base.constructor.name || 'anonymous class'}`);
			initializer(key, properties[key]);
		});
	}
}
