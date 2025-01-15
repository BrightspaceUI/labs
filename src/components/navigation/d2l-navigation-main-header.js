import { css, html, LitElement } from 'lit';
import { navigationSharedStyle } from './d2l-navigation-shared-styles.js';

class NavigationMainHeader extends LitElement {

	static get styles() {
		return [navigationSharedStyle, css`
			:host {
				display: block;
			}

			.d2l-navigation-header-container {
				align-items: center;
				display: flex;
				height: 90px;
			}

			@media (max-width: 767px) {
				.d2l-navigation-header-container {
					height: 72px;
				}
			}

			div ::slotted(.d2l-navigation-header-left),
			div ::slotted(.d2l-navigation-header-right) {
				align-items: center;
				display: flex;
				height: 100%;
			}

			div ::slotted(.d2l-navigation-header-left) {
				flex: 0 1 auto;
			}

			div ::slotted(.d2l-navigation-header-right) {
				flex: 0 0 auto;
			}

			.d2l-navigation-gutter {
				display: inline-block;
				flex: 1 1 auto;
				min-width: var(--d2l-navigation-margin-regular);
			}

			@media (max-width: 615px) {
				.d2l-navigation-gutter {
					min-width: var(--d2l-navigation-margin-regular) / 2;
				}
			}
		`];
	}

	render() {
		return html`
			<div class="d2l-navigation-centerer">
				<div class="d2l-navigation-gutters">
					<div class="d2l-navigation-header-container">
						<slot name="left"></slot>
						<div class="d2l-navigation-gutter"></div>
						<slot name="right"></slot>
					</div>
				</div>
			</div>
		`;
	}
}
customElements.define('d2l-navigation-main-header', NavigationMainHeader);
