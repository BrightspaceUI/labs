import '../../../src/components/view-toggle/view-toggle.js';
import { expect, fixture, html } from '@brightspace-ui/testing';
import { LitElement, nothing } from 'lit';
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

		this.nonReactiveProp = 'default';
	}

	testMethod() {
		return 'test';
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

	static properties = {
		provider1Options: {
			type: Object,
			attribute: false,
		},
		provider2Options: {
			type: Object,
			attribute: false,
		},
		dontRenderProps: {
			type: Boolean,
			attribute: 'dont-render-props',
		},
	};

	connectedCallback() {
		super.connectedCallback();
		this.storeProvider1 = new Provider1(this, this.provider1Options);
		this.storeProvider2 = new Provider2(this, this.provider2Options);
	}

	render() {
		if (this.dontRenderProps) return html`<slot></slot>`;

		return html`
			<div id="prop1">${this.storeProvider1.prop1}</div>
			<div id="prop2">${this.storeProvider1.prop2}</div>
			<div id="nestedProp">${this.storeProvider1.objectProp.nestedProp}</div>
			<div id="nonReactiveProp">${this.storeProvider1.nonReactiveProp}</div>
			<div id="foo">${this.storeProvider2.foo}</div>
			<div id="bar">${this.storeProvider2.bar}</div>

			<slot></slot>
		`;
	}

	getRenderedValue(id) {
		return this.shadowRoot.getElementById(id).textContent;
	}
}
customElements.define('hosting-component', HostingComponent);

// Create a component to use as a middle layer between the hosting and consuming components
class MiddleComponent extends LitElement {
	render() {
		return html`
			<slot></slot>
		`;
	}
}
customElements.define('middle-component', MiddleComponent);

// Create a component that consumes both stores
class ConsumingComponent extends LitElement {

	static properties = {
		consumer1Options: {
			type: Object,
			attribute: false,
		},
		consumer2Options: {
			type: Object,
			attribute: false,
		},
		dontRenderProps: {
			type: Boolean,
			attribute: 'dont-render-props',
		},
	};

	connectedCallback() {
		super.connectedCallback();
		this.storeConsumer1 = new Consumer1(this, this.consumer1Options);
		this.storeConsumer2 = new Consumer2(this, this.consumer2Options);
	}

	render() {
		if (this.dontRenderProps) return nothing;

		return html`
			<div id="prop1">${this.storeConsumer1.prop1}</div>
			<div id="prop2">${this.storeConsumer1.prop2}</div>
			<div id="nestedProp">${this.storeConsumer1.objectProp.nestedProp}</div>
			<div id="nonReactiveProp">${this.storeConsumer1.nonReactiveProp}</div>
			<div id="foo">${this.storeConsumer2.foo}</div>
			<div id="bar">${this.storeConsumer2.bar}</div>
		`;
	}

	getRenderedValue(id) {
		return this.shadowRoot.getElementById(id).textContent;
	}
}
customElements.define('consuming-component', ConsumingComponent);

