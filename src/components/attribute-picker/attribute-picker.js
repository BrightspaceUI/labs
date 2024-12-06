import './attribute-picker-item.js';
import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-ui/core/components/tooltip/tooltip.js';
import { css, html, LitElement } from 'lit';
import { ArrowKeysMixin } from '@brightspace-ui/core/mixins/arrow-keys/arrow-keys-mixin.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { inputStyles } from '@brightspace-ui/core/components/inputs/input-styles.js';
import { LocalizeLabsElement } from '../localize-labs-element.js';
import { repeat } from 'lit/directives/repeat.js';
const keyCodes = {
	ENTER: 13,
	ESCAPE: 27,
	BACKSPACE: 8,
	LEFT: 37,
	RIGHT: 39,
	UP: 38,
	DOWN: 40,
	DELETE: 46
};

class AttributePicker extends ArrowKeysMixin(LocalizeLabsElement(LitElement)) {
	static get properties() {
		return {
			/* When true, the user can manually enter any attribute they wish. If false, they must match a value from the dropdown. */
			allowFreeform: { type: Boolean, attribute: 'allow-freeform', reflect: true },

			/* An array of strings available in the dropdown list */
			assignableAttributes: { type: Array, attribute: 'assignable-attributes', reflect: true },

			/* An array of strings representing the attributes currently selected in the picker */
			attributeList: { type: Array, attribute: 'attribute-list', reflect: true },

			/*
				The text that will appear in the tooltip that informs a user that the state is invalid
				The default value is: 'At least one attribute must be set'
			*/
			invalidTooltipText: { type: String, attribute: 'invalid-tooltip-text', reflect: true },

			/* Required. The label associated with the attribute picker for screen reader users */
			label: { type: String, reflect: true },

			/* The maximum number of attributes permitted. */
			limit: { type: Number, attribute: 'limit', reflect: true },

			/* When true, an error state will appear if no attributes are set */
			required: { type: Boolean, attribute: 'required', reflect: true },

			/* Represents the index of the currently focused attribute. If no attribute is focused, equals -1 */
			_activeAttributeIndex: { state: true },

			/* Represents the index of the currently focused dropdown list item. If no item is focused, equals -1 */
			_dropdownIndex: { state: true },

			/* When true, the user currently has focus within the component */
			_hasFocus: { state: true },

			/* When true, the user has yet to lose focus for the first time, meaning the validation won't be shown until they've lost focus for the first time */
			_initialFocus: { state: true },

			/* When true, the user currently has focus within the input */
			_inputFocused: { state: true },

			/* When true, the user has reached the limit of attributes that can be added */
			_limitReached: { state: true },

			/* The inner text of the input */
			_text: { state: true }
		};
	}

