import { LitElement } from 'lit';
import { RouteReactor } from '../../../../src/utilities/router/index.js';

class MainView extends LitElement {
	static properties = {
		'main-prop': { type: String, attribute: true },
	};

	constructor() {
		super();
		this.route = new RouteReactor(this);
	}

	render() {
		return this.route.renderView({ main: this['main-prop'] });
	}
}

customElements.define('main-view', MainView);
