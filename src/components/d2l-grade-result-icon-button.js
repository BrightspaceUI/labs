import '@brightspace-ui/core/components/button/button-icon.js';
import '@brightspace-ui/core/components/tooltip/tooltip.js';
import { html, LitElement } from 'lit';
import { getUniqueId } from '@brightspace-ui/core/helpers/uniqueId.js';
import { ifDefined } from 'lit/directives/if-defined.js';

export class D2LGradeResultIconButton extends LitElement {
	static get properties() {
		return {
			tooltipText: { type: String },
			icon: { type: String },
			_id: { type: String },
			ariaLabel: { type: String }
		};
	}

	constructor() {
		super();
		this._id = getUniqueId();
	}

	render() {
		return html`
			<div>
				<d2l-button-icon
					id="d2l-grade-result-icon-button-${this._id}"
					icon=${this.icon}
					@click=${this._onClick}
					aria-label=${ifDefined(this.ariaLabel)}
				></d2l-button-icon>

				${this.tooltipText ? html`
					<d2l-tooltip
						for="d2l-grade-result-icon-button-${this._id}"
						position="bottom"
						align="start"
					>
						${this.tooltipText}
					</d2l-tooltip>
				` : html`` }
			</div>
		`;
	}

	_onClick() {
		this.dispatchEvent(new CustomEvent('d2l-grade-result-icon-button-click', {
			bubbles: true,
			composed: true,
		}));
	}

}
customElements.define('d2l-grade-result-icon-button', D2LGradeResultIconButton);
