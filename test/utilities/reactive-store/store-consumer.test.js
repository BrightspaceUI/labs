import ControllerHostStub from '../../test-utilities/controller-host-stub.js';
import { expect } from '@brightspace-ui/testing';
import ReactiveStore from '../../../src/utilities/reactive-store/reactive-store.js';
import StoreConsumer from '../../../src/utilities/reactive-store/store-consumer.js';

class TestStore extends ReactiveStore {
	static properties = {
		prop1: {},
		prop2: {}
	};

	constructor() {
		super();
		this.prop1 = 'default';
		this.prop2 = 'default';
	}
}

describe('ReactiveStore StoreConsumer', () => {
	let store;
	let host;

	beforeEach(() => {
		store = new TestStore();
		host = new ControllerHostStub();
	});

	describe('reactive properties', () => {
		it('should reflect the store properties', () => {
			store.prop1 = 'value1';

			const storeConsumer1 = new StoreConsumer(host, store);
			const storeConsumer2 = new StoreConsumer(host, store);

			expect(storeConsumer1.prop1).to.equal('value1');
			expect(storeConsumer1.prop2).to.equal('default');
			expect(storeConsumer2.prop1).to.equal('value1');
			expect(storeConsumer2.prop2).to.equal('default');

			store.prop2 = 'value2';
			expect(storeConsumer1.prop1).to.equal('value1');
			expect(storeConsumer1.prop2).to.equal('value2');
			expect(storeConsumer2.prop1).to.equal('value1');
			expect(storeConsumer2.prop2).to.equal('value2');
		});

		it('should update the store properties', () => {
			const storeConsumer = new StoreConsumer(host, store);

			storeConsumer.prop1 = 'value1';
			storeConsumer.prop2 = 'value2';

			expect(store.prop1).to.equal('value1');
			expect(store.prop2).to.equal('value2');
		});

		it('should update all consumers when a property changes', () => {
			const storeConsumer1 = new StoreConsumer(host, store);
			const host2 = new ControllerHostStub();
			const storeConsumer2 = new StoreConsumer(host2, store);

			storeConsumer1.prop1 = 'value1';

			expect(storeConsumer1.prop1).to.equal('value1');
			expect(storeConsumer2.prop1).to.equal('value1');
		});

		it('should call requestUpdate on all hosts when a property changes', () => {
			const storeConsumer1 = new StoreConsumer(host, store);
			const host2 = new ControllerHostStub();
			new StoreConsumer(host2, store);

			const requestUpdateCallCount1 = host.requestUpdateCallCount;
			const requestUpdateCallCount2 = host2.requestUpdateCallCount;
			storeConsumer1.prop1 = 'value1';

			expect(host.requestUpdateCallCount).to.equal(requestUpdateCallCount1 + 1);
			expect(host2.requestUpdateCallCount).to.equal(requestUpdateCallCount2 + 1);
		});

		it('should not update consumers when a property does not change', () => {
			const storeConsumer1 = new StoreConsumer(host, store);
			const host2 = new ControllerHostStub();
			new StoreConsumer(host2, store);

			storeConsumer1.prop1 = 'value1';

			const requestUpdateCallCount = host.requestUpdateCallCount;
			storeConsumer1.prop1 = 'value1';

			expect(host.requestUpdateCallCount).to.equal(requestUpdateCallCount);
			expect(host2.requestUpdateCallCount).to.equal(requestUpdateCallCount);
		});

		it('should not call requestUpdate on any host when a property does not change', () => {
			const storeConsumer1 = new StoreConsumer(host, store);
			const host2 = new ControllerHostStub();
			new StoreConsumer(host2, store);

			storeConsumer1.prop1 = 'value1';

			const requestUpdateCallCount1 = host.requestUpdateCallCount;
			const requestUpdateCallCount2 = host2.requestUpdateCallCount;
			storeConsumer1.prop1 = 'value1';

			expect(host.requestUpdateCallCount).to.equal(requestUpdateCallCount1);
			expect(host2.requestUpdateCallCount).to.equal(requestUpdateCallCount2);
		});
	});

	describe('changedProperties', () => {
		it('should contain undefined for all initialized properties during the initial update cycle', () => {
			const storeConsumer = new StoreConsumer(host, store);

			expect(storeConsumer.changedProperties.size).to.equal(2);
			expect(storeConsumer.changedProperties.get('prop1')).to.equal(undefined);
			expect(storeConsumer.changedProperties.get('prop2')).to.equal(undefined);
		});

		it('should contain the previous values for properties that changed since last complete update', async() => {
			const storeConsumer = new StoreConsumer(host, store);

			// simulate the initial update cycle completing
			host.update();
			await host.updateComplete;

			storeConsumer.prop1 = 'value1';

			expect(storeConsumer.changedProperties.size).to.equal(1);
			expect(storeConsumer.changedProperties.get('prop1')).to.equal('default');

			host.update();
			await host.updateComplete;

			storeConsumer.prop1 = 'value2';
			storeConsumer.prop2 = 'value3';

			expect(storeConsumer.changedProperties.size).to.equal(2);
			expect(storeConsumer.changedProperties.get('prop1')).to.equal('value1');
			expect(storeConsumer.changedProperties.get('prop2')).to.equal('default');
		});

		it('should contain the earliest value for a property that changed multiple times since last complete update', async() => {
			const storeConsumer = new StoreConsumer(host, store);

			// simulate the initial update cycle completing
			host.update();
			await host.updateComplete;

			storeConsumer.prop1 = 'value1';
			storeConsumer.prop1 = 'value2';

			expect(storeConsumer.changedProperties.size).to.equal(1);
			expect(storeConsumer.changedProperties.get('prop1')).to.equal('default');
		});

		it('should clear the changed properties after each complete update cycle', async() => {
			const storeConsumer = new StoreConsumer(host, store);

			// simulate the initial update cycle completing
			host.update();
			await host.updateComplete;
			expect(storeConsumer.changedProperties.size).to.equal(0);

			storeConsumer.prop1 = 'value1';

			host.update();
			await host.updateComplete;
			expect(storeConsumer.changedProperties.size).to.equal(0);
		});

		it('should not have any changed properties if doing a forceUpdate', async() => {
			const storeConsumer = new StoreConsumer(host, store);

			// simulate the initial update cycle completing
			host.update();
			await host.updateComplete;

			store.forceUpdate();

			expect(storeConsumer.changedProperties.size).to.equal(0);
		});

		it('should not clear the changed properties if forceUpdate is called while already performing an update', async() => {
			const storeConsumer = new StoreConsumer(host, store);

			// simulate the initial update cycle completing
			host.update();
			await host.updateComplete;

			storeConsumer.prop1 = 'value1';
			store.forceUpdate();

			expect(storeConsumer.changedProperties.size).to.equal(1);
			expect(storeConsumer.changedProperties.get('prop1')).to.equal('default');
		});
	});

	describe('forceUpdate', () => {
		it('should call forceUpdate on the store', () => {
			let forceUpdateCallCount = 0;
			const forceUpdateStub = () => forceUpdateCallCount++;
			store.forceUpdate = forceUpdateStub;

			const storeConsumer = new StoreConsumer(host, store);
			storeConsumer.forceUpdate();

			expect(forceUpdateCallCount).to.equal(1);
		});
	});
});
