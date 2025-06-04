import '@brightspace-ui/core/components/loading-spinner/loading-spinner.js';
import { css, html, LitElement } from 'lit';
import { DataLayerGroup, declareDependencies } from './index.js';
import { DataLayerController } from './lit/index.js';

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

const fooData = new FooData();

class DataLayerDemo extends LitElement {
	static properties = {
		linkLoading: { type: Boolean, attribute: 'link-loading' },
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

		this._data = new DataLayerController(this, fooData, [
			'foo',
			'bar',
			'baz',
			'baz2',
		]);
	}

	render() {
		if (this.linkLoading && this._data.loading) {
			return html`<d2l-loading-spinner></d2l-loading-spinner>`;
		}

		return html`
			${this._renderItem('foo')}
			${this._renderItem('bar')}
			${this._renderItem('baz')}
			${this._renderItem('baz2')}
		`;
	}

	_append(e) {
		fooData.getItem(e.target?.dataset.prop).value += '!';
	}

	_flush(e) {
		fooData.getItem(e.target?.dataset.prop).flush();
	}

	_renderItem(prop) {
		return html`
			<div>
				${prop}:
				<button @click=${this._flush} data-prop=${prop}>Flush</button>
				<button @click=${this._append} data-prop=${prop}>Append</button>
				${this._data.getLoading(prop) ? html`<d2l-loading-spinner></d2l-loading-spinner>` : this._data[prop]}
			</div>
		`;
	}
}

customElements.define('d2l-data-layer-demo', DataLayerDemo);
