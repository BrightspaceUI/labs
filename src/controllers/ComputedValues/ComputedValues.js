import ComputedValue from './ComputedValue.js';

export default class ComputedValues {
	constructor(host, valuesOptions = []) {
		valuesOptions.forEach(({ name, ...options }) => {
			this[name] = new ComputedValue(host, options);
		});
	}
}
