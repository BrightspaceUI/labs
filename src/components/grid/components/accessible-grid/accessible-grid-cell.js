import { css, html, LitElement } from 'lit';
import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize/localize-mixin.js';
import { PropertyRequiredMixin } from '@brightspace-ui/core/mixins/property-required/property-required-mixin.js';

/**
 * Data-only model carrier for `d2l-accessible-grid`.
 * This element exposes authored cell geometry/label and dispatches lifecycle
 * events so the host can rebuild its rendered tree. It renders NO chrome,
 * NO ARIA, and NO focus management -- all of that lives on the host-rendered
 * role="gridcell" divs (see accessible-grid.js).
 */
class AccessibleGridCell extends LocalizeMixin(PropertyRequiredMixin(LitElement)) {

	static get properties() {
		return {
			/** Optional stable identifier used for focus restoration and slot naming. */
			cellKey: { type: String, attribute: 'cell-key', reflect: true },
			/** Row span (default 1). */
			height: { type: Number, reflect: true },
			/** Accessible label for this cell (required -- announced at pickup). */
			label: { type: String, required: true },
			/** Column span (default 1). */
			width: { type: Number, reflect: true },
			/** Zero-based column anchor. */
			x: { type: Number, reflect: true },
			/** Zero-based row anchor. */
			y: { type: Number, reflect: true },
		};
	}

	static get styles() {
		return css`:host { display: contents; }`;
	}

	constructor() {
		super();
		this.cellKey = undefined;
		this.height = 1;
		this.label = '';
		this.width = 1;
		this.x = 0;
		this.y = 0;
	}

	static get localizeConfig() {
		return {
			importFunc: async lang => (await import(`../../lang/${lang}.js`)).default,
		};
	}

	connectedCallback() {
		super.connectedCallback();
		this.dispatchEvent(new CustomEvent('d2l-accessible-grid-cell-connected', {
			bubbles: true,
			composed: true,
		}));
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.dispatchEvent(new CustomEvent('d2l-accessible-grid-cell-disconnected', {
			bubbles: true,
			composed: true,
		}));
	}

	render() {
		return html`<slot></slot>`;
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		const watched = ['x', 'y', 'width', 'height', 'label', 'cellKey'];
		if (watched.some(p => changedProperties.has(p))) {
			this.dispatchEvent(new CustomEvent('d2l-accessible-grid-cell-changed', {
				bubbles: true,
				composed: true,
			}));
		}
	}

}

customElements.define('d2l-accessible-grid-cell', AccessibleGridCell);
