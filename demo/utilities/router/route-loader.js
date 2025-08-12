import { basePath } from './util.js';
import { html } from 'lit';
import { loader as peopleRouteLoader } from './people/route-loader.js';
import { loader as placesRouteLoader } from './places/route-loader.js';
import { registerRoutes } from '../../../src/utilities/router/router.js';

registerRoutes(
	[
		{
			pattern: '/',
			loader: async(ctx) => {
				await import('./home.js');
				ctx.loaderData = 'test';
			},
			view: ({ loaderData }) => html`<test-home>${ loaderData }</test-home>`,
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
