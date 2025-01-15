import { css, html, LitElement } from 'lit';
import { highlightBorderStyles, highlightButtonStyles } from './d2l-navigation-styles.js';
import { DropdownOpenerMixin } from '@brightspace-ui/core/components/dropdown/dropdown-opener-mixin.js';

class NavigationDropdownButtonCustom extends DropdownOpenerMixin(LitElement) {

	static get styles() {
		return [highlightBorderStyles, highlightButtonStyles, css`
			:host {
				display: inline-block;
				height: 100%;
				position: relative;
			}
			:host([hidden]) {
				display: none;
			}
		`];
	}

	render() {
		return html`
			<button type="button">
				<span class="d2l-navigation-highlight-border"></span>
				<slot name="opener"></slot>
			</button>
			<slot></slot>
		`;
	}

	getOpenerElement() {
		return this.shadowRoot?.querySelector('button');
	}
}

customElements.define('d2l-navigation-dropdown-button-custom', NavigationDropdownButtonCustom);
