import ComputedValue from './computed-value.js';

export default class ComputedValues {
	constructor(host, valuesOptions = []) {
		this._valuesOptions = valuesOptions;
		valuesOptions.forEach(({ Controller = ComputedValue, name, ...options }) => {
			this[name] = new Controller(host, options);
		});
	}

	tryUpdate() {
		this._valuesOptions.forEach(({ name }) => this[name].tryUpdate());
	}
}
