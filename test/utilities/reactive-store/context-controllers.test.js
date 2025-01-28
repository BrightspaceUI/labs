import '../../../src/components/view-toggle/view-toggle.js';
import { expect, fixture, html } from '@brightspace-ui/testing';
import { LitElement } from 'lit';
import ReactiveStore from '../../../src/utilities/reactive-store/reactive-store.js';

// Create 2 separate stores for testing
class TestStore1 extends ReactiveStore {
	static properties = {
		prop1: {},
		prop2: {},
		objectProp: {}
	};

	constructor() {
		super();
		this.prop1 = 'default';
		this.prop2 = 'default';
		this.objectProp = {
			nestedProp: 'default'
		};
	}
}
const { Provider: Provider1, Consumer: Consumer1 } = TestStore1.createContextControllers();

class TestStore2 extends ReactiveStore {
	static properties = {
		foo: {},
		bar: {}
	};

	constructor() {
		super();
		this.foo = 'default';
		this.bar = 'default';
	}
}
const { Provider: Provider2, Consumer: Consumer2 } = TestStore2.createContextControllers();

// Create a component that hosts both stores
class HostingComponent extends LitElement {

	constructor() {
		super();
		this.storeProvider1 = new Provider1(this);
		this.storeProvider2 = new Provider2(this);
	}

	get consumingComponent() {
		return this.shadowRoot.querySelector('consuming-component');
	}

	get middleComponent() {
		return this.shadowRoot.querySelector('middle-component');
	}

	render() {
		return html`
			<div id="prop1">${this.storeProvider1.prop1}</div>
			<div id="prop2">${this.storeProvider1.prop2}</div>
			<div id="nestedProp">${this.storeProvider1.objectProp.nestedProp}</div>
			<div id="foo">${this.storeProvider2.foo}</div>
			<div id="bar">${this.storeProvider2.bar}</div>

			<consuming-component></consuming-component>
			<middle-component></middle-component>
		`;
	}

	getRenderedValue(id) {
		return this.shadowRoot.getElementById(id).textContent;
	}
}
customElements.define('hosting-component', HostingComponent);

// Create a component to use as a middle layer between the hosting and consuming components
class MiddleComponent extends LitElement {
	get consumingComponent() {
		return this.shadowRoot.querySelector('consuming-component');
	}

	render() {
		return html`
			<consuming-component></consuming-component>
		`;
	}
}
customElements.define('middle-component', MiddleComponent);

// Create a component that consumes both stores
class ConsumingComponent extends LitElement {

	constructor() {
		super();

		this.storeConsumer1 = new Consumer1(this);
		this.storeConsumer2 = new Consumer2(this);
	}

	render() {
		return html`
			<div id="prop1">${this.storeConsumer1.prop1}</div>
			<div id="prop2">${this.storeConsumer1.prop2}</div>
			<div id="nestedProp">${this.storeConsumer1.objectProp.nestedProp}</div>
			<div id="foo">${this.storeConsumer2.foo}</div>
			<div id="bar">${this.storeConsumer2.bar}</div>
		`;
	}

	getRenderedValue(id) {
		return this.shadowRoot.getElementById(id).textContent;
	}
}
customElements.define('consuming-component', ConsumingComponent);

const basicFixture = html`
	<hosting-component id="host"></hosting-component>
`;
const doubleFixture = html`
	<div>
		<hosting-component id="host1"></hosting-component>
		<hosting-component id="host2"></hosting-component>
	</div>
`;

function verifyRenderedValues(el, renderedVaues = {}) {
	if ('prop1' in renderedVaues) expect(el.getRenderedValue('prop1')).to.equal(renderedVaues.prop1);
	if ('prop2' in renderedVaues) expect(el.getRenderedValue('prop2')).to.equal(renderedVaues.prop2);
	if ('nestedProp' in renderedVaues) expect(el.getRenderedValue('nestedProp')).to.equal(renderedVaues.nestedProp);
	if ('foo' in renderedVaues) expect(el.getRenderedValue('foo')).to.equal(renderedVaues.foo);
	if ('bar' in renderedVaues) expect(el.getRenderedValue('bar')).to.equal(renderedVaues.bar);
}