const basicFixture = async({
	provider1Options = {},
	provider2Options = {},
	consumer1_1Options = {},
	consumer1_2Options = {},
	consumer2_1Options = {},
	consumer2_2Options = {},
	hostDontRenderProps = false,
	consumer1DontRenderProps = false,
	consumer2DontRenderProps = false,
} = {}) => {
	const hostingComponent = await fixture(html`
		<hosting-component
			id="host"
			.provider1Options=${provider1Options}
			.provider2Options=${provider2Options}
			?dont-render-props=${hostDontRenderProps}
		>
			<consuming-component
				id="consuming1"
				.consumer1Options=${consumer1_1Options}
				.consumer2Options=${consumer1_2Options}
				?dont-render-props=${consumer1DontRenderProps}
			></consuming-component>
			<middle-component>
				<consuming-component
					id="consuming2"
					.consumer1Options=${consumer2_1Options}
					.consumer2Options=${consumer2_2Options}
					?dont-render-props=${consumer2DontRenderProps}
				></consuming-component>
			</middle-component>
		</hosting-component>
	`);
	const consumingComponent1 = hostingComponent.children.item(0);
	const consumingComponent2 = hostingComponent.children.item(1).children.item(0);

	return { hostingComponent, consumingComponent1, consumingComponent2 };
};
const doubleFixture = async({
	host1Provider1Options = {},
	host1Provider2Options = {},
	host1Consumer1_1Options = {},
	host1Consumer1_2Options = {},
	host1Consumer2_1Options = {},
	host1Consumer2_2Options = {},
	host2Provider1Options = {},
	host2Provider2Options = {},
	host2Consumer1_1Options = {},
	host2Consumer1_2Options = {},
	host2Consumer2_1Options = {},
	host2Consumer2_2Options = {},
} = {}) => {
	const divComponent = await fixture(html`
		<div>
			<hosting-component
				id="host1"
				.provider1Options=${host1Provider1Options}
				.provider2Options=${host1Provider2Options}
			>
				<consuming-component
					id="consuming1_1"
					.consumer1Options=${host1Consumer1_1Options}
					.consumer2Options=${host1Consumer1_2Options}
				></consuming-component>
				<middle-component>
					<consuming-component
						id="consuming1_2"
						.consumer1Options=${host1Consumer2_1Options}
						.consumer2Options=${host1Consumer2_2Options}
					></consuming-component>
				</middle-component>
			</hosting-component>
			<hosting-component
				id="host2"
				.provider1Options=${host2Provider1Options}
				.provider2Options=${host2Provider2Options}
			>
				<consuming-component
					id="consuming2_1"
					.consumer1Options=${host2Consumer1_1Options}
					.consumer2Options=${host2Consumer1_2Options}
				></consuming-component>
				<middle-component>
					<consuming-component
						id="consuming2_2"
						.consumer1Options=${host2Consumer2_1Options}
						.consumer2Options=${host2Consumer2_2Options}
					></consuming-component>
				</middle-component>
			</hosting-component>
		</div>
	`);
	const hostingComponent1 = divComponent.children.item(0);
	const consumingComponent1_1 = hostingComponent1.children.item(0);
	const consumingComponent1_2 = hostingComponent1.children.item(1).children.item(0);
	const hostingComponent2 = divComponent.children.item(1);
	const consumingComponent2_1 = hostingComponent2.children.item(0);
	const consumingComponent2_2 = hostingComponent2.children.item(1).children.item(0);

	return {
		hostingComponent1,
		consumingComponent1_1,
		consumingComponent1_2,
		hostingComponent2,
		consumingComponent2_1,
		consumingComponent2_2
	};
};

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
			const { hostingComponent } = await basicFixture();

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
			const { hostingComponent, consumingComponent1, consumingComponent2 } = await basicFixture();

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
			const { hostingComponent } = await basicFixture();

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
			const { hostingComponent, consumingComponent1 } = await basicFixture();

			hostingComponent.storeProvider1.prop1 = 'value1';
			hostingComponent.storeProvider1.prop2 = 'value2';

			await hostingComponent.updateComplete;
			await consumingComponent1.updateComplete;

			verifyRenderedValues(consumingComponent1, {
				prop1: 'value1',
				prop2: 'value2',
				foo: 'default',
				bar: 'default',
			});

			hostingComponent.storeProvider2.foo = 'value3';
			hostingComponent.storeProvider2.bar = 'value4';

			await hostingComponent.updateComplete;
			await consumingComponent1.updateComplete;

			verifyRenderedValues(consumingComponent1, {
				prop1: 'value1',
				prop2: 'value2',
				foo: 'value3',
				bar: 'value4',
			});
		});

		it('different components with their own stores should not interfere with each other', async() => {
			const { hostingComponent1, hostingComponent2, consumingComponent1_1, consumingComponent2_1 } = await doubleFixture();

			hostingComponent1.storeProvider1.prop1 = 'value1';
			hostingComponent1.storeProvider1.prop2 = 'value2';

			await hostingComponent1.updateComplete;
			await hostingComponent2.updateComplete;
			await consumingComponent1_1.updateComplete;
			await consumingComponent2_1.updateComplete;

			verifyRenderedValues(consumingComponent1_1, {
				prop1: 'value1',
				prop2: 'value2',
			});
			verifyRenderedValues(consumingComponent2_1, {
				prop1: 'default',
				prop2: 'default',
			});

			hostingComponent2.storeProvider1.prop1 = 'value3';
			hostingComponent2.storeProvider1.prop2 = 'value4';

			await hostingComponent2.updateComplete;
			await hostingComponent2.updateComplete;
			await consumingComponent1_1.updateComplete;
			await consumingComponent2_1.updateComplete;

			verifyRenderedValues(consumingComponent1_1, {
				prop1: 'value1',
				prop2: 'value2',
			});
			verifyRenderedValues(consumingComponent2_1, {
				prop1: 'value3',
				prop2: 'value4',
			});
		});

		describe('forceUpdate', () => {
			it('should force update the providing host and all consuming components', async() => {
				const { hostingComponent, consumingComponent1, consumingComponent2 } = await basicFixture();

				hostingComponent.storeProvider1.objectProp.nestedProp = 'value1';
				hostingComponent.storeProvider1.forceUpdate();

				await hostingComponent.updateComplete;
				await consumingComponent1.updateComplete;
				await consumingComponent2.updateComplete;

				verifyRenderedValues(hostingComponent, {
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
				const { hostingComponent1, hostingComponent2, consumingComponent1_1, consumingComponent2_1 } = await doubleFixture();

				hostingComponent1.storeProvider1.objectProp.nestedProp = 'value1';
				hostingComponent1.storeProvider1.forceUpdate();

				await hostingComponent1.updateComplete;
				await hostingComponent2.updateComplete;
				await consumingComponent1_1.updateComplete;
				await consumingComponent2_1.updateComplete;

				verifyRenderedValues(hostingComponent1, {
					nestedProp: 'value1',
				});
				verifyRenderedValues(consumingComponent1_1, {
					nestedProp: 'value1',
				});
				verifyRenderedValues(hostingComponent2, {
					nestedProp: 'default',
				});
				verifyRenderedValues(consumingComponent2_1, {
					nestedProp: 'default',
				});
			});
		});

		describe('dependentProperties', () => {
			it('provider should include all reactive properties by default', async() => {
				const { hostingComponent } = await basicFixture();

				expect(Array.from(hostingComponent.storeProvider1.dependentProperties)).to.deep.equal([
					'prop1',
					'prop2',
					'objectProp',
				]);
			});

			it('should re-render when changing dependentProperties', async() => {
				const { hostingComponent } = await basicFixture({
					provider1Options: {
						dependentProperties: ['prop1'],
					},
				});
				hostingComponent.storeProvider1.dependentProperties.add('prop2');

				verifyRenderedValues(hostingComponent, {
					prop1: 'default',
					prop2: 'default',
				});

				await hostingComponent.updateComplete;
				const prevUpdateCompletePromise = hostingComponent.updateComplete;

				hostingComponent.storeProvider1.prop1 = 'value1';
				hostingComponent.storeProvider1.prop2 = 'value2';

				await hostingComponent.updateComplete;
				expect(hostingComponent.updateComplete).to.not.equal(prevUpdateCompletePromise);
			});

			it('should not re-render when changing non-dependentProperties', async() => {
				const { hostingComponent } = await basicFixture({
					provider1Options: {
						dependentProperties: ['prop1'],
					},
				});

				verifyRenderedValues(hostingComponent, {
					prop1: 'default',
					prop2: 'default',
				});

				await hostingComponent.updateComplete;
				const prevUpdateCompletePromise = hostingComponent.updateComplete;

				hostingComponent.storeProvider1.prop2 = 'value2';

				expect(hostingComponent.updateComplete).to.equal(prevUpdateCompletePromise);
			});

			it('should ignore non-reactive properties', async() => {
				const { hostingComponent } = await basicFixture({
					provider1Options: {
						dependentProperties: ['nonReactiveProp'],
					},
				});

				verifyRenderedValues(hostingComponent, {
					nonReactiveProp: 'default',
				});

				await hostingComponent.updateComplete;
				const prevUpdateCompletePromise = hostingComponent.updateComplete;

				hostingComponent.storeProvider1.nonReactiveProp = 'value1';

				expect(hostingComponent.updateComplete).to.equal(prevUpdateCompletePromise);
			});

			describe('detectDependentProperties', () => {
				describe('when true', () => {
					it('should initialize dependentProperties to an empty Set', async() => {
						const { hostingComponent } = await basicFixture({
							provider1Options: {
								detectDependentProperties: true,
							},
							hostDontRenderProps: true,
						});

						expect(hostingComponent.storeProvider1.dependentProperties.size).to.equal(0);
					});

					it('should add a property to dependentProperties when accessed or set', async() => {
						const { hostingComponent } = await basicFixture({
							provider1Options: {
								detectDependentProperties: true,
							},
							hostDontRenderProps: true,
						});

						hostingComponent.storeProvider1.prop1;
						hostingComponent.storeProvider1.prop2 = 'value1';

						expect(hostingComponent.storeProvider1.dependentProperties.size).to.equal(2);
						expect(hostingComponent.storeProvider1.dependentProperties.has('prop1')).to.be.true;
						expect(hostingComponent.storeProvider1.dependentProperties.has('prop2')).to.be.true;
					});

					it('should not add non-reactive properties to dependentProperties', async() => {
						const { hostingComponent } = await basicFixture({
							provider1Options: {
								detectDependentProperties: true,
							},
						});

						hostingComponent.storeProvider1.nonReactiveProp;
						hostingComponent.storeProvider1.nonReactiveProp = 'value1';

						expect(hostingComponent.storeProvider1.dependentProperties.has('nonReactiveProp')).to.be.false;
					});
				});

				describe('when false', () => {
					it('should initialize dependentProperties to include all reactive properties', async() => {
						const { hostingComponent } = await basicFixture({
							provider1Options: {
								detectDependentProperties: false,
							},
						});

						expect(Array.from(hostingComponent.storeProvider1.dependentProperties)).to.deep.equal([
							'prop1',
							'prop2',
							'objectProp',
						]);
					});

					it('should not add dependentProperties when accessed or set', async() => {
						const { hostingComponent } = await basicFixture({
							provider1Options: {
								detectDependentProperties: false,
								dependentProperties: [],
							},
						});

						hostingComponent.storeProvider1.prop1;
						hostingComponent.storeProvider1.prop2 = 'value1';

						expect(hostingComponent.storeProvider1.dependentProperties.size).to.equal(0);
					});
				});
			});
		});

		describe('non-reactive properties and methods', () => {
			it('should reflect the store non-reactive properties and methods', async() => {
				const { hostingComponent } = await basicFixture();

				expect(hostingComponent.storeProvider1.nonReactiveProp).to.equal('default');
				expect(hostingComponent.storeProvider1.testMethod()).to.equal('test');

				hostingComponent.storeProvider1.nonReactiveProp = 'value1';
				expect(hostingComponent.storeProvider1.nonReactiveProp).to.equal('value1');
			});

			it('non-reactive properties should not trigger an update', async() => {
				const { hostingComponent } = await basicFixture();

				verifyRenderedValues(hostingComponent, {
					nonReactiveProp: 'default',
				});

				hostingComponent.storeProvider1.nonReactiveProp = 'value1';

				await hostingComponent.updateComplete;

				verifyRenderedValues(hostingComponent, {
					nonReactiveProp: 'default',
				});
			});

			it('non-reactive properties should not be in changedProperties', async() => {
				const { hostingComponent } = await basicFixture();

				hostingComponent.storeProvider1.nonReactiveProp = 'value1';

				await hostingComponent.updateComplete;

				expect(hostingComponent.storeProvider1.changedProperties.has('nonReactiveProp')).to.be.false;
			});
		});
	});

	describe('Consumer', () => {
		it('should reflect the store\'s reactive properties', async() => {
			const { consumingComponent1 } = await basicFixture();

			verifyRenderedValues(consumingComponent1, {
				prop1: 'default',
				prop2: 'default',
			});

			consumingComponent1.storeConsumer1.prop1 = 'value1';
			consumingComponent1.storeConsumer1.prop2 = 'value2';

			await consumingComponent1.updateComplete;

			verifyRenderedValues(consumingComponent1, {
				prop1: 'value1',
				prop2: 'value2',
			});
		});

		it('should not update when changing nested properties', async() => {
			const { consumingComponent1 } = await basicFixture();

			verifyRenderedValues(consumingComponent1, {
				nestedProp: 'default',
			});

			consumingComponent1.storeConsumer1.objectProp.nestedProp = 'value1';

			await consumingComponent1.updateComplete;

			verifyRenderedValues(consumingComponent1, {
				nestedProp: 'default',
			});
		});

		it('should not update when changing properties of a different store', async() => {
			const { consumingComponent1 } = await basicFixture();

			verifyRenderedValues(consumingComponent1, {
				prop1: 'default',
				prop2: 'default',
			});

			consumingComponent1.storeConsumer2.foo = 'value1';
			consumingComponent1.storeConsumer2.bar = 'value2';

			await consumingComponent1.updateComplete;

			verifyRenderedValues(consumingComponent1, {
				prop1: 'default',
				prop2: 'default',
			});
		});

		it('should not be affected by changes to other components with their own stores', async() => {
			const { consumingComponent1_1, consumingComponent2_1 } = await doubleFixture();

			verifyRenderedValues(consumingComponent1_1, {
				prop1: 'default',
				prop2: 'default',
			});
			verifyRenderedValues(consumingComponent2_1, {
				prop1: 'default',
				prop2: 'default',
			});

			consumingComponent1_1.storeConsumer1.prop1 = 'value1';
			consumingComponent1_1.storeConsumer1.prop2 = 'value2';

			await consumingComponent1_1.updateComplete;
			await consumingComponent2_1.updateComplete;

			verifyRenderedValues(consumingComponent1_1, {
				prop1: 'value1',
				prop2: 'value2',
			});
			verifyRenderedValues(consumingComponent2_1, {
				prop1: 'default',
				prop2: 'default',
			});
		});

		describe('forceUpdate', () => {
			it('should force update the providing host and all consuming components', async() => {
				const { hostingComponent, consumingComponent1, consumingComponent2 } = await basicFixture();

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
				const { hostingComponent1, hostingComponent2, consumingComponent1_1, consumingComponent2_1 } = await doubleFixture();

				consumingComponent1_1.storeConsumer1.objectProp.nestedProp = 'value1';
				consumingComponent1_1.storeConsumer1.forceUpdate();

				await hostingComponent1.updateComplete;
				await hostingComponent2.updateComplete;
				await consumingComponent1_1.updateComplete;
				await consumingComponent2_1.updateComplete;

				verifyRenderedValues(hostingComponent1, {
					nestedProp: 'value1',
				});
				verifyRenderedValues(consumingComponent1_1, {
					nestedProp: 'value1',
				});
				verifyRenderedValues(hostingComponent2, {
					nestedProp: 'default',
				});
				verifyRenderedValues(consumingComponent2_1, {
					nestedProp: 'default',
				});
			});
		});

		describe('dependentProperties', () => {
			it('consumer should include all reactive properties by default', async() => {
				const { consumingComponent1, consumingComponent2 } = await basicFixture();

				expect(Array.from(consumingComponent1.storeConsumer1.dependentProperties)).to.deep.equal([
					'prop1',
					'prop2',
					'objectProp',
				]);
				expect(Array.from(consumingComponent2.storeConsumer1.dependentProperties)).to.deep.equal([
					'prop1',
					'prop2',
					'objectProp',
				]);
			});

			it('should re-render when changing dependentProperties', async() => {
				const { consumingComponent1, consumingComponent2 } = await basicFixture({
					consumer1_1Options: {
						dependentProperties: ['prop1'],
					},
					consumer2_1Options: {
						dependentProperties: ['prop1'],
					},
				});
				consumingComponent1.storeConsumer1.dependentProperties.add('prop2');
				consumingComponent2.storeConsumer1.dependentProperties.add('prop2');

				verifyRenderedValues(consumingComponent1, {
					prop1: 'default',
					prop2: 'default',
				});
				verifyRenderedValues(consumingComponent2, {
					prop1: 'default',
					prop2: 'default',
				});

				await consumingComponent1.updateComplete;
				await consumingComponent2.updateComplete;
				const prevUpdateCompletePromise1 = consumingComponent1.updateComplete;
				const prevUpdateCompletePromise2 = consumingComponent2.updateComplete;

				consumingComponent1.storeConsumer1.prop1 = 'value1';
				consumingComponent1.storeConsumer1.prop2 = 'value2';
				consumingComponent2.storeConsumer1.prop1 = 'value3';
				consumingComponent2.storeConsumer1.prop2 = 'value4';

				await consumingComponent1.updateComplete;
				await consumingComponent2.updateComplete;
				expect(consumingComponent1.updateComplete).to.not.equal(prevUpdateCompletePromise1);
				expect(consumingComponent2.updateComplete).to.not.equal(prevUpdateCompletePromise2);
			});

			it('should not re-render when changing non-dependentProperties', async() => {
				const { consumingComponent1, consumingComponent2 } = await basicFixture({
					consumer1_1Options: {
						dependentProperties: ['prop1'],
					},
					consumer2_1Options: {
						dependentProperties: ['prop1'],
					},
				});

				verifyRenderedValues(consumingComponent1, {
					prop1: 'default',
					prop2: 'default',
				});
				verifyRenderedValues(consumingComponent2, {
					prop1: 'default',
					prop2: 'default',
				});

				await consumingComponent1.updateComplete;
				await consumingComponent2.updateComplete;
				const prevUpdateCompletePromise1 = consumingComponent1.updateComplete;
				const prevUpdateCompletePromise2 = consumingComponent2.updateComplete;

				consumingComponent1.storeConsumer1.prop2 = 'value2';
				consumingComponent2.storeConsumer1.prop2 = 'value4';

				expect(consumingComponent1.updateComplete).to.equal(prevUpdateCompletePromise1);
				expect(consumingComponent2.updateComplete).to.equal(prevUpdateCompletePromise2);
			});

			it('should ignore non-reactive properties', async() => {
				const { consumingComponent1, consumingComponent2 } = await basicFixture({
					consumer1_1Options: {
						dependentProperties: ['nonReactiveProp'],
					},
					consumer2_1Options: {
						dependentProperties: ['nonReactiveProp'],
					},
				});

				verifyRenderedValues(consumingComponent1, {
					nonReactiveProp: 'default',
				});
				verifyRenderedValues(consumingComponent2, {
					nonReactiveProp: 'default',
				});

				await consumingComponent1.updateComplete;
				await consumingComponent2.updateComplete;
				const prevUpdateCompletePromise1 = consumingComponent1.updateComplete;
				const prevUpdateCompletePromise2 = consumingComponent2.updateComplete;

				consumingComponent1.storeConsumer1.nonReactiveProp = 'value1';
				consumingComponent2.storeConsumer1.nonReactiveProp = 'value2';

				expect(consumingComponent1.updateComplete).to.equal(prevUpdateCompletePromise1);
				expect(consumingComponent2.updateComplete).to.equal(prevUpdateCompletePromise2);
			});

			describe('detectDependentProperties', () => {
				describe('when true', () => {
					it('should initialize dependentProperties to an empty Set', async() => {
						const { consumingComponent1, consumingComponent2 } = await basicFixture({
							consumer1_1Options: {
								detectDependentProperties: true,
							},
							consumer2_1Options: {
								detectDependentProperties: true,
							},
							consumer1DontRenderProps: true,
							consumer2DontRenderProps: true,
						});

						expect(consumingComponent1.storeConsumer1.dependentProperties.size).to.equal(0);
						expect(consumingComponent2.storeConsumer1.dependentProperties.size).to.equal(0);
					});

					it('should add a property to dependentProperties when accessed or set', async() => {
						const { consumingComponent1, consumingComponent2 } = await basicFixture({
							consumer1_1Options: {
								detectDependentProperties: true,
							},
							consumer2_1Options: {
								detectDependentProperties: true,
							},
							consumer1DontRenderProps: true,
							consumer2DontRenderProps: true,
						});

						consumingComponent1.storeConsumer1.prop1;
						consumingComponent1.storeConsumer1.prop2 = 'value1';
						consumingComponent2.storeConsumer1.prop1;
						consumingComponent2.storeConsumer1.prop2 = 'value2';

						expect(consumingComponent1.storeConsumer1.dependentProperties.size).to.equal(2);
						expect(consumingComponent2.storeConsumer1.dependentProperties.size).to.equal(2);
						expect(consumingComponent1.storeConsumer1.dependentProperties.has('prop1')).to.be.true;
						expect(consumingComponent1.storeConsumer1.dependentProperties.has('prop2')).to.be.true;
						expect(consumingComponent2.storeConsumer1.dependentProperties.has('prop1')).to.be.true;
						expect(consumingComponent2.storeConsumer1.dependentProperties.has('prop2')).to.be.true;
					});

					it('should not add non-reactive properties to dependentProperties', async() => {
						const { consumingComponent1, consumingComponent2 } = await basicFixture({
							consumer1_1Options: {
								detectDependentProperties: true,
							},
							consumer2_1Options: {
								detectDependentProperties: true,
							},
						});

						consumingComponent1.storeConsumer1.nonReactiveProp;
						consumingComponent1.storeConsumer1.nonReactiveProp = 'value1';
						consumingComponent2.storeConsumer1.nonReactiveProp;
						consumingComponent2.storeConsumer1.nonReactiveProp = 'value2';

						expect(consumingComponent1.storeConsumer1.dependentProperties.has('nonReactiveProp')).to.be.false;
						expect(consumingComponent2.storeConsumer1.dependentProperties.has('nonReactiveProp')).to.be.false;
					});
				});

				describe('when false', () => {
					it('should initialize dependentProperties to include all reactive properties', async() => {
						const { consumingComponent1, consumingComponent2 } = await basicFixture({
							consumer1_1Options: {
								detectDependentProperties: false,
							},
							consumer2_1Options: {
								detectDependentProperties: false,
							},
						});

						expect(Array.from(consumingComponent1.storeConsumer1.dependentProperties)).to.deep.equal([
							'prop1',
							'prop2',
							'objectProp',
						]);
						expect(Array.from(consumingComponent2.storeConsumer1.dependentProperties)).to.deep.equal([
							'prop1',
							'prop2',
							'objectProp',
						]);
					});

					it('should not add dependentProperties when accessed or set', async() => {
						const { consumingComponent1, consumingComponent2 } = await basicFixture({
							consumer1_1Options: {
								detectDependentProperties: false,
								dependentProperties: [],
							},
							consumer2_1Options: {
								detectDependentProperties: false,
								dependentProperties: [],
							},
						});

						consumingComponent1.storeConsumer1.prop1;
						consumingComponent1.storeConsumer1.prop2 = 'value1';
						consumingComponent2.storeConsumer1.prop1;
						consumingComponent2.storeConsumer1.prop2 = 'value2';

						expect(consumingComponent1.storeConsumer1.dependentProperties.size).to.equal(0);
						expect(consumingComponent2.storeConsumer1.dependentProperties.size).to.equal(0);
					});
				});
			});
		});

		describe('non-reactive properties and methods', () => {
			it('should reflect the store non-reactive properties and methods', async() => {
				const { consumingComponent1 } = await basicFixture();

				expect(consumingComponent1.storeConsumer1.nonReactiveProp).to.equal('default');
				expect(consumingComponent1.storeConsumer1.testMethod()).to.equal('test');

				consumingComponent1.storeConsumer1.nonReactiveProp = 'value1';
				expect(consumingComponent1.storeConsumer1.nonReactiveProp).to.equal('value1');
			});

			it('non-reactive properties should not trigger an update', async() => {
				const { consumingComponent1 } = await basicFixture();

				verifyRenderedValues(consumingComponent1, {
					nonReactiveProp: 'default',
				});

				consumingComponent1.storeConsumer1.nonReactiveProp = 'value1';

				await consumingComponent1.updateComplete;

				verifyRenderedValues(consumingComponent1, {
					nonReactiveProp: 'default',
				});
			});

			it('non-reactive properties should not be in changedProperties', async() => {
				const { consumingComponent1 } = await basicFixture();

				consumingComponent1.storeConsumer1.nonReactiveProp = 'value1';

				await consumingComponent1.updateComplete;

				expect(consumingComponent1.storeConsumer1.changedProperties.has('nonReactiveProp')).to.be.false;
			});
		});
	});
});
