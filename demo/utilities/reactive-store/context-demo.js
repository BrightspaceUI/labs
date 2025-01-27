import { html, LitElement } from 'lit';
import MyStore from './my-store.js';

// Define the context controllers
// Note that this would normally be defined in a separate file so that it can be imported by other components
const {
	Provider: MyStoreContextProvider,
	Consumer: MyStoreContextConsumer
} = MyStore.createContextControllers();

class ContextDemo extends LitElement {
	constructor() {
		super();

		this.store = new MyStoreContextProvider(this);
	}
	render() {
		return html`
			<h2>Parent</h2>
			<div>Foo: ${this.store.foo}</div>
			<div>Bar: ${this.store.bar}</div>
			<button @click=${this._click}>Update foo</button>

			<context-demo-child></context-demo-child>
		`;
	}

	_click() {
		this.store.foo += 1;
	}
}

class ContextDemoChild extends LitElement {
	constructor() {
		super();

		this.consumer = new MyStoreContextConsumer(this);
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

customElements.define('context-demo-child', ContextDemoChild);
customElements.define('context-demo', ContextDemo);
