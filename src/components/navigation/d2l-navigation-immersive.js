import '@brightspace-ui/core/components/colors/colors.js';
import './d2l-navigation.js';
import './d2l-navigation-link-back.js';
import { css, html, LitElement } from 'lit';
import { bodyCompactStyles } from '@brightspace-ui/core/components/typography/styles.js';
import { classMap } from 'lit/directives/class-map.js';
import { navigationSharedStyle } from './d2l-navigation-shared-styles.js';
import ResizeObserver from 'resize-observer-polyfill/dist/ResizeObserver.es.js';

const mediaQueryList = window.matchMedia('(max-width: 615px)');

class NavigationImmersive extends LitElement {

	static get properties() {
		return {
			allowOverflow: {
				attribute: 'allow-overflow',
				type: Boolean,
				reflect: true
			},
			backLinkHref: {
				attribute: 'back-link-href',
				type: String
			},
			backLinkText: {
				attribute: 'back-link-text',
				type: String
			},
			backLinkTextShort: {
				attribute: 'back-link-text-short',
				type: String
			},
			widthType: {
				attribute: 'width-type',
				type: String,
				reflect: true
			},
			_middleHidden: { state: true },
			_middleNoRightBorder: { state: true },
			_smallWidth: { state: true }
		};
	}

	static get styles() {
		return [bodyCompactStyles, navigationSharedStyle, css`
			:host {
				--d2l-navigation-immersive-height-main: 3.1rem;
				--d2l-navigation-immersive-height-responsive: 2.8rem;
			}
			.d2l-navigiation-immersive-fixed {
				background-color: white;
				left: 0;
				position: fixed;
				right: 0;
				top: 0;
				z-index: 2; /* higher than skeletons which could scroll behind immersive nav */
			}
			d2l-navigation {
				border-bottom: 1px solid var(--d2l-color-mica);
			}
			.d2l-navigation-immersive-margin {
				display: flex;
				justify-content: center;
				margin: 0 30px;
			}

			.d2l-navigation-immersive-container {
				display: flex;
				height: var(--d2l-navigation-immersive-height-main);
				justify-content: space-between;
				margin: 0 -7px;
				max-width: 100%;
				overflow: hidden;
				width: 100%;
			}

			:host([width-type="normal"]) .d2l-navigation-immersive-container {
				max-width: 1230px;
			}

			:host([allow-overflow]) .d2l-navigation-immersive-container {
				overflow: visible;
			}

			.d2l-navigation-immersive-left ::slotted(*),
			.d2l-navigation-immersive-middle ::slotted(*),
			.d2l-navigation-immersive-right ::slotted(*) {
				height: var(--d2l-navigation-immersive-height-main);
			}

			.d2l-navigation-immersive-left {
				color: var(--d2l-color-tungsten);
				letter-spacing: 0.2px;
				padding-left: 7px;
			}

			.d2l-navigation-immersive-right {
				padding-right: 7px;
			}

			.d2l-navigation-immersive-left,
			.d2l-navigation-immersive-right {
				flex: 0 0 auto;
			}

			.d2l-navigation-immersive-middle {
				border-inline-end: 1px solid var(--d2l-color-gypsum);
				border-inline-start: 1px solid var(--d2l-color-gypsum);
				flex: 0 1 auto;
				margin: 0 24px;
				min-width: 0;
				padding: 0 24px;
				width: 100%;
			}

			.d2l-navigation-immersive-middle.d2l-navigation-immersive-middle-no-right-border {
				border-inline-end: none;
			}

			div.d2l-navigation-immersive-middle-observer,
			div.d2l-navigation-immersive-right-observer {
				height: auto;
			}

			.d2l-navigation-immersive-middle-hidden {
				visibility: hidden;
			}

			.d2l-navigation-immersive-spacing {
				height: calc(var(--d2l-navigation-immersive-height-main) + 5px);
				position: unset;
			}

			@media (max-width: 929px) {
				.d2l-navigation-immersive-margin {
					margin: 0 24px;
				}
			}

			@media (max-width: 767px) {
				.d2l-navigation-immersive-margin {
					margin: 0 18px;
				}
			}

			@media (max-width: 615px) {
				.d2l-navigation-immersive-container {
					height: var(--d2l-navigation-immersive-height-responsive);
				}
				.d2l-navigation-immersive-left ::slotted(*),
				.d2l-navigation-immersive-middle ::slotted(*),
				.d2l-navigation-immersive-right ::slotted(*) {
					height: var(--d2l-navigation-immersive-height-responsive);
				}
				.d2l-navigation-immersive-spacing {
					height: calc(var(--d2l-navigation-immersive-height-responsive) + 5px);
				}
				.d2l-navigation-immersive-middle {
					margin: 0 18px;
					padding: 0 18px;
				}
			}
		`];
	}

