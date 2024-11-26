import { addExtensions, litConfig, setDirectoryConfigs, testingConfig } from 'eslint-config-brightspace';

export default [
	{ ignores: ['.vdiff/'] },
	...addExtensions(setDirectoryConfigs(
		litConfig,
		{ test: testingConfig },
	), ['.js', '.html']),
	{
		files: ['demo/**/**.html'],
		rules: { 'no-console': 0 }
	}
];
