import '@brightspace-ui/core/components/loading-spinner/loading-spinner.js';
import { css, html, LitElement } from 'lit';
import { DataLayerGroup, declareDependencies } from './index.js';

class FooData extends DataLayerGroup {
	static actions = {
		flushBar() { this.getItem('bar').flush(); },
	};

	static data = {
		foo: 'foo',
		async bar() {
			declareDependencies(this.foo);
			await new Promise(resolve => setTimeout(resolve, 1000));
			return `${this.foo}bar`;
		},
		baz() { return `${this.bar}baz`; },
		async baz2() {
			declareDependencies(this.bar);
			await new Promise(resolve => setTimeout(resolve, 5000));
			return `${this.bar}baz2`;
		},
	};
}

const dataLayer = new FooData();

export class DataLayerDemo extends LitElement {
	static properties = {
		prop: { type: String },
		_data: { state: true },
		_loading: { state: true },
	};

	static styles = css`
		:host {
			display: block;
		}
	`;

	constructor() {
		super();

		this.prop = '';
		this._data = null;
		this._loading = true;
	}

	firstUpdated() {
		if (this.prop) {
			dataLayer.getItem(this.prop).subscribe(v => {
				this._data = v.value;
				this._loading = v.evaluating;
			}, true);
		}
	}

	render() {
		return html`
			${this.prop}:
			<button @click=${this._flush}>Flush</button>
			<button @click=${this._append}>Append</button>
			${this._loading ? html`<d2l-loading-spinner></d2l-loading-spinner>` : this._data}
		`;
	}

	_append() {
		dataLayer.getItem(this.prop).value += '!';
	}

	_flush() {
		dataLayer.getItem(this.prop).flush();
	}
}

customElements.define('d2l-data-layer-demo', DataLayerDemo);
