import './d2l-navigation-skip.js';
import { html, LitElement } from 'lit';
import { FocusMixin } from '@brightspace-ui/core/mixins/focus/focus-mixin.js';
import { LocalizeNavigationElement } from './components/localize-navigation-element.js';
import { querySelectorComposed } from '@brightspace-ui/core/helpers/dom.js';

class NavigationSkipMain extends FocusMixin(LocalizeNavigationElement(LitElement)) {

	static get focusElementSelector() {
		return 'd2l-navigation-skip';
	}

	render() {
		return html`<d2l-navigation-skip text="${this.localize('skipNav')}" @click="${this._handleSkipNav}" class="vdiff-target"></d2l-navigation-skip>`;
	}

	_handleSkipNav() {
		const elem = querySelectorComposed(document, 'main') ||
			querySelectorComposed(document, '[role="main"]') ||
			querySelectorComposed(document, 'h1');
		if (elem) {
			elem.tabIndex = -1;
			elem.focus();
		} else {
			this.dispatchEvent(new CustomEvent('d2l-navigation-skip-fail', { bubbles: false, composed: false }));
		}
	}

}

customElements.define('d2l-navigation-skip-main', NavigationSkipMain);
