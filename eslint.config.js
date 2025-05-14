import { addExtensions, litConfig, setDirectoryConfigs, testingConfig } from 'eslint-config-brightspace';

export default [
	{
		ignores: ['build']
	},
	...setDirectoryConfigs(
		addExtensions(litConfig, ['.js', '.html']),
		{ test: testingConfig }
	)
];
