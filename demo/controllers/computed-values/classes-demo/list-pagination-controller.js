import ComputedValue from '../../../../src/controllers/computed-values/computed-value.js';

function compute(list, page, pageSize) {
	if (!list) { return null; }

	if (!Number.isInteger(page) || page < 1) {
		throw new TypeError('Invalid page dependency: page must be an integer greater than 0.');
	}
	if (!Number.isInteger(pageSize) || pageSize < 1) {
		throw new TypeError('Invalid pageSize dependency: pageSize must be an integer greater than 0.');
	}

	const start = (page - 1) * pageSize;
	const end = start + pageSize;

	return list.slice(start, end);
}

export default class ListPaginationController extends ComputedValue {
	constructor(host, options) {
		super(host, {
			...options,
			compute
		});
	}
}