	static get styles() {
		return [inputStyles, css`
			:host {
				display: inline-block;
				font-size: 0.8rem;
				width: 100%;
			}
			:host:disabled {
				opacity: 0.5;
			}
			:host([hidden]) {
				display: none;
			}
			.d2l-attribute-picker-container {
				padding: 5px;
			}
			.d2l-attribute-picker-container:hover,
			.d2l-attribute-picker-container:focus-within {
				padding: 4px;
			}
			.d2l-attribute-picker-container:focus-within {
				border: 2px solid var(--d2l-color-celestine);
			}
			[aria-invalid="true"].d2l-attribute-picker-container:focus-within {
				border-color: var(--d2l-color-cinnabar);
			}
			.d2l-attribute-picker-content {
				display: flex;
				flex-wrap: wrap;
				gap: 0.2rem;
			}
			.d2l-attribute-picker-attribute {
				height: 1.55rem;
			}
			.d2l-attribute-picker-attribute:focus-visible {
				outline: none;
			}
			.d2l-attribute-picker-input {
				background: transparent;
				border: none;
				box-shadow: none;
				box-sizing: border-box;
				flex-grow: 1;
				min-height: 1.55rem;
				outline: none;
				padding: 0 !important;
				width: 4rem;
			}
			.d2l-attribute-list {
				background-color: white;
				border: 1px solid var(--d2l-color-gypsum);
				border-radius: 0.3rem;
				max-height: 7.8rem;
				overflow-y: auto;
				padding-left: 0;
				text-overflow: ellipsis;
			}
			.d2l-attribute-picker-li {
				cursor: pointer;
				margin: 0;
				padding: 0.4rem 6rem 0.4rem 0.6rem;
			}
			.d2l-attribute-picker-li[aria-selected="true"] {
				background-color: var(--d2l-color-celestine-plus-2);
				color: var(--d2l-color-celestine);
			}
			.d2l-attribute-picker-absolute-container {
				margin: 0 0.3rem 0 -0.3rem;
				position: absolute;
				width: 100%;
				z-index: 1;
			}
			.d2l-input-text-invalid-icon {
				background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjIiIGhlaWdodD0iMjIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgIDxwYXRoIGZpbGw9IiNGRkYiIGQ9Ik0wIDBoMjJ2MjJIMHoiLz4KICAgIDxwYXRoIGQ9Ik0xOC44NjQgMTYuNDdMMTIuNjIzIDMuOTg5YTEuNzgzIDEuNzgzIDAgMDAtMy4xOTIgMEwzLjE4OSAxNi40N2ExLjc2MSAxLjc2MSAwIDAwLjA4IDEuNzNjLjMyNS41MjUuODk4Ljc5OCAxLjUxNi43OTloMTIuNDgzYy42MTggMCAxLjE5Mi0uMjczIDEuNTE2LS44LjIzNy0uMzM1LjI2NS0xLjM3LjA4LTEuNzN6IiBmaWxsPSIjQ0QyMDI2IiBmaWxsLXJ1bGU9Im5vbnplcm8iLz4KICAgIDxwYXRoIGQ9Ik0xMS4wMjcgMTcuMjY0YTEuMzM3IDEuMzM3IDAgMTEwLTIuNjc1IDEuMzM3IDEuMzM3IDAgMDEwIDIuNjc1ek0xMS45IDEyLjk4YS44OTIuODkyIDAgMDEtMS43NDcgMEw5LjI3IDguNTJhLjg5Mi44OTIgMCAwMS44NzQtMS4wNjRoMS43NjhhLjg5Mi44OTIgMCAwMS44NzQgMS4wNjVsLS44ODYgNC40NTh6IiBmaWxsPSIjRkZGIi8+CiAgPC9nPgo8L3N2Zz4K");
				display: flex;
				height: 22px;
				inset-inline-end: 8px;
				position: absolute;
				top: 50%;
				transform: translateY(-50%);
				width: 22px;
			}
		`];
	}

	constructor() {
		super();
		this.attributeList = [];
		this.assignableAttributes = [];
		this._text = '';
		this._activeAttributeIndex = -1;
		this._dropdownIndex = -1;
		this._initialFocus = true;
		this.arrowKeysNoWrap = true;
		this.arrowKeysDirection = 'leftrightupdown';
		this._inputFocused = false;
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		this.addEventListener('focusin', this._onFocusIn);
		this.addEventListener('focusout', this._onFocusOut);
	}