describe('ReactiveStore Context Controllers', () => {
	describe('Provider', () => {
		it('should reflect the store\'s reactive properties', async() => {
			const hostingComponent = await fixture(basicFixture);

			verifyRenderedValues(hostingComponent, {
				prop1: 'default',
				prop2: 'default',
			});

			hostingComponent.storeProvider1.prop1 = 'value1';
			hostingComponent.storeProvider1.prop2 = 'value2';

			await hostingComponent.updateComplete;

			verifyRenderedValues(hostingComponent, {
				prop1: 'value1',
				prop2: 'value2',
			});
		});

		it('should provide the store properties to all consuming components', async() => {
			const hostingComponent = await fixture(basicFixture);

			const consumingComponent1 = hostingComponent.consumingComponent;
			const consumingComponent2 = hostingComponent.middleComponent.consumingComponent;

			verifyRenderedValues(consumingComponent1, {
				prop1: 'default',
				prop2: 'default',
			});
			verifyRenderedValues(consumingComponent2, {
				prop1: 'default',
				prop2: 'default',
			});

			hostingComponent.storeProvider1.prop1 = 'value1';
			hostingComponent.storeProvider1.prop2 = 'value2';

			await hostingComponent.updateComplete;
			await consumingComponent1.updateComplete;
			await consumingComponent2.updateComplete;

			verifyRenderedValues(consumingComponent1, {
				prop1: 'value1',
				prop2: 'value2',
			});
			verifyRenderedValues(consumingComponent2, {
				prop1: 'value1',
				prop2: 'value2',
			});
		});

		it('should not update when changing nested properties', async() => {
			const hostingComponent = await fixture(basicFixture);

			verifyRenderedValues(hostingComponent, {
				nestedProp: 'default',
			});

			hostingComponent.storeProvider1.objectProp.nestedProp = 'value1';

			await hostingComponent.updateComplete;

			verifyRenderedValues(hostingComponent, {
				nestedProp: 'default',
			});
		});

		it('different stores should not interfere with each other', async() => {
			const hostingComponent = await fixture(basicFixture);

			const consumingComponent = hostingComponent.consumingComponent;

			hostingComponent.storeProvider1.prop1 = 'value1';
			hostingComponent.storeProvider1.prop2 = 'value2';

			await hostingComponent.updateComplete;
			await consumingComponent.updateComplete;

			verifyRenderedValues(consumingComponent, {
				prop1: 'value1',
				prop2: 'value2',
				foo: 'default',
				bar: 'default',
			});

			hostingComponent.storeProvider2.foo = 'value3';
			hostingComponent.storeProvider2.bar = 'value4';

			await hostingComponent.updateComplete;
			await consumingComponent.updateComplete;

			verifyRenderedValues(consumingComponent, {
				prop1: 'value1',
				prop2: 'value2',
				foo: 'value3',
				bar: 'value4',
			});
		});

		it('different components with their own stores should not interfere with each other', async() => {
			const el = await fixture(doubleFixture);
			const hostingComponent1 = el.children.item(0);
			const hostingComponent2 = el.children.item(1);

			const consumingComponent1 = hostingComponent1.consumingComponent;
			const consumingComponent2 = hostingComponent2.consumingComponent;

			hostingComponent1.storeProvider1.prop1 = 'value1';
			hostingComponent1.storeProvider1.prop2 = 'value2';

			await hostingComponent1.updateComplete;
			await hostingComponent2.updateComplete;
			await consumingComponent1.updateComplete;
			await consumingComponent2.updateComplete;

			verifyRenderedValues(consumingComponent1, {
				prop1: 'value1',
				prop2: 'value2',
			});
			verifyRenderedValues(consumingComponent2, {
				prop1: 'default',
				prop2: 'default',
			});

			hostingComponent2.storeProvider1.prop1 = 'value3';
			hostingComponent2.storeProvider1.prop2 = 'value4';

			await hostingComponent2.updateComplete;
			await hostingComponent2.updateComplete;
			await consumingComponent1.updateComplete;
			await consumingComponent2.updateComplete;

			verifyRenderedValues(consumingComponent1, {
				prop1: 'value1',
				prop2: 'value2',
			});
			verifyRenderedValues(consumingComponent2, {
				prop1: 'value3',
				prop2: 'value4',
			});
		});

		describe('forceUpdate', () => {
			it('should force update the providing host and all consuming components', async() => {
				const hostingComponent = await fixture(basicFixture);

				const consumingComponent1 = hostingComponent.consumingComponent;
				const consumingComponent2 = hostingComponent.middleComponent.consumingComponent;

				hostingComponent.storeProvider1.objectProp.nestedProp = 'value1';
				hostingComponent.storeProvider1.forceUpdate();

				await hostingComponent.updateComplete;
				await consumingComponent1.updateComplete;
				await consumingComponent2.updateComplete;

				verifyRenderedValues(consumingComponent1, {
					nestedProp: 'value1',
				});
				verifyRenderedValues(consumingComponent1, {
					nestedProp: 'value1',
				});
				verifyRenderedValues(consumingComponent2, {
					nestedProp: 'value1',
				});
			});

			it('should not affect other components with their own stores', async() => {
				const el = await fixture(doubleFixture);
				const hostingComponent1 = el.children.item(0);
				const hostingComponent2 = el.children.item(1);

				const consumingComponent1 = hostingComponent1.consumingComponent;
				const consumingComponent2 = hostingComponent2.consumingComponent;

				hostingComponent1.storeProvider1.objectProp.nestedProp = 'value1';
				hostingComponent1.storeProvider1.forceUpdate();

				await hostingComponent1.updateComplete;
				await hostingComponent2.updateComplete;
				await consumingComponent1.updateComplete;
				await consumingComponent2.updateComplete;

				verifyRenderedValues(hostingComponent1, {
					nestedProp: 'value1',
				});
				verifyRenderedValues(consumingComponent1, {
					nestedProp: 'value1',
				});
				verifyRenderedValues(hostingComponent2, {
					nestedProp: 'default',
				});
				verifyRenderedValues(consumingComponent2, {
					nestedProp: 'default',
				});
			});
		});
	});

	describe('Consumer', () => {
		it('should reflect the store\'s reactive properties', async() => {
			const consumingComponent = (await fixture(basicFixture)).consumingComponent;

			verifyRenderedValues(consumingComponent, {
				prop1: 'default',
				prop2: 'default',
			});

			consumingComponent.storeConsumer1.prop1 = 'value1';
			consumingComponent.storeConsumer1.prop2 = 'value2';

			await consumingComponent.updateComplete;

			verifyRenderedValues(consumingComponent, {
				prop1: 'value1',
				prop2: 'value2',
			});
		});

		it('should not update when changing nested properties', async() => {
			const consumingComponent = (await fixture(basicFixture)).consumingComponent;

			verifyRenderedValues(consumingComponent, {
				nestedProp: 'default',
			});

			consumingComponent.storeConsumer1.objectProp.nestedProp = 'value1';

			await consumingComponent.updateComplete;

			verifyRenderedValues(consumingComponent, {
				nestedProp: 'default',
			});
		});

		it('should not update when changing properties of a different store', async() => {
			const consumingComponent = (await fixture(basicFixture)).consumingComponent;

			verifyRenderedValues(consumingComponent, {
				prop1: 'default',
				prop2: 'default',
			});

			consumingComponent.storeConsumer2.foo = 'value1';
			consumingComponent.storeConsumer2.bar = 'value2';

			await consumingComponent.updateComplete;

			verifyRenderedValues(consumingComponent, {
				prop1: 'default',
				prop2: 'default',
			});
		});

		it('should not be affected by changes to other components with their own stores', async() => {
			const el = await fixture(doubleFixture);
			const consumingComponent1 = el.children.item(0).consumingComponent;
			const consumingComponent2 = el.children.item(1).consumingComponent;

			verifyRenderedValues(consumingComponent1, {
				prop1: 'default',
				prop2: 'default',
			});
			verifyRenderedValues(consumingComponent2, {
				prop1: 'default',
				prop2: 'default',
			});

			consumingComponent1.storeConsumer1.prop1 = 'value1';
			consumingComponent1.storeConsumer1.prop2 = 'value2';

			await consumingComponent1.updateComplete;
			await consumingComponent2.updateComplete;

			verifyRenderedValues(consumingComponent1, {
				prop1: 'value1',
				prop2: 'value2',
			});
			verifyRenderedValues(consumingComponent2, {
				prop1: 'default',
				prop2: 'default',
			});
		});

		describe('forceUpdate', () => {
			it('should force update the providing host and all consuming components', async() => {
				const hostingComponent = await fixture(basicFixture);

				const consumingComponent1 = hostingComponent.consumingComponent;
				const consumingComponent2 = hostingComponent.middleComponent.consumingComponent;

				consumingComponent1.storeConsumer1.objectProp.nestedProp = 'value1';
				consumingComponent1.storeConsumer1.forceUpdate();

				await hostingComponent.updateComplete;
				await consumingComponent1.updateComplete;
				await consumingComponent2.updateComplete;

				verifyRenderedValues(consumingComponent1, {
					nestedProp: 'value1',
				});
				verifyRenderedValues(consumingComponent1, {
					nestedProp: 'value1',
				});
				verifyRenderedValues(consumingComponent2, {
					nestedProp: 'value1',
				});
			});

			it('should not affect other components with their own stores', async() => {
				const el = await fixture(doubleFixture);
				const hostingComponent1 = el.children.item(0);
				const hostingComponent2 = el.children.item(1);

				const consumingComponent1 = hostingComponent1.consumingComponent;
				const consumingComponent2 = hostingComponent2.consumingComponent;

				consumingComponent1.storeConsumer1.objectProp.nestedProp = 'value1';
				consumingComponent1.storeConsumer1.forceUpdate();

				await hostingComponent1.updateComplete;
				await hostingComponent2.updateComplete;
				await consumingComponent1.updateComplete;
				await consumingComponent2.updateComplete;

				verifyRenderedValues(hostingComponent1, {
					nestedProp: 'value1',
				});
				verifyRenderedValues(consumingComponent1, {
					nestedProp: 'value1',
				});
				verifyRenderedValues(hostingComponent2, {
					nestedProp: 'default',
				});
				verifyRenderedValues(consumingComponent2, {
					nestedProp: 'default',
				});
			});
		});
	});
});
