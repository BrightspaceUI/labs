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
			<div>Count: ${this.consumer.count}</div>
			<button @click=${this._increment}>Increment</button>
			<button @click=${this._decrement}>Decrement</button>
			<button @click=${this._reset}>Reset</button>

			<multiple-consumers-demo-child></multiple-consumers-demo-child>
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

class MultipleConsumersDemoChild extends LitElement {
	constructor() {
		super();

		this.consumer = new MyStoreConsumer(this);
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

customElements.define('multiple-consumers-demo-child', MultipleConsumersDemoChild);
customElements.define('multiple-consumers-demo', MultipleConsumersDemo);
