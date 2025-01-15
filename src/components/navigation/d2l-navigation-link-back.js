import './d2l-navigation-link-icon.js';
import { css, html, LitElement } from 'lit';
import { FocusMixin } from '@brightspace-ui/core/mixins/focus-mixin.js';
import { LocalizeNavigationElement } from './components/localize-navigation-element.js';

class NavigationLinkBack extends LocalizeNavigationElement(FocusMixin(LitElement)) {

	static get properties() {
		return {
			text: { type: String },
			href: { type: String }
		};
	}

	static get styles() {
		return css`
			:host {
				display: inline-block;
				height: 100%;
			}
			:host([hidden]) {
				display: none;
			}
		`;
	}

	static get focusElementSelector() {
		return 'd2l-navigation-link-icon';
	}

	render() {
		const href = this.href ? this.href : 'javascript:void(0);'; // backwards-compatible for uses before missing "href" threw exception
		const text = this.text ? this.text : this.localize('back');
		return html`<d2l-navigation-link-icon href="${href}" icon="tier1:chevron-left" text="${text}"></d2l-navigation-link-icon>`;
	}

}

customElements.define('d2l-navigation-link-back', NavigationLinkBack);
