import { html, LitElement } from 'lit';
import MyStore from './my-store.js';

// Create a new instance of MyStore
// Note that this would normally be defined in a separate file so that it can be imported by other components
const myStore = new MyStore();
const MyStoreConsumer = myStore.createConsumer();

class BasicDemo extends LitElement {
	constructor() {
		super();

		this.consumer = new MyStoreConsumer(this);
	}

	render() {
		return html`
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

customElements.define('basic-demo', BasicDemo);
