const demoPath = '/demo/utilities/router/';

export const basePath = window.location.pathname.substring(
	0,
	window.location.pathname.indexOf(demoPath) + demoPath.length - 1
);
