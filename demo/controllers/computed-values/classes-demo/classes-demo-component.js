import './with-computed-values-component.js';
import './without-computed-values-component.js';
import { html, LitElement } from 'lit';

class ClassesDemoComponent extends LitElement {
	static properties = {
		withComputedValues: { type: Boolean }
	};

	constructor() {
		super();

		this.withComputedValues = false;
	}

	render() {
		const component = this.withComputedValues
			? html`<with-computed-values-component></with-computed-values-component>`
			: html`<without-computed-values-component></without-computed-values-component>`;

		return html`
			<div>
				<label for="toggle">With ComputedValues Controller</label>
				<input
					id="toggle"
					type="checkbox"
					.checked=${this.withComputedValues}
					@click=${this._handleToggleWithComputedValues}
				>
			</div>
			${component}
		`;
	}

	_handleToggleWithComputedValues() {
		this.withComputedValues = !this.withComputedValues;
	}
}
customElements.define('classes-demo-component', ClassesDemoComponent);
