import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-ui/core/components/icons/icon.js';
import { css, html, LitElement } from 'lit';
import { RtlMixin } from '@brightspace-ui/core/mixins/rtl-mixin.js';

function getIcon(state) {
	switch (state) {
		case 'success':
			return 'tier1:check-circle';
		case 'warning':
			return 'tier1:alert';
		default:
			return 'tier1:close-circle';
	}
}

class StatusIcon extends RtlMixin(LitElement) {

	static get properties() {
		return {
			state: { type: String, reflect: true },
			message: { type: String, reflect: true }
		};
	}

	static get styles() {
		return css`
			:host {
				align-items: center;
				display: inline-flex;
			}
			:host([hidden]) {
				display: none;
			}
			:host,
			d2l-icon {
				color: var(--d2l-color-cinnabar);
			}
			:host([state="warning"]),
			:host([state="warning"]) d2l-icon {
				color: var(--d2l-color-citrine);
			}
			:host([state="success"]),
			:host([state="success"]) d2l-icon {
				color: var(--d2l-color-olivine);
			}
			span {
				margin-left: 0.4em;
			}
			:host([dir="rtl"]) span {
				margin-left: 0;
				margin-right: 0.4em;
			}
		`;
	}

	constructor() {
		super();
		this.state = 'failure';
	}

	render() {
		const icon = getIcon(this.state);
		return html`
			<d2l-icon icon="${icon}"></d2l-icon>
			<span>${this.message} </span>
		`;
	}

}
customElements.define('d2l-labs-status-icon', StatusIcon);
