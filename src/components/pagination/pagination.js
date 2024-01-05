import '@brightspace-ui/core/components/button/button-icon.js';
import '@brightspace-ui/core/components/inputs/input-number.js';
import '@brightspace-ui/core/components/inputs/input-text.js';
import { css, html, LitElement } from 'lit';
import { LocalizeLabsElement } from '../localize-labs-element.js';
import { RtlMixin } from '@brightspace-ui/core/mixins/rtl-mixin.js';
import { selectStyles } from '@brightspace-ui/core/components/inputs/input-select-styles.js';

class Pagination extends RtlMixin(LocalizeLabsElement(LitElement)) {

	static get properties() {
		return {
			pageNumber: { type: Number, attribute: 'page-number', reflect: true },
			maxPageNumber: { type: Number, attribute: 'max-page-number', reflect: true },
			showItemCountSelect : { type: Boolean, attribute: 'show-item-count-select', reflect: true },
			itemCountOptions : { type: Array, attribute: 'item-count-options' },
			selectedCountOption : { type: Number, attribute: 'selected-count-option', reflect: true },
		};
	}

	static get styles() {
		return [selectStyles, css`
			:host {
				align-items: center;
				display: flex;
				justify-content: center;
				white-space: nowrap;
			}

			.d2l-page-selector-container {
				margin: 0.75rem;
			}

			.d2l-page-number {
				margin-left: 0.25rem;
				margin-right: 0.25rem;
				width: 4rem;
			}

			.d2l-page-max-text {
				margin-right: 0.25rem;
			}

			@media (max-width: 544px) {
				:host {
					flex-direction: column-reverse;
				}
			}
		`];
	}

	constructor() {
		super();
		this.pageNumber = 1;
		this.maxPageNumber = 1;
		this.itemCountOptions = [10, 20, 30, 40];
	}

	render() {
		return html`
			<div class="d2l-page-selector-container">
				<d2l-button-icon id="d2l-labs-pagination-previous-button" icon="tier1:chevron-left" @click="${this._onPreviousClicked}" text="${this.localize('components:pagination:previousPage')}" ?disabled=${this._isFirstPage()}></d2l-button-icon>

				<d2l-input-number
					class="d2l-page-number"
					autocomplete="off"
					label="${this.localize('components:pagination:currentPage', { pageNumber: this.pageNumber, maxPageNumber: this.maxPageNumber })}"
					label-hidden
					max-fraction-digits="0"
					value="${this.pageNumber}"
					@change=${this._onPageNumberChanged}>
				</d2l-input-number>
				<!-- Note: this uses a division slash rather than a regular slash -->
				<!-- a11y note: setting aria-hidden to true because info here is covered by input element -->
				<span class="d2l-page-max-text" aria-hidden="true">∕ ${this.maxPageNumber}</span>
				<d2l-button-icon id="d2l-labs-pagination-next-button" icon="tier1:chevron-right" @click="${this._onNextClicked}" text="${this.localize('components:pagination:nextPage')}" ?disabled=${this._isLastPage()}></d2l-button-icon>
			</div>

			${this.showItemCountSelect ? html`
				<select
					class="d2l-input-select"
					aria-label="${this.localize('components:pagination:resultsPerPage')}"
					title="${this.localize('components:pagination:resultsPerPage')}"
					@change="${this._onPageCounterChanged}">
					${this.itemCountOptions.map(item => html`
						<option ?selected="${this.selectedCountOption === item}" value="${item}">${this.localize('components:pagination:amountPerPage', 'count', item)}</option>
					`)}
				</select>
			` : null }
		`;
	}

	_dispatchPageChangeEvent(newPageNumber) {
		this.dispatchEvent(
			new CustomEvent('d2l-labs-pagination-page-change', {
				detail: { page: newPageNumber },
				bubbles: true,
				composed: true
			})
		);
	}

	_isFirstPage() {
		return this.pageNumber <= 1;
	}

	_isLastPage() {
		return this.pageNumber >= this.maxPageNumber;
	}

	_isValidNumber(input) {
		return input >= 1 && input <= this.maxPageNumber && input !== this.pageNumber;
	}

	_onNextClicked() {
		this._dispatchPageChangeEvent(this.pageNumber + 1);
	}

	_onPageCounterChanged(e) {
		this.dispatchEvent(
			new CustomEvent('d2l-labs-pagination-item-counter-change', {
				detail: { itemCount: Number(e.target.value) },
				bubbles: true,
				composed: true
			})
		);
	}

	_onPageNumberChanged(e) {
		if (!this._isValidNumber(e.target.value)) {
			e.target.value = this.pageNumber;
			return;
		}

		this._dispatchPageChangeEvent(Number(e.target.value));
	}

	_onPreviousClicked() {
		this._dispatchPageChangeEvent(this.pageNumber - 1);
	}
}

customElements.define('d2l-labs-pagination', Pagination);
