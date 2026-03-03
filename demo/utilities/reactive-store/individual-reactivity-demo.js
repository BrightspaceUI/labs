import { html, LitElement } from 'lit';
import MultiPropStore from './multi-prop-store.js';

// Create a new instance of MultiPropStore
// Note that this would normally be defined in a separate file so that it can be imported by other components
const multiPropStore = new MultiPropStore();
const MultiPropStoreConsumer = multiPropStore.createConsumer();

// This component is only used to show the store state and update its properties
class IndividualReactivityStoreControls extends LitElement {
	constructor() {
		super();

		this.consumer = new MultiPropStoreConsumer(this);
	}

	render() {
		return html`
			<div>
				Foo: ${this.consumer.foo}
				<button @click=${this._incrementFoo}>Increment Foo</button>
			</div>
			<div>
				Bar: ${this.consumer.bar}
				<button @click=${this._incrementBar}>Increment Bar</button>
			</div>
			<div>
				Baz: ${this.consumer.baz}
				<button @click=${this._incrementBaz}>Increment Baz</button>
			</div>
		`;
	}

	_incrementBar() {
		this.consumer.bar++;
	}

	_incrementBaz() {
		this.consumer.baz++;
	}

	_incrementFoo() {
		this.consumer.foo++;
	}
}
customElements.define('individual-reactivity-store-controls', IndividualReactivityStoreControls);

// This component is used to show the individual reactivity features of the store consumer
class IndividualReactivityConsumingComponent extends LitElement {
	static properties = {
		// This property is directly passed to the store consumer's dependentProperties option
		dependentProperties: {
			type: Array,
			attribute: 'dependent-properties',
			converter: (value) => (value ? value.split(',') : undefined),
		},
		// This property is directly passed to the store consumer's detectDependentProperties option
		detectDependentProperties: {
			type: Boolean,
			attribute: 'detect-dependent-properties'
		},
	};

	constructor() {
		super();

		this.renderCount = 0;
	}

	connectedCallback() {
		super.connectedCallback();

		this.consumer = new MultiPropStoreConsumer(this, {
			// The store consumer options are passed in from the component's own properties for the
			// sake of the demo, but in a real use case they would likely be hardcoded values.
			dependentProperties: this.dependentProperties,
			detectDependentProperties: this.detectDependentProperties,
		});
	}

	render() {
		this.renderCount++;

		// From the store, we only render the foo and bar properties. The baz property is not used
		// by this component.
		// A render count is also included to show when the component re-renders.
		return html`
			<div>Foo: ${this.consumer.foo}</div>
			<div>Bar: ${this.consumer.bar}</div>
			<div>Render Count: ${this.renderCount}</div>
		`;
	}
}
customElements.define('individual-reactivity-consuming-component', IndividualReactivityConsumingComponent);
