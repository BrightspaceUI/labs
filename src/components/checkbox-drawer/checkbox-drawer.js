import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-ui/core/components/expand-collapse/expand-collapse-content.js';
import '@brightspace-ui/core/components/inputs/input-checkbox.js';
import '@brightspace-ui/core/components/inputs/input-checkbox-spacer.js';
import '@brightspace-ui/core/components/icons/icon.js';
import { css, html, LitElement } from 'lit';
import { bodyCompactStyles } from '@brightspace-ui/core/components/typography/styles.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { LocalizeLabsElement } from '../localize-labs-element.js';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin.js';

class CheckboxDrawer extends LocalizeLabsElement(SkeletonMixin(LitElement)) {

	static get properties() {
		return {
			ariaLabel: { type: String, attribute: 'aria-label' },
			checked: { type: Boolean },
			description: { type: String },
			label: { type: String },
			readOnly: { type: Boolean, attribute: 'read-only' }
		};
	}

	static get styles() {
		return [super.styles, bodyCompactStyles, css`
			:host {
				display: block;
			}

			.d2l-input-checkbox, .d2l-input-checkbox-spacer {
				margin-bottom: 0;
			}

			.d2l-input-checkbox-description {
				color: var(--d2l-color-tungsten);
				font-size: 0.7rem;
				width: fit-content;
			}

			.d2l-checkbox-content-margin {
				margin-top: 18px;
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
	}

	render() {
		return html`
			${this.readOnly ? html `
				<d2l-icon class="d2l-skeletize" icon="${this.checked ? 'tier1:check' : 'tier1:close-default'}"></d2l-icon>
				<div class="d2l-body-compact d2l-input-read-only-label d2l-skeletize">${this.label}</div>
			` : html`
				<d2l-input-checkbox
					?checked="${this.checked}"
					aria-label="${ifDefined(this.ariaLabel)}"
					class="d2l-input-checkbox"
					?skeleton="${this.skeleton}"
					description=${this.localize(`components:checkboxDrawer:checkbox${this.checked ? 'Expanded' : 'Collapsed'}`)}
					@change="${this._onCheckboxChange}">${this.label}</d2l-input-checkbox>
			`}
			<d2l-input-checkbox-spacer class="d2l-input-checkbox-spacer">
				<div class="d2l-input-checkbox-description d2l-skeletize">${this.description}</div>
			</d2l-input-checkbox-spacer>
			<d2l-input-checkbox-spacer class="d2l-input-checkbox-spacer">
				<d2l-expand-collapse-content @d2l-expand-collapse-content-expand="${this._onExpandCollapseContentToggled}" @d2l-expand-collapse-content-collapse="${this._onExpandCollapseContentToggled}" ?expanded="${this.checked}">
					<div class="d2l-checkbox-content-margin"></div>
					<slot></slot>
				</d2l-expand-collapse-content>
			</d2l-input-checkbox-spacer>
		`;
	}

	_onCheckboxChange(e) {
		this.checked = e.target.checked;

		this.dispatchEvent(
			new CustomEvent('d2l-checkbox-drawer-checked-change', {
				bubbles: true,
				composed: false,
				detail: { checked: this.checked }
			})
		);
	}

	async _onExpandCollapseContentToggled(e) {
		const action = e.target.expanded ? 'expand' : 'collapse';

		this.dispatchEvent(
			new CustomEvent(`d2l-checkbox-drawer-${action}`, {
				bubbles: true,
				composed: false,
				detail: e.detail
			})
		);

		const content = this.shadowRoot?.querySelector('d2l-expand-collapse-content');
		content.ariaBusy = 'true';
		await e.detail[`${action}Complete`];
		content.ariaBusy = 'false';
	}
}

customElements.define('d2l-labs-checkbox-drawer', CheckboxDrawer);
