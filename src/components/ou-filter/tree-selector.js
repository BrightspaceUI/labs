import './tree-selector-node.js';
import '@brightspace-ui/core/components/button/button-subtle.js';
import '@brightspace-ui/core/components/dropdown/dropdown-button-subtle.js';
import '@brightspace-ui/core/components/dropdown/dropdown-content.js';
import '@brightspace-ui/core/components/dropdown/dropdown.js';
import '@brightspace-ui/core/components/inputs/input-search.js';

import { css, html, LitElement, nothing } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { LocalizeLabsElement } from '../localize-labs-element.js';
import { selectStyles } from '@brightspace-ui/core/components/inputs/input-select-styles';

const MOBILE_BREAKPOINT = 616;
const DROPDOWN_MOBILE_WIDTH = 320;
const DROPDOWN_WIDTH = 368;

/**
 * @property {String} name
 * @property {Boolean} isSearch - if true, show "search-results" slot instead of "tree" slot
 * @property {Boolean} isSelected - if true, show a "Clear" button in the header
 * @fires d2l-labs-tree-selector-search - user requested or cleared a search; search string is event.detail.value
 * @fires d2l-labs-tree-selector-clear - user requested that all selections be cleared
 * @fires d2l-labs-tree-selector-select-all - user requested that all nodes be checked
 */
class TreeSelector extends LocalizeLabsElement(LitElement) {

	static get properties() {
		return {
			name: { type: String },
			disabled: { type: Boolean, attribute: 'disabled' },
			isSelectAllVisible: { type: Boolean, attribute: 'select-all-ui', reflect: true },
			isSearch: { type: Boolean, attribute: 'search', reflect: true },
			isSelected: { type: Boolean, attribute: 'selected', reflect: true },
			_dropdownMinWidth: { type: Number },
			_dropdownMaxWidth: { type: Number },
		};
	}

	static get styles() {
		return [
			selectStyles,
			css`
				:host {
					display: inline-block;
				}
				:host([hidden]) {
					display: none;
				}

				.d2l-labs-filter-dropdown-content-header {
					display: flex;
					justify-content: start;
				}
				.d2l-labs-filter-dropdown-content-header > span {
					align-self: center;
				}

				.d2l-labs-tree-selector-margin-button {
					margin-inline-end: 6px;
				}

				.d2l-labs-tree-selector-margin-auto {
					margin-inline-start: auto;
				}

				.d2l-labs-tree-selector-search {
					display: flex;
					flex-wrap: nowrap;
					padding-bottom: 26px;
					padding-top: 4px;
				}
				@media screen and (max-width: 400px) {
					.d2l-labs-tree-selector-search {
						width: 100%;
					}
				}
				:host([search]) d2l-dropdown d2l-dropdown-content .d2l-labs-tree-selector-tree {
					display: none;
				}

				.d2l-labs-tree-selector-search-results {
					display: none;
				}
				:host([search]) d2l-dropdown d2l-dropdown-content .d2l-labs-tree-selector-search-results {
					display: block;
				}
			`
		];
	}

	constructor() {
		super();

		this.name = 'SPECIFY NAME ATTRIBUTE';
		this._isSearch = false;
		this.isSelectAllVisible = false;
		this.disabled = false;
		this._dropdownMinWidth = DROPDOWN_WIDTH;
		this._dropdownMaxWidth = DROPDOWN_WIDTH;
	}

	/**
	 * @returns {Promise} - resolves when all tree-selector-nodes in slots, recursively, have finished updating
	 */
	get treeUpdateComplete() {
		return this._waitForTreeUpdateComplete();
	}

