import ReactiveStore from '../../../src/utilities/reactive-store/reactive-store.js';

export default class MyStore extends ReactiveStore {
	static get properties() {
		return {
			foo: { type: Number },
			bar: { type: Number },
		};
	}

	constructor() {
		super();

		this.foo = 0;
		this.bar = 0;
	}
}
