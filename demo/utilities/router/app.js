import './route-loader.js';
import '@brightspace-ui/core/components/list/list.js';
import '@brightspace-ui/core/components/list/list-item.js';
import '@brightspace-ui/core/components/list/list-item-content.js';
import '@brightspace-ui/core/components/menu/menu.js';
import '@brightspace-ui/core/components/menu/menu-item-link.js';
import { css, html, LitElement } from 'lit';
import { basePath } from './util.js';
import { RouteReactor } from '../../../src/utilities/router/index.js';

export class App extends LitElement {
	static styles = css`
		:host {
			display: grid;
			grid-template-areas: "nav main";
			grid-template-columns: 250px 1fr;
		}
		aside {
			grid-area: nav;
		}
		nav {
			padding: 1rem;
		}
		d2l-menu {
			margin-bottom: 1rem;
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
					Native Links
					<ul>
						<li><a href="${basePath}/home">Home</a></li>
						<li><a href="${basePath}/people">People</a></li>
						<li><a href="${basePath}/places">Places</a></li>
					</ul>
					Menu Item Links
					<d2l-menu label="Nav Menu">
						<d2l-menu-item-link href="${basePath}/home" text="Home"></d2l-menu-item-link>
						<d2l-menu-item-link href="${basePath}/people" text="People"></d2l-menu-item-link>
						<d2l-menu-item-link href="${basePath}/places" text="Places"></d2l-menu-item-link>
					</d2l-menu>
					List Item Links
					<d2l-list>
						<d2l-list-item href="${basePath}/home" key="1" label="Home">
							<d2l-list-item-content>Home</d2l-list-item-content>
						</d2l-list-item>
						<d2l-list-item href="${basePath}/people" key="2" label="People">
							<d2l-list-item-content>People</d2l-list-item-content>
						</d2l-list-item>
						<d2l-list-item href="${basePath}/places" key="3" label="Places">
							<d2l-list-item-content>Places</d2l-list-item-content>
						</d2l-list-item>
					</d2l-list>
				</nav>
			</aside>
			<main>${this.route.renderView()}</main>
		`;
	}
}

customElements.define('test-app', App);
