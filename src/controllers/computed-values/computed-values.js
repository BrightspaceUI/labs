import ComputedValue from './computed-value.js';

export default class ComputedValues {
	constructor(host, valuesOptions = []) {
		valuesOptions.forEach(({ Controller = ComputedValue, name, ...options }) => {
			this[name] = new Controller(host, options);
		});
	}
}
