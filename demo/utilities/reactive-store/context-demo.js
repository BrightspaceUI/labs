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
			<div>Count: ${this.store.count}</div>
			<button @click=${this._increment}>Increment</button>
			<button @click=${this._decrement}>Decrement</button>
			<button @click=${this._reset}>Reset</button>

			<context-demo-child></context-demo-child>
		`;
	}

	_decrement() {
		this.store.decrement();
	}

	_increment() {
		this.store.increment();
	}

	_reset() {
		this.store.count = 0;
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
			<div>Count: ${this.consumer.count}</div>
			<button @click=${this._increment}>Increment</button>
			<button @click=${this._decrement}>Decrement</button>
			<button @click=${this._reset}>Reset</button>
		`;
	}

	_decrement() {
		this.consumer.decrement();
	}

	_increment() {
		this.consumer.increment();
	}

	_reset() {
		this.consumer.count = 0;
	}
}

customElements.define('context-demo-child', ContextDemoChild);
customElements.define('context-demo', ContextDemo);
