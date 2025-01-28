import { html, LitElement } from 'lit';
import MyStore from './my-store.js';

// Create a new instance of MyStore
// Note that this would normally be defined in a separate file so that it can be imported by other components
const myStore = new MyStore();
const MyStoreConsumer = myStore.createConsumer();

class MultipleConsumersDemo extends LitElement {
	constructor() {
		super();

		this.consumer = new MyStoreConsumer(this);
	}

	render() {
		return html`
			<h2>Parent</h2>
			<div>Foo: ${this.consumer.foo}</div>
			<div>Bar: ${this.consumer.bar}</div>
			<button @click=${this._click}>Update foo</button>

			<multiple-consumers-demo-child></multiple-consumers-demo-child>
		`;
	}

	_click() {
		this.consumer.foo += 1;
	}
}

class MultipleConsumersDemoChild extends LitElement {
	constructor() {
		super();

		this.consumer = new MyStoreConsumer(this);
	}
	render() {
		return html`
			<h2>Child</h2>
			<div>Foo: ${this.consumer.foo}</div>
			<div>Bar: ${this.consumer.bar}</div>
			<button @click=${this._click}>Update bar</button>
		`;
	}
	_click() {
		this.consumer.bar += 1;
	}
}

customElements.define('multiple-consumers-demo-child', MultipleConsumersDemoChild);
customElements.define('multiple-consumers-demo', MultipleConsumersDemo);