	constructor() {
		super();
		this._handlePageResize = this._handlePageResize.bind(this);
		this._middleHidden = false;
		this._middleNoRightBorder = true;
		this._middleObserver = new ResizeObserver(this._onMiddleResize.bind(this));
		this._rightObserver = new ResizeObserver(this._onRightResize.bind(this));
		this._smallWidth = false;
	}

	connectedCallback() {
		super.connectedCallback();
		this._startObserving();
		if (mediaQueryList.addEventListener) mediaQueryList.addEventListener('change', this._handlePageResize);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		if (this._middleObserver) this._middleObserver.disconnect();
		if (this._rightObserver) this._rightObserver.disconnect();
		if (mediaQueryList.removeEventListener) mediaQueryList.removeEventListener('change', this._handlePageResize);
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		this._startObserving();
		this._smallWidth = mediaQueryList.matches;
	}

	render() {
		const middleContainerClasses = {
			'd2l-navigation-immersive-middle': true,
			'd2l-navigation-immersive-middle-hidden': this._middleHidden,
			'd2l-navigation-immersive-middle-no-right-border': this._middleNoRightBorder
		};
		const backLinkText = this._smallWidth ? (this.backLinkTextShort || this.backLinkText) : this.backLinkText;
		return html`
			<div class="d2l-navigiation-immersive-fixed">
				<d2l-navigation>
					<div class="d2l-navigation-immersive-margin">
						<div class="d2l-navigation-immersive-container">
							<div class="d2l-navigation-immersive-left d2l-body-compact">
								<slot name="left">
									<d2l-navigation-link-back text="${backLinkText}" href="${this.backLinkHref}" @click="${this._handleBackClick}"></d2l-navigation-link-back>
								</slot>
							</div>
							<div class="${classMap(middleContainerClasses)}">
								<div class="d2l-navigation-immersive-middle-observer">
									<slot name="middle"></slot>
								</div>
							</div>
							<div class="d2l-navigation-immersive-right"><div class="d2l-navigation-immersive-right-observer"><slot name="right"></slot></div></div>
						</div>
					</div>
				</d2l-navigation>
			</div>
			<div class="d2l-navigation-immersive-spacing"></div>
		`;
	}

	_handleBackClick() {
		this.dispatchEvent(
			new CustomEvent(
				'd2l-navigation-immersive-back-click',
				{ bubbles: false, composed: false }
			)
		);
	}

	_handlePageResize(e) {
		this._smallWidth = e.matches;
	}

	_onMiddleResize(entries) {
		if (!entries || entries.length === 0) {
			return;
		}
		this._middleHidden = (entries[0].contentRect.height < 1);
	}

	_onRightResize(entries) {
		if (!entries || entries.length === 0) {
			return;
		}
		this._middleNoRightBorder = (entries[0].contentRect.height < 1);
	}

	_startObserving() {
		const middle = this.shadowRoot?.querySelector('.d2l-navigation-immersive-middle-observer');
		if (middle) {
			this._middleObserver.observe(middle);
		}
		const right = this.shadowRoot?.querySelector('.d2l-navigation-immersive-right-observer');
		if (right) {
			this._rightObserver.observe(right);
		}
	}

}
customElements.define('d2l-navigation-immersive', NavigationImmersive);
