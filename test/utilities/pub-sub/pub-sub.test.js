import { expect } from '@brightspace-ui/testing';
import PubSub from '../../../src/utilities/pub-sub/pub-sub.js';

class CallbackStub {
	calls = [];

	constructor() {
		this.callback = this.callback.bind(this);
	}

	callback(...args) {
		this.calls.push(args);
	}
}

describe('PubSub', () => {
	let pubSub;
	beforeEach(() => {
		pubSub = new PubSub();
	});
	afterEach(() => {
		pubSub.clear();
	});

	describe('clear()', () => {
		it('should remove all subscribers', () => {
			const callbackStub1 = new CallbackStub();
			const callbackStub2 = new CallbackStub();

			pubSub.subscribe(callbackStub1.callback);
			pubSub.subscribe(callbackStub2.callback);

			pubSub.clear();
			pubSub.publish();

			expect(callbackStub1.calls.length).to.equal(0);
			expect(callbackStub2.calls.length).to.equal(0);
		});
	});

	describe('publish()', () => {
		it('should call all subscribers with the provided arguments', () => {
			const callbackStub1 = new CallbackStub();
			const callbackStub2 = new CallbackStub();

			pubSub.subscribe(callbackStub1.callback);
			pubSub.subscribe(callbackStub2.callback);

			pubSub.publish('arg1', 'arg2');

			expect(callbackStub1.calls.length).to.equal(1);
			expect(callbackStub1.calls[0]).to.deep.equal(['arg1', 'arg2']);
			expect(callbackStub2.calls.length).to.equal(1);
			expect(callbackStub2.calls[0]).to.deep.equal(['arg1', 'arg2']);
		});

		it('should remember the last arguments published', () => {
			pubSub.publish('arg1', 'arg2');
			pubSub.publish('arg3', 'arg4');

			const callbackStub = new CallbackStub();
			pubSub.subscribe(callbackStub.callback, true);

			expect(callbackStub.calls.length).to.equal(1);
			expect(callbackStub.calls[0]).to.deep.equal(['arg3', 'arg4']);
		});
	});

	describe('subscribe()', () => {
		it('should call the callback immediately with the last published arguments if initialize is true', () => {
			pubSub.publish('arg1', 'arg2');

			const callbackStub = new CallbackStub();
			pubSub.subscribe(callbackStub.callback, true);

			expect(callbackStub.calls.length).to.equal(1);
			expect(callbackStub.calls[0]).to.deep.equal(['arg1', 'arg2']);
		});

		it('should not call the callback immediately with the last published arguments if initialize is false', () => {
			pubSub.publish('arg1', 'arg2');

			const callbackStub = new CallbackStub();
			pubSub.subscribe(callbackStub.callback, false);

			expect(callbackStub.calls.length).to.equal(0);
		});

		it('should do nothing if the callback is already subscribed', () => {
			const callbackStub = new CallbackStub();

			pubSub.subscribe(callbackStub.callback);
			pubSub.subscribe(callbackStub.callback);

			pubSub.publish();

			expect(callbackStub.calls.length).to.equal(1);
		});
	});

	describe('unsubscribe()', () => {
		it('should remove the subscriber', () => {
			const callbackStub1 = new CallbackStub();
			const callbackStub2 = new CallbackStub();
			const callbackStub3 = new CallbackStub();

			pubSub.subscribe(callbackStub1.callback);
			pubSub.unsubscribe(callbackStub1.callback);

			pubSub.subscribe(callbackStub2.callback);
			pubSub.subscribe(callbackStub3.callback);
			pubSub.publish();

			pubSub.unsubscribe(callbackStub2.callback);
			pubSub.publish();

			expect(callbackStub1.calls.length).to.equal(0);
			expect(callbackStub2.calls.length).to.equal(1);
			expect(callbackStub3.calls.length).to.equal(2);
		});

		it('should do nothing if the subscriber is not found', () => {
			const callbackStub1 = new CallbackStub();
			const callbackStub2 = new CallbackStub();

			pubSub.subscribe(callbackStub1.callback);
			pubSub.unsubscribe(callbackStub2);

			pubSub.publish();

			expect(callbackStub1.calls.length).to.equal(1);
			expect(callbackStub2.calls.length).to.equal(0);
		});
	});
});
