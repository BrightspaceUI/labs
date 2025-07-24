import page from 'page';

let activePage = page;
let _lastOptions = {};
let _lastContext = {};
let passedData = undefined;

export const _createReducedContext = pageContext => ({
	params: pageContext.params,
	search: pageContext.searchParams,
	path: pageContext.path,
	pathname: pageContext.pathname,
	hash: pageContext.hash,
	route: pageContext.routePath,
	title: pageContext.title,
	options: {},
	passedData
});

const _storeCtx = () => {
	activePage('*', (context, next) => {
		_lastContext = context;
		next();
	});
};

const _handleRouteView = (context, next, r) => {
	if (r.view) {
		const reducedContext = _createReducedContext(context);
		context.view = (host, options) => {
			reducedContext.options = options || {};
			const resultingView = r.view.call(host, reducedContext);
			passedData = undefined;
			return resultingView;
		};
		context.handled = true;

		next();
	} else {
		next();
	}
};

const _handleRouteLoader = r => (context, next) => {
	const disableRouteOrderFix = _lastOptions?.disableRouteOrderFix ?? false;

	// Skip further pattern matches if the route has already been handled
	if (!disableRouteOrderFix && context.handled) {
		next();
		return;
	}

	if (r.loader) {
		r.loader().then(() => {
			_handleRouteView(context, next, r);
		});
	} else if (r.pattern && r.to) {
		if (!disableRouteOrderFix) {
			activePage.redirect(r.to);
		} else {
			activePage.redirect(r.pattern, r.to);
			next();
		}
	} else {
		_handleRouteView(context, next, r);
	}
};

const _registerRoute = r => {
	activePage(r.pattern, _handleRouteLoader(r));
};

const _registerRoutes = routes => {
	if (typeof routes === 'function') {
		_registerRoutes(routes());
		return;
	}
	routes.forEach(r => {
		if (typeof r === 'function') {
			_registerRoutes(r());
		} else {
			_registerRoute(r);
		}
	});
};

const configure = options => {
	if (options && options.customPage) activePage = page.create();
	if (options && options.basePath) activePage.base(options.basePath);
	activePage(options);
	_lastOptions = options;
};

let hasRegistered = false;

export const registerRoutes = (routes, options) => {
	if (hasRegistered) throw new Error('May not construct multiple routers.');
	hasRegistered = true;

	if (options?.disableRouteOrderFix) console.warn('lit-router: The disableRouteOrderFix option is enabled, which may cause issues with route handling. See here for details: https://github.com/BrightspaceUI/labs/tree/main/src/utilities/router#route-order-inversion-issue');

	configure(options);

	activePage('*', (context, next) => {
		context.searchParams = {};
		const searchParams = new URLSearchParams(context.querystring);
		searchParams.forEach((value, key) => {
			context.searchParams[key] = value;
		});
		next();
	});
	_registerRoutes(routes);
	_storeCtx();
};

const addMiddleware = callback => {
	activePage('*', (ctx, next) => {
		callback(ctx);
		next();
	});
};

// Triggers navigation to the specified route path.
// Creates a new entry in the browser's history stack.
export const navigate = path => {
	activePage.show(path);
};

// Triggers navigation to the specified route path and passes along some data.
// Creates a new entry in the browser's history stack.
export const navigateAndPass = (path, data) => {
	passedData = data;
	activePage.show(path);
};

// Triggers navigation to the specified route path.
// Replaces the current entry in the browser's history stack.
export const redirect = path => {
	activePage.redirect(path);
};

export class ContextReactor {

	static reset() {
		this.listeners = [];
	}

	constructor(host, callback, initialize) {
		ContextReactor.listeners.push({ host, callback });

		if (ContextReactor.listeners.length === 1) {
			addMiddleware(ctx => {
				ContextReactor.listeners.forEach(listener => {
					listener.callback(ctx);
					// call requestUpdate only for known routes when ctx.handled is truthy
					if (listener.host && ctx.handled) {
						listener.host.requestUpdate();
					}
				});
			});
		}
		// initialize the listener with the context from the last run
		if (initialize) {
			initialize(_lastContext);
		}
	}

	init() {
		activePage();
	}

}

ContextReactor.listeners = [];

export const RouterTesting = {
	reset: () => {
		activePage.stop();
		activePage = page.create();
		hasRegistered = false;
		ContextReactor.reset();
	},

	restart: () => {
		activePage.start(_lastOptions);
	},
};
