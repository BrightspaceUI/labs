import '@brightspace-ui/core/components/expand-collapse/expand-collapse-content.js';
import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-ui/core/components/icons/icon.js';
import { css, html, LitElement, nothing } from 'lit';
import { findComposedAncestor, isComposedAncestor } from '@brightspace-ui/core/helpers/dom.js';
import { offscreenStyles } from '@brightspace-ui/core/components/offscreen/offscreen.js';

class LabsAccordionCollapse extends LitElement {
	static get properties() {
		return {
			/**
			 * Label title
			 */
			title: { type: String },
			/**
			 * Label. Does not apply title to entire accordion
			 */
			label: { type: String },
			/**
			 * Header text hidden on the screen, but to be read by a screen reader
			 */
			screenReaderHeaderText: { type: String, attribute: 'screen-reader-header-text' },
			/**
			 * Corresponds to the iron-collapse's noAnimation property.
			 */
			noAnimation: { type: Boolean, attribute: 'no-animation' },
			/**
			 * Whether currently expanded.
			 */
			opened: { type: Boolean, reflect: true },
			/**
			 * The icon when collapsed.
			 */
			expandIcon: { type: String, attribute: 'expand-icon' },
			/**
			 * The icon when expanded.
			 */
			collapseIcon: { type: String, attribute: 'collapse-icon' },
			/**
			 * Whether to hide the expand/collapse icon.
			 */
			noIcons: { type: Boolean, attribute: 'no-icons' },
			/**
			 * Whether or not to use flex layout.
			 */
			flex: { type: Boolean, reflect: true },
			/**
			 * Whether or not to add extra padding for icon.
			 */
			iconHasPadding: { type: Boolean, attribute: 'icon-has-padding', reflect: true },
			/**
			 * Whether or not to add a border between the header and the content.
			 */
			headerBorder: { type: Boolean, attribute: 'header-border' },
			/**
			 * Whether the accordion's expand/collapse function is disabled.
			 */
			disabled: { type: Boolean, reflect: true },
			/**
			 * Whether or not to disable default focus styles
			 */
			disableDefaultTriggerFocus: { type: Boolean, attribute: 'disable-default-trigger-focus', reflect: true },
			/**
			 * Whether or not the header contains an interactive element inside it (e.g. clickable)
			 */
			headerHasInteractiveContent: { type: Boolean, attribute: 'header-has-interactive-content', reflect: true },
			/**
			 * Listener for state changes.
			 */
			_boundListener: { type: Function, attribute: '_bound-listener' },
			/**
			 * The current state of the accordion (opened, closed)
			 */
			_state: { type: String, reflect: true }
		};
	}

