import copy from 'rollup-plugin-copy';
import del from 'rollup-plugin-delete';
import dynamicImportVars from '@rollup/plugin-dynamic-import-vars';
import glob from 'glob-all';
import { readFileSync } from 'fs';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';

const { version } = JSON.parse(readFileSync('./package.json'));
const buildDate = Intl.DateTimeFormat('en-CA', { timeZone: 'America/Toronto' }).format(new Date());

const jsGlob = [
	'@(src|demo)/**/*.js',
	'./index.js',
	'node_modules/@brightspace-ui/core/components/calendar/*.js',
	'node_modules/@brightspace-ui/core/components/collapsible-panel/*.js',
	'node_modules/@brightspace-ui/core/components/colors/*.js',
	'node_modules/@brightspace-ui/core/components/demo/*.js',
	'node_modules/@brightspace-ui/core/components/dropdown/*.js',
	'node_modules/@brightspace-ui/core/components/icons/*.js',
	'node_modules/@brightspace-ui/core/components/menu/*.js',
	'node_modules/@brightspace-ui/core/components/typography/*.js',
	'!**/*.@(test|axe|vdiff).js',
];
const nonJsGlob = [
	'@(src|demo)/**/*.*',
	'*.*',
	'node_modules/@brightspace-ui/core/components/demo/styles.css',
	'!**/*.@(js|md)',
	'!**/golden/**/*',
];

export default {
	input: glob.sync(jsGlob),
	output: { dir: 'build', format: 'es', preserveModules: true },
	external: ['@brightspace-ui/testing', 'sinon'],
	plugins: [
		del({ targets: 'build' }),
		copy({
			targets: [{
				src: nonJsGlob,
				dest: 'build',
				rename: (_name, _extension, fullpath) => fullpath,
			}],
		}),
		replace({
			include: './index.js',
			preventAssignment: false,
			values: {
				'window.__buildDate__': JSON.stringify(buildDate),
				'window.__buildVersion__': JSON.stringify(version),
			},
		}),
		resolve(),
		dynamicImportVars(),
	],
};
