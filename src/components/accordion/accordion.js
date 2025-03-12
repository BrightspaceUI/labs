import './accordion-collapse.js';
import { css, html, LitElement } from 'lit';

class LabsAccordion extends LitElement {
	static get properties() {
		return {
			/**
			 * Whether to automatically close other opened branches
			 */
			autoClose: { type: Boolean, attribute: 'auto-close' },
			_selected: { type: Number }
		};
	}

	static get styles() {
		return css`
			:host {
				box-sizing: border-box;
				display: block;
			}
		`;
	}

	constructor() {
		super();
		this._handleAccordionOpened = this._handleAccordionOpened.bind(this);
		this.autoClose = false;
	}

	get selected() {
		return this._selected;
	}

	set selected(val) {
		this.select(val);
	}

	get isAccordion() {
		return true;
	}

	get items() {
		return [...this.querySelectorAll('d2l-labs-accordion-collapse')];
	}

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener('d2l-labs-accordion-collapse-state-opened', this._handleAccordionOpened);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.removeEventListener('d2l-labs-accordion-collapse-state-opened', this._handleAccordionOpened);
	}

	render() {
		return html`
				<slot></slot>
		`;
	}

	select(selected) {
		this._selected = selected;
		const items = this.items;

		for (const i in items) {
			items[i].opened = Number(i) === selected;
		}
	}

	_handleAccordionOpened(e) {
		this.select(this.items.indexOf(e.target));
	}

	_setisAccordion(val) {
		this._isAccordion = val;
	}
}

customElements.define('d2l-labs-accordion', LabsAccordion);