	static get styles() {
		return [offscreenStyles, css`
			:host {
				display: block;
			}
			#interactive-header-content{
				align-items: center;
				display: flex;
			}
			#trigger {
				align-items: center;
				display: flex;
				text-decoration: none;
			}
			#trigger:focus-visible {
				outline-offset: 3px;
			}
			#trigger[data-border] {
				border-bottom: solid 1px var(--d2l-color-corundum);
				margin-bottom: 0.4rem;
				padding-bottom: 0.4rem;
			}
			#trigger, #trigger:visited, #trigger:hover, #trigger:active {
				color: inherit;
			}
			:host([flex]) .collapse-title {
				flex: 1;
        flex-basis: 0.000000001px;
				overflow: hidden;
			}
			:host([icon-has-padding]) d2l-icon {
				padding-left: 1.25rem;
				padding-right: 0;
			}
			:host([icon-has-padding][dir="rtl"]) d2l-icon {
				padding-left: 0;
				padding-right: 1.25rem;
			}
			:host([flex][icon-has-padding]) d2l-icon {
				padding-left: 0;
				padding-right: 1.25rem;
			}
			:host([flex][icon-has-padding][dir="rtl"]) d2l-icon {
				padding-left: 1.25rem;
				padding-right: 0;
			}
			.content {
				height: auto;
				margin: -1px;
				padding: 1px;
				position: relative;
			}
			.summary {
				transition: opacity 500ms ease;
			}
			:host([_state="closing"]) .content,
			:host([_state="opening"]) .content {
				overflow: hidden;
			}
			:host([_state="closed"]) .summary,
			:host([_state="closing"]) .summary {
				transition-delay: 500ms;
			}
			:host([_state="opening"]) .summary,
			:host([_state="opened"]) .summary {
				opacity: 0;
			}
			:host([_state="closing"]) .summary,
			:host([_state="opening"]) .summary,
			:host([_state="opened"]) .summary {
				pointer-events: none;
				position: absolute;
			}
			:host([_state="closing"]) .summary,
			:host([_state="opened"]) .summary {
				transition-property: none;
			}
			:host([disabled]) a {
				cursor: default;
			}
			:host([disabled]) d2l-icon {
				color: var(--d2l-color-chromite);
			}
			:host([disable-default-trigger-focus]) #trigger:focus {
				outline: none;
			}

			:host([header-has-interactive-content]) #header-container {
				display: grid;
				grid-template-columns: auto;
				grid-template-rows: auto;
			}
			:host([header-has-interactive-content]) .header-grid-item {
				grid-column: 1;
				grid-row: 1;
			}
			:host([header-has-interactive-content]) #interactive-header-content {
				cursor: pointer;
			}
		`];
	}

	constructor() {
		super();
		this.title = '';
		this.label = '';
		this.screenReaderHeaderText = '';
		this.noAnimation = false;
		this.opened = false;
		this.expandIcon = 'd2l-tier1:arrow-expand';
		this.collapseIcon = 'd2l-tier1:arrow-collapse';
		this.noIcons = false;
		this.flex = false;
		this.iconHasPadding = false;
		this.headerBorder = false;
		this.disabled = false;
		this.disableDefaultTriggerFocus = false;
		this.headerHasInteractiveContent = false;
		this._state = 'closed';

		this._boundListener = this._onStateChanged.bind(this);
	}
	connectedCallback() {
		super.connectedCallback();
		if (this.disabled) {
			return;
		}
		window.addEventListener('d2l-labs-accordion-collapse-state-changed', this._boundListener);
		if (!this.#resizeObserver) {
			this.#resizeObserver = new ResizeObserver(() => this._fireAccordionResizeEvent());
			this.#resizeObserver.observe(this);
		}
	}
	disconnectedCallback() {
		super.disconnectedCallback();
		if (this.disabled) {
			return;
		}
		window.removeEventListener('d2l-labs-accordion-collapse-state-changed', this._boundListener);
		if (this.#resizeObserver) {
			this.#resizeObserver.disconnect();
			this.#resizeObserver = null;
		}
	}
	render() {
		return html`
			<div id="header-container">
				<a href="javascript:void(0)" id="trigger" ?aria-expanded=${this.opened} class="header-grid-item" aria-controls="collapse" role="button" ?data-border="${this.headerBorder}" @blur=${this._triggerBlur} @click=${this.toggle} @focus=${this._triggerFocus}>
					${!this.headerHasInteractiveContent ? html`
						<div class="collapse-title" title="${this.label}">${this.title}${this.label}<slot name="header"></slot>
						</div>
						${!this.noIcons ? html`
							<d2l-icon icon="${this.opened ? this.collapseIcon : this.expandIcon}"></d2l-icon>
						` : nothing}
					` : html`
						<span class="d2l-offscreen">${this.screenReaderHeaderText}</span>
					`}
				</a>
				${this.headerHasInteractiveContent ? html`
					<div id="interactive-header-content" class="header-grid-item" @click=${this.toggle}>
						<div class="collapse-title" title="${this.label}">${this.title}${this.label}<slot name="header"></slot>
						</div>
						${!this.noIcons ? html`
							<d2l-icon icon="${this.opened ? this.collapseIcon : this.expandIcon}"></d2l-icon>
						` : nothing}
					</div>
				` : nothing}
			</div>

			<div class="content">
				<d2l-expand-collapse-content ?expanded=${this.opened} @d2l-expand-collapse-content-expand=${this._handleExpand} @d2l-expand-collapse-content-collapse=${this._handleCollapse}>
					<slot></slot>
				</d2l-expand-collapse-content>
				<div class="summary">
					<slot name="summary"></slot>
				</div>
			</div>

		`;
	}
	updated(changedProperties) {
		super.updated(changedProperties);
		if (changedProperties.has('_state')) {
			const content = this.shadowRoot.querySelector('.content');
			if (this._state === 'opening') {
				content.style.minHeight = `${content.offsetHeight - 2}px`;
			}
			if (this._state === 'closed') {
				content.style.removeProperty('min-height');
			}
		}
	}
	willUpdate(changedProperties) {
		super.willUpdate(changedProperties);
		if (changedProperties.has('opened')) {
			this.dispatchEvent(new CustomEvent('opened-changed',
				{ bubbles: true, composed: true, detail: { value: this.opened } }
			));
			this._notifyStateChanged(this.opened);
		}

	}
	close() {
		if (this.disabled) {
			return;
		}
		this.opened = false;
		this._notifyStateChanged();
	}
	open() {
		if (this.disabled) {
			return;
		}
		this.opened = true;
		this._notifyStateChanged();
	}
	toggle() {
		this.dispatchEvent(new CustomEvent('d2l-labs-accordion-collapse-clicked'));
		if (this.disabled) {
			return;
		}
		if (this.opened) {
			this.close();
		} else {
			this.open();
		}
	}
	#resizeObserver;

