import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-ui/core/components/expand-collapse/expand-collapse-content.js';
import '@brightspace-ui/core/components/inputs/input-checkbox.js';
import '@brightspace-ui/core/components/icons/icon.js';
import { css, html, LitElement } from 'lit';
import { bodyCompactStyles } from '@brightspace-ui/core/components/typography/styles.js';
import { LocalizeLabsElement } from '../localize-labs-element.js';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin.js';

class CheckboxDrawer extends LocalizeLabsElement(SkeletonMixin(LitElement)) {

	static get properties() {
		return {
			checked: { type: Boolean },
			description: { type: String },
			label: { type: String },
			readOnly: { type: Boolean, attribute: 'read-only' },
			_expandCollapseBusy: { state: true }
		};
	}

	static get styles() {
		return [super.styles, bodyCompactStyles, css`
			:host {
				display: block;
			}

			.d2l-input-checkbox {
				margin-bottom: 0;
			}

			.d2l-input-read-only-label {
				display: inline-block;
				margin-left: 0.5rem;
			}
		`];
	}

	constructor() {
		super();
		this.checked = false;
		this._expandCollapseBusy = false;
	}

	render() {
		return html`
			${this.readOnly ? html `
				<d2l-icon class="d2l-skeletize" icon="${this.checked ? 'tier1:check' : 'tier1:close-default'}"></d2l-icon>
				<div class="d2l-body-compact d2l-input-read-only-label d2l-skeletize">${this.label}</div>
			` : html`
				<d2l-input-checkbox
					?checked="${this.checked}"
					class="d2l-input-checkbox"
					?skeleton="${this.skeleton}"
					description=${this.localize(`components:checkboxDrawer:checkbox${this.checked ? 'Expanded' : 'Collapsed'}`)}
					@change="${this._onCheckboxChange}">
					${this.label}
					<div slot="inline-help">${this.description}</div>
					<d2l-expand-collapse-content slot="supporting" ?expanded="${this.checked}" aria-busy=${this._expandCollapseBusy ? 'true' : 'false'} @d2l-expand-collapse-content-expand="${this._onExpandCollapseContentToggled}" @d2l-expand-collapse-content-collapse="${this._onExpandCollapseContentToggled}">
						<slot></slot>
					</d2l-expand-collapse-content>
				</d2l-input-checkbox>
			`}
		`;
	}

	_onCheckboxChange(e) {
		this.checked = e.target.checked;

		this.dispatchEvent(
			new CustomEvent('d2l-labs-checkbox-drawer-checked-change', {
				bubbles: true,
				composed: false,
				detail: { checked: this.checked }
			})
		);
	}

	async _onExpandCollapseContentToggled(e) {
		const action = e.target.expanded ? 'expandComplete' : 'collapseComplete';
		const eventName = e.target.expanded ? 'd2l-labs-checkbox-drawer-expand' : 'd2l-labs-checkbox-drawer-collapse';

		this.dispatchEvent(
			new CustomEvent(eventName, {
				bubbles: true,
				composed: false,
				detail: e.detail
			})
		);

		this._expandCollapseBusy = true;
		await e.detail[action];
		this._expandCollapseBusy = false;
	}
}

customElements.define('d2l-labs-checkbox-drawer', CheckboxDrawer);
