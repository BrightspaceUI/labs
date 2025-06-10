import { basePath } from './util.js';
import { html } from 'lit';
import { loader as peopleRouteLoader } from './people/route-loader.js';
import { loader as placesRouteLoader } from './places/route-loader.js';
import { registerRoutes } from '../../../src/utilities/router/router.js';

registerRoutes(
	[
		{
			pattern: '/',
			loader: () => import('./home.js'),
			view: () => html`<test-home></test-home>`,
		},
		{
			pattern: '/home',
			to: '/',
		},
		peopleRouteLoader,
		placesRouteLoader,
		{
			pattern: '*',
			view: () => html`<h1>Not Found</h1>`,
		}
	],
	{
		basePath: basePath
	}
);
