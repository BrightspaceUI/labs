// Delete this file once core#4001 is merged.
// https://github.com/BrightspaceUI/core/pull/4001
import '@brightspace-ui/core/components/colors/colors';
import '@brightspace-ui/core/components/icons/icon.js';
import { css, html, LitElement, nothing, unsafeCSS } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { FocusMixin } from '@brightspace-ui/core/mixins/focus/focus-mixin.js';
import { getFocusPseudoClass } from '@brightspace-ui/core/helpers/focus.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { LocalizeCoreElement } from '@brightspace-ui/core/helpers/localize-core-element.js';
import { offscreenStyles } from '@brightspace-ui/core/components/offscreen/offscreen.js';
import { styleMap } from 'lit/directives/style-map.js';

export const linkStyles = css`
	.d2l-link, .d2l-link:visited, .d2l-link:active, .d2l-link:link {
		color: var(--d2l-color-celestine);
		cursor: pointer;
		outline-style: none;
		text-decoration: none;
	}
	:host([skeleton]) .d2l-link.d2l-skeletize::before {
		bottom: 0.2rem;
		top: 0.2rem;
	}
	.d2l-link:hover {
		color: var(--d2l-color-celestine-minus-1);
		text-decoration: underline;
	}
	.d2l-link:${unsafeCSS(getFocusPseudoClass())} {
		border-radius: 2px;
		outline: 2px solid var(--d2l-color-celestine);
		outline-offset: 1px;
		text-decoration: underline;
	}
	.d2l-link.d2l-link-main {
		font-weight: 700;
	}
	.d2l-link.d2l-link-small {
		font-size: 0.7rem;
		letter-spacing: 0.01rem;
		line-height: 1.05rem;
	}
	:host([skeleton]) .d2l-link.d2l-link-small.d2l-skeletize::before {
		bottom: 0.15rem;
		top: 0.15rem;
	}
	@media print {
		.d2l-link, .d2l-link:visited, .d2l-link:active, .d2l-link:link {
			color: var(--d2l-color-ferrite);
		}
	}
`;

/**
 * This component can be used just like the native anchor tag.
 * @slot - The content (e.g., text) that when selected causes navigation
 */
class Link extends LocalizeCoreElement(FocusMixin(LitElement)) {

	static get properties() {
		return {
			/**
			 * Sets an accessible label
			 * @type {string}
			 */
			ariaLabel: { type: String, attribute: 'aria-label' },
			/**
			 * Download a URL instead of navigating to it
			 * @type {boolean}
			 */
			download: { type: Boolean },
			/**
			 * REQUIRED: URL or URL fragment of the link
			 * @type {string}
			 */
			href: { type: String },
			/**
			 * Whether to apply the "main" link style
			 * @type {boolean}
			 */
			main: { type: Boolean, reflect: true },
			/**
			 * The number of lines to display before truncating text with an ellipsis. The text will not be truncated unless a value is specified.
			 * @type {number}
			 */
			lines: { type: Number },
			/**
			 * Whether to apply the "small" link style
			 * @type {boolean}
			 */
			small: { type: Boolean, reflect: true },
			/**
			 * Where to display the linked URL
			 * @type {string}
			 */
			target: { type: String },
			/**
			 * Whether to display the open in new window icon
			 * @type {boolean}
			 */
			newWindow: { type: Boolean, attribute: 'new-window' }
		};
	}

	static get styles() {
		return [ linkStyles, offscreenStyles,
			css`
				:host {
					display: inline;
				}
				:host([hidden]) {
					display: none;
				}
				:host([small]) {
					/* needed to keep host element same height as link */
					font-size: 0.7rem;
					line-height: 1.05rem;
				}
				a {
					display: inherit;
				}
				a.truncate {
					-webkit-box-orient: vertical;
					display: -webkit-box;
					overflow: hidden;
					overflow-wrap: anywhere;
				}
				d2l-icon.d2l-new-window {
					color: var(--d2l-color-celestine);
					vertical-align: inherit;
				}

				:host([small]) d2l-icon.d2l-new-window {
					height: 14px;
					width: 14px;
				}

				@media print {
					d2l-icon.d2l-new-window {
						display: none;
					}
				}
			`
		];
	}

	constructor() {
		super();
		this.download = false;
		this.main = false;
		this.small = false;
		this.lines = 0;
		this.newWindow = false;
	}

	static get focusElementSelector() {
		return '.d2l-link';
	}

	render() {
		const linkClasses = {
			'd2l-link': true,
			'd2l-link-main': this.main,
			'd2l-link-small': this.small,
			'truncate': this.lines > 0
		};
		const styles = (this.lines > 0) ? { '-webkit-line-clamp': this.lines } : {};
		const target = this.newWindow && this.target === undefined
			? '_blank'
			: this.target;
		/* eslint-disable @stylistic/indent */
		return html`
			<a
				aria-label="${ifDefined(this.ariaLabel)}"
				class="${classMap(linkClasses)}"
				style="${styleMap(styles)}"
				?download="${this.download}"
				href="${ifDefined(this.href)}"
				target="${ifDefined(target)}"
			>
				<span style="white-space: nowrap;">
					<span style="white-space: normal;"><slot></slot></span>${this.newWindow ? html`&nbsp;<d2l-icon class="d2l-new-window" icon="tier1:new-window"></d2l-icon>`
					: nothing}
					${target === '_blank' ? html`<span class="d2l-offscreen">${this.localize('components.link.open-in-new-window')}</span>`
					: nothing}
				</span>
			</a>`;
	}
	/* eslint-enable @stylistic/indent */

}
customElements.define('d2l-labs-link-temp', Link);
