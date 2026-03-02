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

		this.nonReactiveProp = 'default';
	}

	testMethod() {
		return 'test';
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
			expect(storeConsumer.changedProperties.has('prop1')).to.be.true;
			expect(storeConsumer.changedProperties.has('prop2')).to.be.true;
			expect(storeConsumer.changedProperties.get('prop1')).to.equal(undefined);
			expect(storeConsumer.changedProperties.get('prop2')).to.equal(undefined);
		});

		it('should contain undefined for initialized parent properties during the initial update cycle', () => {
			class ParentStore extends ReactiveStore {
				static properties = {
					prop1: {}
				};

				constructor() {
					super();
					this.prop1 = 'default';
				}
			}

			class ChildStore extends ParentStore {
				static properties = {
					prop2: {}
				};

				constructor() {
					super();
					this.prop2 = 'default';
				}
			}

			const store = new ChildStore();
			const storeConsumer = new StoreConsumer(host, store);

			expect(storeConsumer.changedProperties.size).to.equal(2);
			expect(storeConsumer.changedProperties.has('prop1')).to.be.true;
			expect(storeConsumer.changedProperties.has('prop2')).to.be.true;
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

		it('should call requestUpdate on the host', () => {
			const storeConsumer = new StoreConsumer(host, store);
			const requestUpdateCallCount = host.requestUpdateCallCount;
			storeConsumer.forceUpdate();

			expect(host.requestUpdateCallCount).to.equal(requestUpdateCallCount + 1);
		});
	});

	describe('non-reactive properties and methods', () => {
		it('should reflect the store non-reactive properties and methods', () => {
			const storeConsumer = new StoreConsumer(host, store);

			expect(storeConsumer.nonReactiveProp).to.equal('default');
			expect(storeConsumer.testMethod()).to.equal('test');

			store.nonReactiveProp = 'value';
			expect(storeConsumer.nonReactiveProp).to.equal('value');
		});

		it('non-reactive properties should not call requestUpdate', () => {
			const storeConsumer = new StoreConsumer(host, store);

			const requestUpdateCallCount = host.requestUpdateCallCount;

			storeConsumer.nonReactiveProp = 'value';

			expect(host.requestUpdateCallCount).to.equal(requestUpdateCallCount);
		});

		it('non-reactive properties should not be in changedProperties', async() => {
			const storeConsumer = new StoreConsumer(host, store);

			storeConsumer.nonReactiveProp = 'value';

			expect(storeConsumer.changedProperties.has('nonReactiveProp')).to.be.false;
		});
	});

	describe('dependentProperties', () => {
		it('should include all reactive properties by default', () => {
			const storeConsumer = new StoreConsumer(host, store);
			expect(storeConsumer.dependentProperties.size).to.equal(2);
			expect(storeConsumer.dependentProperties.has('prop1')).to.be.true;
			expect(storeConsumer.dependentProperties.has('prop2')).to.be.true;
		});

		it('should be possible to set dependentProperties through initialization options', () => {
			const storeConsumer = new StoreConsumer(host, store, {
				dependentProperties: ['prop1']
			});
			expect(storeConsumer.dependentProperties.size).to.equal(1);
			expect(storeConsumer.dependentProperties.has('prop1')).to.be.true;
		});

		it('should call requestUpdate when updating dependentProperties', () => {
			const storeConsumer = new StoreConsumer(host, store, {
				dependentProperties: ['prop1']
			});
			storeConsumer.dependentProperties.add('prop2');

			const requestUpdateCallCount = host.requestUpdateCallCount;
			store.prop1 = 'value1';
			storeConsumer.prop1 = 'value2';
			store.prop2 = 'value3';
			storeConsumer.prop2 = 'value4';

			expect(host.requestUpdateCallCount).to.equal(requestUpdateCallCount + 4);
		});

		it('should not call requestUpdate when updating non-dependentProperties', () => {
			new StoreConsumer(host, store, {
				dependentProperties: ['prop1']
			});

			const requestUpdateCallCount = host.requestUpdateCallCount;
			store.prop2 = 'value2';

			expect(host.requestUpdateCallCount).to.equal(requestUpdateCallCount);
		});

		it('should ignore non-reactive properties', () => {
			const storeConsumer = new StoreConsumer(host, store, {
				dependentProperties: ['nonReactiveProp1']
			});
			storeConsumer.dependentProperties.add('nonReactiveProp2');

			const requestUpdateCallCount = host.requestUpdateCallCount;
			storeConsumer.nonReactiveProp1 = 'value';
			storeConsumer.nonReactiveProp2 = 'value';

			expect(host.requestUpdateCallCount).to.equal(requestUpdateCallCount);
		});

		describe('detectDependentProperties', () => {
			describe('when true', () => {
				it('should initialize dependentProperties to an empty Set', () => {
					const storeConsumer = new StoreConsumer(host, store, {
						detectDependentProperties: true
					});

					expect(storeConsumer.dependentProperties.size).to.equal(0);
				});

				it('should add a property to dependentProperties when accessed or set', () => {
					const storeConsumer = new StoreConsumer(host, store, {
						detectDependentProperties: true
					});

					storeConsumer.prop1;
					storeConsumer.prop2 = 'value';
					expect(storeConsumer.dependentProperties.size).to.equal(2);

					expect(storeConsumer.dependentProperties.has('prop1')).to.be.true;
					expect(storeConsumer.dependentProperties.has('prop2')).to.be.true;
				});

				it('should not add a property to dependentProperties when accessed or set through the store directly', () => {
					const storeConsumer = new StoreConsumer(host, store, {
						detectDependentProperties: true
					});

					store.prop1;
					store.prop2 = 'value';
					expect(storeConsumer.dependentProperties.size).to.equal(0);

					expect(storeConsumer.dependentProperties.has('prop1')).to.be.false;
					expect(storeConsumer.dependentProperties.has('prop2')).to.be.false;
				});

				it('should not add non-reactive properties to dependentProperties', () => {
					const storeConsumer = new StoreConsumer(host, store, {
						detectDependentProperties: true
					});

					storeConsumer.nonReactiveProp;
					storeConsumer.nonReactiveProp = 'value';
					expect(storeConsumer.dependentProperties.size).to.equal(0);

					expect(storeConsumer.dependentProperties.has('nonReactiveProp')).to.be.false;
				});
			});

			describe('when false', () => {
				it('should initialize dependentProperties to include all reactive properties', () => {
					const storeConsumer = new StoreConsumer(host, store, {
						detectDependentProperties: false
					});
					expect(storeConsumer.dependentProperties.size).to.equal(2);
					expect(storeConsumer.dependentProperties.has('prop1')).to.be.true;
					expect(storeConsumer.dependentProperties.has('prop2')).to.be.true;
				});

				it('should not add dependentProperties when accessed or set', () => {
					const storeConsumer = new StoreConsumer(host, store, {
						detectDependentProperties: false,
						dependentProperties: [],
					});

					storeConsumer.prop1;
					storeConsumer.prop2 = 'value';
					storeConsumer.nonReactiveProp = 'value';
					expect(storeConsumer.dependentProperties.size).to.equal(0);

					expect(storeConsumer.dependentProperties.has('prop1')).to.be.false;
					expect(storeConsumer.dependentProperties.has('prop2')).to.be.false;
					expect(storeConsumer.dependentProperties.has('nonReactiveProp')).to.be.false;
				});
			});
		});
	});
});
