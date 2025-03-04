import { ContextConsumer, ContextProvider } from '../../../src/utilities/reactive-store/context-controllers.js';
import CallbackStub from '../../test-utilities/callback-stub.js';
import { expect } from '@brightspace-ui/testing';
import ReactiveStore from '../../../src/utilities/reactive-store/reactive-store.js';
import StoreConsumer from '../../../src/utilities/reactive-store/store-consumer.js';

describe('ReactiveStore', () => {
	describe('createContextControllers()', () => {
		it('should return an object with a ContextProvider and ContextConsumer', () => {
			class TestStore extends ReactiveStore {
				static properties = {
					prop1: {}
				};
			}

			const { Provider, Consumer } = TestStore.createContextControllers();

			expect(Provider.prototype instanceof ContextProvider).to.be.true;
			expect(Consumer.prototype instanceof ContextConsumer).to.be.true;
		});
	});

	describe('constructor()', () => {
		it('should allow setting default property values', () => {
			class TestStore extends ReactiveStore {
				static properties = {
					prop1: {}
				};

				constructor() {
					super();
					this.prop1 = 'default';
				}
			}

			const store = new TestStore();

			expect(store.prop1).to.equal('default');
		});
	});

	describe('reactive Properties', () => {
		it('should update the property value when set', () => {
			class TestStore extends ReactiveStore {
				static properties = {
					prop1: {}
				};
			}

			const store = new TestStore();

			store.prop1 = 'value1';
			expect(store.prop1).to.equal('value1');
		});

		it('should call subscribers when the property value is changed', () => {
			class TestStore extends ReactiveStore {
				static properties = {
					prop1: {},
					prop2: {}
				};
			}

			const store = new TestStore();
			const callbackStub1 = new CallbackStub();
			store.subscribe(callbackStub1.callback);
			const callbackStub2 = new CallbackStub();
			store.subscribe(callbackStub2.callback);

			store.prop1 = 'value1';
			expect(callbackStub1.calls.length).to.equal(1);
			expect(callbackStub1.calls[0][0]).to.deep.equal({
				property: 'prop1',
				value: 'value1',
				prevValue: undefined,
				forceUpdate: false
			});
			expect(callbackStub2.calls.length).to.equal(1);
			expect(callbackStub2.calls[0][0]).to.deep.equal({
				property: 'prop1',
				value: 'value1',
				prevValue: undefined,
				forceUpdate: false
			});

			store.prop1 = 'value2';
			expect(callbackStub1.calls.length).to.equal(2);
			expect(callbackStub1.calls[1][0]).to.deep.equal({
				property: 'prop1',
				value: 'value2',
				prevValue: 'value1',
				forceUpdate: false
			});
			expect(callbackStub2.calls.length).to.equal(2);
			expect(callbackStub2.calls[1][0]).to.deep.equal({
				property: 'prop1',
				value: 'value2',
				prevValue: 'value1',
				forceUpdate: false
			});

			store.prop2 = 'value3';
			expect(callbackStub1.calls.length).to.equal(3);
			expect(callbackStub1.calls[2][0]).to.deep.equal({
				property: 'prop2',
				value: 'value3',
				prevValue: undefined,
				forceUpdate: false
			});
			expect(callbackStub2.calls.length).to.equal(3);
			expect(callbackStub2.calls[2][0]).to.deep.equal({
				property: 'prop2',
				value: 'value3',
				prevValue: undefined,
				forceUpdate: false
			});
		});

		it('should not call subscribers when the value has not changed', () => {
			class TestStore extends ReactiveStore {
				static properties = {
					prop1: {}
				};
			}

			const store = new TestStore();
			const callbackStub1 = new CallbackStub();
			store.subscribe(callbackStub1.callback);
			const callbackStub2 = new CallbackStub();
			store.subscribe(callbackStub2.callback);

			store.prop1 = 'value1';
			store.prop1 = 'value1';

			expect(callbackStub1.calls.length).to.equal(1);
			expect(callbackStub2.calls.length).to.equal(1);
		});

		it('should inherit properties from parent classes', () => {
			class ParentStore extends ReactiveStore {
				static properties = {
					prop1: {}
				};
			}

			class ChildStore extends ParentStore {
				static properties = {
					prop2: {}
				};
			}

			const store = new ChildStore();
			const callbackStub = new CallbackStub();
			store.subscribe(callbackStub.callback);

			store.prop1 = 'value1';
			expect(callbackStub.calls.length).to.equal(1);
			expect(callbackStub.calls[0][0]).to.deep.equal({
				property: 'prop1',
				value: 'value1',
				prevValue: undefined,
				forceUpdate: false
			});

			store.prop2 = 'value2';
			expect(callbackStub.calls.length).to.equal(2);
			expect(callbackStub.calls[1][0]).to.deep.equal({
				property: 'prop2',
				value: 'value2',
				prevValue: undefined,
				forceUpdate: false
			});
		});
	});

	describe('createConsumer()', () => {
		it('should return a class that extends StoreConsumer', () => {
			class TestStore extends ReactiveStore {
				static properties = {
					prop1: {}
				};
			}

			const store = new TestStore();
			const Consumer = store.createConsumer();

			expect(Consumer.prototype instanceof StoreConsumer).to.be.true;
		});
	});

	describe('forceUpdate()', () => {
		it('should call all subscribers with forceUpdate set to true', () => {
			class TestStore extends ReactiveStore {
				static properties = {
					prop1: {}
				};
			}

			const store = new TestStore();
			const callbackStub1 = new CallbackStub();
			store.subscribe(callbackStub1.callback);
			const callbackStub2 = new CallbackStub();
			store.subscribe(callbackStub2.callback);

			store.forceUpdate();

			expect(callbackStub1.calls.length).to.equal(1);
			expect(callbackStub1.calls[0][0]).to.deep.equal({
				forceUpdate: true
			});
			expect(callbackStub2.calls.length).to.equal(1);
			expect(callbackStub2.calls[0][0]).to.deep.equal({
				forceUpdate: true
			});
		});
	});

	describe('subscribe()', () => {
		it('should not call the callback immediately', () => {
			class TestStore extends ReactiveStore {
				static properties = {
					prop1: {}
				};
			}

			const store = new TestStore();
			store.prop1 = 'value1';

			const callbackStub = new CallbackStub();
			store.subscribe(callbackStub.callback);

			expect(callbackStub.calls.length).to.equal(0);
		});
	});

	describe('unsubscribe()', () => {
		it('should remove the subscriber', () => {
			class TestStore extends ReactiveStore {
				static properties = {
					prop1: {}
				};
			}

			const store = new TestStore();
			const callbackStub1 = new CallbackStub();
			store.subscribe(callbackStub1.callback);
			const callbackStub2 = new CallbackStub();
			store.subscribe(callbackStub2.callback);

			store.prop1 = 'value1';
			store.unsubscribe(callbackStub1.callback);

			store.prop1 = 'value2';
			expect(callbackStub1.calls.length).to.equal(1);
			expect(callbackStub2.calls.length).to.equal(2);
		});

		it('should do nothing if the subscriber is not found', () => {
			class TestStore extends ReactiveStore {
				static properties = {
					prop1: {}
				};
			}

			const store = new TestStore();
			const callbackStub1 = new CallbackStub();
			store.subscribe(callbackStub1.callback);

			store.prop1 = 'value1';
			store.unsubscribe(() => {});

			store.prop1 = 'value2';

			expect(callbackStub1.calls.length).to.equal(2);
		});
	});
});
