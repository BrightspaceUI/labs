# Router

A Lit wrapper around the [Page.js Router](https://visionmedia.github.io/page.js/), providing an easy way to define routes, lazy load the view, and react to changes to the route.

## Route Registration

To define the routing table that gets used when determining which view to render, `registerRoutes` should be executed once -- typically by the root of the application.

When the URL matches a particular route's pattern, the `view` function is called and returns a Lit `html` literal to render.

```js
import { registerRoutes } from '@brightspace-ui/labs/utilities/lit-router';

registerRoutes([
  {
    pattern: '/my-app',
    loader: () => import('./home.js'),
    view: () => html`<my-app-home></my-app-home>`
  },
  {
    pattern: '/my-app/user/:id',
    loader: () => import('./user.js'),
    view: ctx => html`<my-app-user id="${ctx.params.id}"></my-app-user>`
  }
], options);
```

### Route Properties

Each route has the following properties:
- `pattern` (required): The Page.js route pattern on which to match
- `loader` (optional): Allows for lazy-loading dependencies (e.g. importing view files) before rendering the view; must return a `Promise`
- `view` (optional): Function that returns a Lit `html` literal to render
- `to` (optional): String indicating a redirect path, using Page.js `redirect(fromPath, toPath)`

### View Context

The view delegate is provided a context object containing:
 - `params`: URL segment parameters (e.g. `:id`)
 - `search`: search query values
 - `options`: object passed by the entry-point
 - `path`: Pathname and query string (e.g. `"/login?foo=bar"`)
 - `pathname`: Pathname void of query string (e.g. `"/login"`)
 - `hash`: URL hash (e.g. `"#hash=values"`)
 - `route`: route pattern given to the view in the router
 - `title`: title in the push state

Example:
```js
{
  pattern: '/my-app/user/:id/:page' // search: ?semester=1
  view: ctx => html`
    <my-app-user
        id="${ctx.options.id}"
        page="${ctx.params.page}"
        semester="${ctx.search.semester}>"
    </my-app-user>
  `
}
```

### Options

Options are the second parameter passed to `registerRoutes`. The two tables below encompass all the attributes that the options object can use.

Page.js options:

| Name                |                               Description                               | Default |
| :------------------ | :---------------------------------------------------------------------: | ------: |
| click               |                          bind to click events                           |    true |
| popstate            |                            bind to popstate                             |    true |
| dispatch            |                        perform initial dispatch                         |    true |
| hashbang            |                           add #! before urls                            |   false |
| decodeURLComponents | remove URL encoding from path components (query string, pathname, hash) |    true |

Additional options:

| Name       |                      Description                      | Default |
| :--------- | :---------------------------------------------------: | ------: |
| basePath   |       the path all other paths are appended too       |     '/' |
| customPage | don't use the global page object (useful for testing) |   false |

### Multiple Route Loaders

Some complex applications have many sub applications, and in these scenarios it may be beneficial to delegate to multiple route loaders.

Example directory structure:
```
/src
| /components
|
| /app1
| | app1-view.js
| | route-loader.js
|
| /app2
| | app2-view.js
| | route-loader.js
|
| entry-point.js
| route-loader.js
```

The main route-loader in the root of the `src` directory should import the route-loader files in the subdirectories.

```js
/* src/route-loader.js */
import { loader as app1Loader } from './app1/route-loader.js';
import { loader as app2Loader } from './app2/route-loader.js';
import { registerRoutes } from '@brightspace-ui/labs/utilities/lit-router';

registerRoutes([
  {
    pattern: '/',
    view: () => html`<entry-point></entry-point>`
  },
  app1Loader,
  app2Loader
])

/* src/page1/route-loader.js */
export const loader () => [
  {
    pattern: '/app1',
    loader: () => import('./app1-view.js'),
    view: () => html`<app-1></app-1>`
  }
]
```

## Rendering the Active view using RouteReactor

The `RouteReactor` is a [Reactive Controller](https://lit.dev/docs/composition/controllers/) responsible for renering (and re-rendering) the active view whenever the route changes.

```js
import { RouteReactor } from '@brightspace-ui/labs/utilities/lit-router';

class EntryPoint extends LitElement {

  constructor() {
    super();
    this.route = new RouteReactor(this);
  }

  render() {
    // Options for the views. Can be used for attributes */
    const options = { };
    return this.route.renderView(options);
  }

}
```

A `RouteReactor` can also be used to react to changes to the URL. The available properties are the same as the context object passed to the views above.

```js
import { RouteReactor } from '@brightspace-ui/labs/utilities/lit-router';

class FooBar extends LitElement {

  constructor() {
    super();
    this.route = new RouteReactor(this);
  }

  render() {
    const userId = this.route.params.userId;
    const orgId = this.route.search['org-unit'];
    return html`<span> user: ${userId} orgUnit: ${orgId}</span>`;
  }

}
```

## Navigating and Redirecting

Page.js will hook into any `<a>` tags and handle the navigation automatically.

To navigate manually and add a new browser history entry, use `navigate(path)`:

```js
import { navigate } from '@brightspace-ui/labs/utilities/lit-router';

navigate('/my-app/new-place');
```

To redirect to a page and replace the previous browser history item the new one, use `redirect(path)`:

```js
import { redirect } from '@brightspace-ui/labs/utilities/lit-router';

redirect('/my-app/new-place');
```

## Testing Routing in Your Application

For testing page routing in your application, this template is recommended:

```js
import { RouterTesting } from '@brightspace-ui/labs/utilities/lit-router';

describe('Page Routing', () => {

  beforeEach(async () => {
    // Initialize the routes here or import a file
    // that calls registerRoutes and expose a way to recall it
    initRouter();
    entryPoint = await fixture(html`<!-- Your RouteReactor component here -->`);
    navigate('/'); // Reset tests back to the index, clears the url
  });

  afterEach(() => {
    RouterTesting.reset(); // creates a new router instance, clears any router related reactive controllers.
  });

  // Your tests here

});
```

## Known Issues

### Route order inversion issue

There's currently an issue with the way registered routes are processed that can cause the order of matching to appear to be inverted. This is not noticeable in many cases since it's often the case that only a single route will match regardless of the order. This does however come up when dealing with wildcard (`*`) routes (e.g. 404 redirect routes).

If you notice that you have to put any routes with wildcards (`*`) before those without instead of after, this is the reason why.

#### Issue Fix

There is currently a fix available for this ordering issue, but it requires setting the `enableRouteOrderFix` option to `true`. Ex:

```js
registerRoutes([
  {
    pattern: '/home',
    view: () => html`...`
  },
  {
    pattern: '/404',
    view: () => html`...`
  },
  {
    pattern: '*',
    to: '/404'
  }
], {
  enableRouteOrderFix: true
});
```

Note: The reason this is an opt-in fix is that a lot of existing implementations of lit-router have worked around this issue by putting the wildcard routes at the start, which would break if the issue were fixed for everyone automatically.
