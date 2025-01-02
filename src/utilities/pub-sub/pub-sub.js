/*
	A simple pub-sub implementation. It allows for subscribing to the class and publishing to all subscribers.
*/
export default class PubSub {
	constructor() {
		this._subscribers = new Map();
		this._hasTriggered = false;
		this._previousArgs = [];
	}

	clear() {
		this._subscribers.clear();
	}

	publish(...args) {
		this._subscribers.forEach(callback => callback(...args));
		this._hasTriggered = true;
		this._previousArgs = args;
	}

	// If initialize is true and publish has been called at least once, the callback will be called
	// immediately with the last published arguments.
	subscribe(callback, initialize = false) {
		this._subscribers.set(callback, callback);
		if (this._hasTriggered && initialize) {
			callback(...this._previousArgs);
		}
	}

	unsubscribe(callback) {
		this._subscribers.delete(callback);
	}
}