	render() {
		const comparableText = this._text.trim().toLowerCase();
		const availableAttributes = this.assignableAttributes.filter(x => this.attributeList.every(a => a.name !== x.name) && (comparableText === '' || x.name?.toLowerCase().includes(comparableText)));

		const isValid = this._initialFocus || !this.required || this.attributeList.length;
		const ariaInvalid = !isValid ? true : undefined;
		const ariaRequired = this.required ? true : undefined;

		return html`
			<div role="application" id="d2l-attribute-picker-container" aria-label="${this.label}" class="d2l-attribute-picker-container d2l-input" aria-invalid="${ifDefined(ariaInvalid)}">
				${this.arrowKeysContainer(html`
					<div class="d2l-attribute-picker-content" role="${this.attributeList.length > 0 ? 'list' : ''}">
						${repeat(this.attributeList, (item) => item.value, (item, index) => html`
							<d2l-labs-attribute-picker-item class="d2l-attribute-picker-attribute d2l-arrowkeys-focusable"
								role="listitem"
								text="${item.name}"
								.index="${index}"
								?deletable="${this._hasFocus}"
								@d2l-labs-attribute-picker-item-deleted="${this._onAttributeRemoved}"
								@focus="${this._onAttributeFocus}"
								@keydown="${this._onAttributeKeydown}">
							</d2l-labs-attribute-picker-item>
						`)}

						<input class="d2l-attribute-picker-input d2l-arrowkeys-focusable"
							role="combobox"
							aria-activedescendant="${this._dropdownIndex > -1 ? `attribute-dropdown-list-item-${this._dropdownIndex}` : ''}"
							aria-autocomplete="list"
							aria-expanded="${this._inputFocused}"
							aria-haspopup="true"
							aria-invalid="${ifDefined(ariaInvalid)}"
							aria-label="${this.label}"
							aria-owns="attribute-dropdown-list"
							aria-required=${ifDefined(ariaRequired)}
							enterkeyhint="enter"
							@blur="${this._onInputBlur}"
							@focus="${this._onInputFocus}"
							@keydown="${this._onInputKeydown}"
							@input="${this._onInputTextChanged}"
							type="text"
							.value="${this._text}">

						${(!isValid && !this._inputFocused) ? html`<div class="d2l-input-text-invalid-icon" @click="${this._handleInvalidIconClick}"></div>` : null}
					</div>
				`)}

				<div class="d2l-attribute-picker-absolute-container">
					<ul class="d2l-attribute-list"
						role="listbox"
						id="attribute-dropdown-list"
						?hidden="${!this._inputFocused || !availableAttributes.length}">

						${repeat(availableAttributes, (item) => item.name, (item, listIndex) => html`
							<li id="attribute-dropdown-list-item-${listIndex}"
								class="d2l-attribute-picker-li"
								role="option"
								aria-label="${this.localize('components:attributePicker:addValue', 'value', item.name)}"
								aria-selected="${this._dropdownIndex === listIndex}"
								.text="${item}"
								.index=${listIndex}
								@mousemove="${this._onListItemMouseMove}"
								@mousedown="${this._onListItemTapped}">
								${item.name}
							</li>
						`)}
					</ul>
				</div>
			</div>

			${!isValid ? html`
				<d2l-tooltip for="d2l-attribute-picker-container" state="error" announced position="top" ?force-show=${this._inputFocused}>${this.invalidTooltipText || this.localize('components:attributePicker:minimumRequirement')}</d2l-tooltip>
			` : null}

			${this.limit && this._limitReached ? html`
				<d2l-tooltip for="d2l-attribute-picker-container" position="top" ?force-show=${this._inputFocused}>${this.localize('components:attributePicker:limitReached', { value: this.limit })}</d2l-tooltip>
			` : null}
		`;
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		if (changedProperties.has('_activeAttributeIndex')) {
			const selectedAttributes = this.shadowRoot.querySelectorAll('.d2l-attribute-picker-attribute');
			if (this._activeAttributeIndex >= 0 && this._activeAttributeIndex < selectedAttributes.length) {
				selectedAttributes[this._activeAttributeIndex].focus();
			}
		}

		if (changedProperties.has('assignableAttributes')) {
			this._dropdownIndex = -1;
		}
	}

	// Returns true or false depending on if the attribute was successfully added. Fires the d2l-attribute-limit-reached event, if necessary.
	async addAttribute(newAttribute) {
		if (!newAttribute || this.attributeList.findIndex(attribute => attribute.name === newAttribute.name) >= 0) return false;

		this._limitReached = this.limit && this.attributeList.length >= this.limit;
		if (this._limitReached) {
			this.dispatchEvent(new CustomEvent('d2l-labs-attribute-picker-limit-reached', {
				bubbles: true, composed: true, detail: { limit: this.limit }
			}));
			return false;
		}

		this.attributeList = [...this.attributeList, newAttribute];
		this._text = '';

		// Wait until we can get the full list of available list items after clearing the text
		await this.updateComplete;
		const list = this.shadowRoot.querySelectorAll('li');

		// If we removed the final index of the list, move our index back to compensate
		if (this._dropdownIndex > -1 && this._dropdownIndex > list.length - 1) {
			this._dropdownIndex --;
		}

		this._dispatchAttributeChangedEvent();
		return true;
	}

	clearText() {
		this._text = '';
	}

	_dispatchAttributeChangedEvent() {
		this.dispatchEvent(new CustomEvent('d2l-labs-attribute-picker-attributes-changed', {
			bubbles: true, composed: true, detail: { attributeList: this.attributeList }
		}));
	}

	_focusAttribute(index) {
		index = Math.min(index, this.attributeList.length - 1);
		const selectedAttributes = this.shadowRoot.querySelectorAll('d2l-labs-attribute-picker-item');
		if (selectedAttributes.length === 0) {
			this.shadowRoot.querySelector('.d2l-attribute-picker-input').focus();
		} else {
			this._activeAttributeIndex = index;
			selectedAttributes[index].focus();
		}
	}

	_handleInvalidIconClick() {
		const input = this.shadowRoot.querySelector('input');
		if (!input) return;
		this._inputFocused = true;
		input.focus();
	}

	_onAttributeFocus(e) {
		this._activeAttributeIndex = e.target.index;
	}

