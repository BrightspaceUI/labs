import '@brightspace-ui/core/components/button/button-icon.js';
import '@brightspace-ui/core/components/inputs/input-number.js';
import '@brightspace-ui/core/components/inputs/input-text.js';
import { css, html, LitElement } from 'lit';
import { formatNumber } from '@brightspace-ui/intl';
import { LocalizeLabsElement } from '../localize-labs-element.js';
import { RtlMixin } from '@brightspace-ui/core/mixins/rtl-mixin.js';
import { selectStyles } from '@brightspace-ui/core/components/inputs/input-select-styles.js';

class PagerNumeric extends RtlMixin(LocalizeLabsElement(LitElement)) {

	static get properties() {
		return {
			pageNumber: { type: Number, attribute: 'page-number', reflect: true },
			maxPageNumber: { type: Number, attribute: 'max-page-number', reflect: true },
			showPageSizeSelector : { type: Boolean, attribute: 'show-page-size-selector', reflect: true },
			pageSizes : { type: Array, attribute: 'page-sizes' },
			pageSize : { type: Number, attribute: 'page-size', reflect: true },
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

			.d2l-page-number-container {
				direction: ltr;
				display: inline-block;
			}

			d2l-input-number {
				margin-left: 0.25rem;
				margin-right: 0.25rem;
				width: 3.8rem;
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
		this.pageSizes = [10, 20, 30, 40];
	}

	render() {
		return html`
			<div class="d2l-page-selector-container">
				<d2l-button-icon
					id="d2l-labs-pager-numeric-previous-button"
					icon="tier1:chevron-left"
					text="${this.localize('components:pagination:previousPage')}"
					?disabled="${this.pageNumber <= 1}"
					@click="${this._onPreviousClicked}">
				</d2l-button-icon>

				<div class="d2l-page-number-container">
					<d2l-input-number
						autocomplete="off"
						label="${this.localize('components:pagination:currentPage', { pageNumber: this.pageNumber, maxPageNumber: this.maxPageNumber })}"
						label-hidden
						max-fraction-digits="0"
						value="${this.pageNumber}"
						@change="${this._onPageNumberChanged}">
					</d2l-input-number>
					<!-- Note: this uses a division slash rather than a regular slash -->
					<!-- a11y note: setting aria-hidden to true because info here is covered by input element -->
					<span class="d2l-page-max-text" aria-hidden="true">∕ ${formatNumber(this.maxPageNumber)}</span>
				</div>

				<d2l-button-icon
					id="d2l-labs-pager-numeric-next-button"
					icon="tier1:chevron-right"
					text="${this.localize('components:pagination:nextPage')}"
					?disabled="${this.pageNumber >= this.maxPageNumber}"
					@click="${this._onNextClicked}">
				</d2l-button-icon>
			</div>

			${this.showPageSizeSelector ? html`
				<select
					class="d2l-input-select"
					aria-label="${this.localize('components:pagination:resultsPerPage')}"
					title="${this.localize('components:pagination:resultsPerPage')}"
					@change="${this._onPageSizeChanged}">
					${this.pageSizes.map(item => html`
						<option ?selected="${this.pageSize === item}" value="${item}">${this.localize('components:pagination:amountPerPage', 'count', formatNumber(item))}</option>
					`)}
				</select>
			` : null }
		`;
	}

	_dispatchPageChangeEvent(newPageNumber) {
		this.dispatchEvent(
			new CustomEvent('d2l-labs-pager-numeric-page-change', {
				detail: { page: newPageNumber },
				bubbles: true,
				composed: true
			})
		);
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

	_onPageNumberChanged(e) {
		if (!this._isValidNumber(e.target.value)) {
			e.target.value = this.pageNumber;
			return;
		}

		this._dispatchPageChangeEvent(Number(e.target.value));
	}

	_onPageSizeChanged(e) {
		this.dispatchEvent(
			new CustomEvent('d2l-labs-pager-numeric-item-counter-change', {
				detail: { itemCount: Number(e.target.value) },
				bubbles: true,
				composed: true
			})
		);
	}

	_onPreviousClicked() {
		this._dispatchPageChangeEvent(this.pageNumber - 1);
	}
}

customElements.define('d2l-labs-pager-numeric', PagerNumeric);
