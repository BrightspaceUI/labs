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
			<div>Foo: ${this.consumer.foo}</div>
			<div>Bar: ${this.consumer.bar}</div>
			<button @click=${this._updateFoo}>Update foo</button>
			<button @click=${this._updateBar}>Update bar</button>
		`;
	}

	_updateBar() {
		this.consumer.bar += 1;
	}

	_updateFoo() {
		this.consumer.foo += 1;
	}
}

customElements.define('basic-demo', BasicDemo);
