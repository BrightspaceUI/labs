import ReactiveStore from '../../../src/utilities/reactive-store/reactive-store.js';

export default class MyStore extends ReactiveStore {
	static get properties() {
		return {
			count: { type: Number },
		};
	}

	constructor() {
		super();

		this.count = 0;
	}

	decrement() {
		this.count--;
	}

	increment() {
		this.count++;
	}
}
