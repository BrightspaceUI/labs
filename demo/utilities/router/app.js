import './route-loader.js';
import { css, html, LitElement } from 'lit';
import { basePath } from './util.js';
import { RouteReactor } from '../../../src/utilities/router/index.js';

import '@brightspace-ui/core/components/menu/menu.js';
import '@brightspace-ui/core/components/menu/menu-item.js';
import '@brightspace-ui/core/components/menu/menu-item-link.js';

export class App extends LitElement {
	static styles = css`
		:host {
			display: grid;
			grid-template-areas: "nav main";
			grid-template-columns: 200px 1fr;
		}
		aside {
			grid-area: nav;
		}
		main {
			grid-area: main;
		}
	`;

	constructor() {
		super();
		this.route = new RouteReactor(this);
	}

	render() {
		return html`
			<aside>
				<nav>
					<ul>
						<li><a href="${basePath}/home">Home</a></li>
						<li><a href="${basePath}/people">People</a></li>
						<li><a href="${basePath}/places">Places</a></li>
					</ul>
				</nav>
				<hr>
				<d2l-menu label="Astronomy" style="max-width: 400px;">
					<d2l-menu-item-link href="${basePath}/home" text="Home"></d2l-menu-item-link>
					<d2l-menu-item-link href="${basePath}/people" text="People"></d2l-menu-item-link>
					<d2l-menu-item-link href="${basePath}/places" text="Places"></d2l-menu-item-link>
				</d2l-menu>
			</aside>
			<main>${this.route.renderView()}</main>
		`;
	}
}

customElements.define('test-app', App);