	render() {
		return html`
			<d2l-dropdown>
				<d2l-dropdown-button-subtle text="${this.name}" ?disabled=${this.disabled} @d2l-dropdown-opener-click="${this._onDropdownOpenerClick}">
					<d2l-dropdown-content align="start" min-width=${this._dropdownMinWidth} max-width=${this._dropdownMaxWidth} mobile-breakpoint=${MOBILE_BREAKPOINT} class="vdiff-target">
						<div class="d2l-labs-filter-dropdown-content-header" slot="header">
							<span>${this.localize('components:ouFilter:treeSelector:filterBy')}</span>

							${this._clearButton}

							${this._selectAllButton}
						</div>
						<div class="d2l-labs-tree-selector-search">
							<d2l-input-search
								label="${this.localize('components:ouFilter:treeSelector:searchLabel')}"
								placeholder="${this.localize('components:ouFilter:treeSelector:searchPlaceholder')}"
								@d2l-input-search-searched="${this._onSearch}"
							></d2l-input-search>
						</div>
						<div class="d2l-labs-tree-selector-search-results">
							<slot name="search-results"></slot>
						</div>
						<div class="d2l-labs-tree-selector-tree">
							<slot name="tree"></slot>
						</div>
					</d2l-dropdown-content>
				</d2l-dropdown-button-subtle>
			</d2l-dropdown>
		`;
	}

	clearSearchAndSelection(generateEvent = true) {
		this.shadowRoot.querySelector('d2l-input-search').value = '';
		this._onSearch({
			detail: {
				value: ''
			}
		}, generateEvent);

		this._onClear(generateEvent);
	}

	// Kept for backwards compatibility – no longer required for layout.
	async resize() {
		await this.treeUpdateComplete;
	}

	simulateSearch(searchString) {
		this._onSearch({
			detail: {
				value: searchString
			}
		});
	}

	get _clearButton() {
		if (!this.isSelected) return nothing;

		const styles = {
			'd2l-labs-tree-selector-select-clear': true,
			'd2l-labs-tree-selector-margin-button': true,
			'd2l-labs-tree-selector-margin-auto': true
		};

		return html`
		<d2l-button-subtle
			class="${classMap(styles)}"
			text="${this.localize('components:ouFilter:treeSelector:clearLabel')}"
			@click="${this._onClear}"
		></d2l-button-subtle>`;
	}

	get _selectAllButton() {
		if (!this.isSelectAllVisible) return nothing;

		const styles = {
			'd2l-labs-tree-selector-select-all': true,
			'd2l-labs-tree-selector-margin-auto': !this.isSelected
		};

		return html`
		<d2l-button-subtle
			class="${classMap(styles)}"
			text="${this.localize('components:ouFilter:treeSelector:selectAllLabel')}"
			@click="${this._onSelectAll}"
		></d2l-button-subtle>`;
	}

	_onClear(generateEvent = true) {
		if (!generateEvent) {
			return;
		}
		/**
		 * @event d2l-labs-tree-selector-clear
		 */
		this.dispatchEvent(new CustomEvent(
			'd2l-labs-tree-selector-clear',
			{
				bubbles: true,
				composed: false
			}
		));
	}

	_onSearch(event, generateEvent = true) {
		if (!generateEvent) {
			return;
		}
		/**
		 * @event d2l-labs-tree-selector-search
		 */
		this.dispatchEvent(new CustomEvent(
			'd2l-labs-tree-selector-search',
			{
				bubbles: true,
				composed: false,
				detail: event.detail
			}
		));
	}

	_onSelectAll() {
		/**
		 * @event d2l-labs-tree-selector-select-all
		 */
		this.dispatchEvent(new CustomEvent(
			'd2l-labs-tree-selector-select-all',
			{
				bubbles: true,
				composed: false
			}
		));
	}

	async _waitForTreeUpdateComplete() {
		await this.updateComplete;
		const slots = [...(this.shadowRoot?.querySelectorAll('slot') || [])];
		// to be sure all child nodes have been added, instead of using flatten,
		// we recursively walk down the tree, waiting for each node's update to complete
		return Promise.all(slots.map(slot => {
			const childNodes = slot.assignedNodes({ flatten: false });
			return Promise.all(childNodes.map(node => node.treeUpdateComplete));
		}));
	}

	_onDropdownOpenerClick() {
		const isMobile = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches;
		this._dropdownMinWidth = isMobile ? DROPDOWN_MOBILE_WIDTH : DROPDOWN_WIDTH;
		this._dropdownMaxWidth = isMobile ? DROPDOWN_MOBILE_WIDTH : DROPDOWN_WIDTH;
	}
}
customElements.define('d2l-labs-tree-selector', TreeSelector);
