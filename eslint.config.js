import { addExtensions, litConfig, setDirectoryConfigs, testingConfig } from 'eslint-config-brightspace';

export default [
	{
		ignores: ['build', './src/utilities/router/page.js']
	},
	...setDirectoryConfigs(
		addExtensions(litConfig, ['.js', '.html']),
		{ test: testingConfig }
	)
];
