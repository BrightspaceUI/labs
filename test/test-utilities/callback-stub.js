export default class CallbackStub {
	calls = [];

	constructor() {
		this.callback = this.callback.bind(this);
	}

	callback(...args) {
		this.calls.push(args);
	}
}