	async _onAttributeKeydown(e) {
		if (e.keyCode === keyCodes.BACKSPACE || e.keyCode === keyCodes.DELETE) {
			await this._removeAttribute(this._activeAttributeIndex);
			if ((e.keyCode === keyCodes.BACKSPACE && this._activeAttributeIndex > 0)) {
				this._activeAttributeIndex--;
			}
			this._focusAttribute(this._activeAttributeIndex);
		}
		if ((e.keyCode === keyCodes.DOWN || e.keyCode === keyCodes.RIGHT) && this._activeAttributeIndex === this.attributeList.length - 1) {
			this.shadowRoot.querySelector('.d2l-attribute-picker-input').focus();
		}
	}

	async _onAttributeRemoved(e) {
		const index = e.target.index;
		if (index !== -1) {
			await this._removeAttribute(index);
			this._focusAttribute(index);
			this._activeAttributeIndex = Math.min(index, this.attributeList.length - 1);
		}
	}

	_onFocusIn() {
		this._hasFocus = true;
	}

	_onFocusOut() {
		this._hasFocus = false;
	}

	_onInputBlur() {
		this._inputFocused = false;
		this._initialFocus = false;
	}

	_onInputFocus() {
		this._inputFocused = true;
		this._dropdownIndex = this.shadowRoot.querySelector('li') && !this.allowFreeform ? 0 : -1;
	}

	async _onInputKeydown(e) {
		if (this.shadowRoot.querySelector('.d2l-attribute-picker-input').selectionStart !== 0 || e.keyCode === keyCodes.RIGHT || e.keyCode === keyCodes.UP || e.keyCode === keyCodes.DOWN) {
			e.stopPropagation();

		}
		switch (e.keyCode) {
			case keyCodes.ESCAPE: {
				if (this.allowFreeform) { // Unselect any dropdown item so enter will apply to just the typed text instead
					this._dropdownIndex = -1;
				}
				break;
			}
			case keyCodes.BACKSPACE: {
				if (this.shadowRoot.querySelector('.d2l-attribute-picker-input').selectionStart === 0 && this.attributeList.length > 0) {
					e.stopPropagation();
					this._focusAttribute(this.attributeList.length - 1);
				}
				break;
			}
			case keyCodes.UP: {
				const assignableCount = this.shadowRoot.querySelectorAll('li').length;
				if (this._dropdownIndex === -1 || this._dropdownIndex === 0) {
					this._dropdownIndex = assignableCount - 1;
				} else {
					this._dropdownIndex = (this._dropdownIndex - 1) % assignableCount;
				}
				await this._updateDropdownFocus();
				break;
			}
			case keyCodes.DOWN: {
				const assignableCount = this.shadowRoot.querySelectorAll('li').length;
				this._dropdownIndex = (this._dropdownIndex + 1) % assignableCount;
				await this._updateDropdownFocus();
				break;
			}
			case keyCodes.ENTER: {
				const list = this.shadowRoot.querySelectorAll('li');
				if (this._dropdownIndex !== -1 && this._dropdownIndex < list.length) {
					await this.addAttribute(list[this._dropdownIndex].text);
				} else if (this.allowFreeform) {
					const trimmedAttribute = this._text.trim();
					if (trimmedAttribute.length === 0) return;

					const comparableAttribute = trimmedAttribute.toLowerCase();
					if (this.attributeList.map(a => a.name.toLowerCase()).includes(comparableAttribute)) return;

					const matchedIndex = this.assignableAttributes.findIndex(a => a.name.toLowerCase() === comparableAttribute);
					await this.addAttribute(matchedIndex >= 0 ? this.assignableAttributes[matchedIndex] : {
						name: trimmedAttribute,
						value: trimmedAttribute
					});
				}
				await this._updateDropdownFocus();
				break;
			}
		}
	}

	_onInputTextChanged(e) {
		this._text = e.target.value;
		if (this._dropdownIndex >= 0) {
			this.allowFreeform ? this._dropdownIndex = -1 : this._dropdownIndex = 0;
		}
	}

	_onListItemMouseMove(e) {
		this._dropdownIndex = e.target.index;
	}

	async _onListItemTapped(e) {
		await this.addAttribute(e.target.text);
		e.preventDefault();
	}

	async _removeAttribute(index) {
		this.attributeList = this.attributeList.slice(0, index).concat(this.attributeList.slice(index + 1, this.attributeList.length));
		this._dispatchAttributeChangedEvent();
		this._limitReached = this.limit && this.attributeList.length >= this.limit;
		await this.updateComplete;
	}

	async _updateDropdownFocus() {
		await this.updateComplete;
		const items = this.shadowRoot.querySelectorAll('li');
		if (items.length > 0 && this._dropdownIndex >= 0) {
			items[this._dropdownIndex].scrollIntoView({ block: 'nearest' });
		}
	}
}
customElements.define('d2l-labs-attribute-picker', AttributePicker);
