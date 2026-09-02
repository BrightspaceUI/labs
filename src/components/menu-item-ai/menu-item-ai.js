import '@brightspace-ui/core/components/icons/icon.js';
import { css, html, LitElement } from 'lit';
import { MenuItemMixin } from '@brightspace-ui/core/components/menu/menu-item-mixin.js';
import { menuItemStyles } from '@brightspace-ui/core/components/menu/menu-item-styles.js';

/**
 * A menu item component that displays an AI icon before its text.
 * @slot - Default content placed inside of the component
 */
class MenuItemAI extends MenuItemMixin(LitElement) {

	static styles = [menuItemStyles, css`
		:host {
			align-items: center;
			display: flex;
			gap: 6px;
			padding: 0.75rem 1rem;
		}
		:host([hidden]) {
			display: none;
		}
		d2l-icon {
			flex: none;
		}
		d2l-icon[icon="tier1:chevron-right"] {
			margin-inline-start: 6px;
		}
	`];

	render() {
		const chevron = this.hasChildView ?
			html`<d2l-icon icon="tier1:chevron-right"></d2l-icon>` : null;

		return html`
			<d2l-icon icon="tier1:ai"></d2l-icon>
			<div class="d2l-menu-item-text">${this.text}</div>
			${chevron}
			<slot></slot>
		`;
	}
}

customElements.define('d2l-menu-item-ai', MenuItemAI);