	_fireAccordionResizeEvent() {
		const event = new CustomEvent('d2l-labs-accordion-collapse-resize', {
			bubbles: true
		});
		window.dispatchEvent(event);
	}

	_handleCollapse(e) {
		this._state = 'closing';
		e.detail.collapseComplete.then(() => this._state = 'closed');
	}

	_handleExpand(e) {
		this._state = 'opening';
		e.detail.expandComplete.then(() => this._state = 'opened');
	}

	_haveSharedAutoCloseAccordionAncestor(node1, node2) {
		const accordionAncestor = findComposedAncestor(node1, (elem) => {
			if (elem.isAccordion && elem.autoClose) {
				return true;
			}
		});
		if (!accordionAncestor) {
			return false;
		}
		if (!isComposedAncestor(accordionAncestor, node2)) {
			return false;
		}
		return true;
	}

	_notifyStateChanged() {
		if (this.opened) {
			this.dispatchEvent(new CustomEvent('d2l-labs-accordion-collapse-state-opened'));
		}
		this.dispatchEvent(new CustomEvent(
			'd2l-labs-accordion-collapse-state-changed', {
				bubbles: true,
				composed: true,
				detail: { opened: this.opened, el: this }
			}
		));
	}

	_onStateChanged(event) {
		if (this.opened
			&& event.detail.el !== this
			&& this._haveSharedAutoCloseAccordionAncestor(this, event.detail.el)
		) {
			/* close an opened child */
			if (!event.detail.opened
				&& isComposedAncestor(event.detail.el, this)
			) {
				this.opened = false;
			}
			/* close an opened sibling */
			if (event.detail.opened
				&& !isComposedAncestor(event.detail.el, this)
				&& !isComposedAncestor(this, event.detail.el)
			) {
				this.opened = false;
			}
		}
	}

	_triggerBlur() {
		this.dispatchEvent(new CustomEvent('d2l-labs-accordion-collapse-toggle-blur'));
	}

	_triggerFocus() {
		this.dispatchEvent(new CustomEvent('d2l-labs-accordion-collapse-toggle-focus'));
	}
}

customElements.define('d2l-labs-accordion-collapse', LabsAccordionCollapse);
