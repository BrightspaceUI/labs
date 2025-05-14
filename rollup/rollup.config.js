import copy from 'rollup-plugin-copy';
import del from 'rollup-plugin-delete';
import dynamicImportVars from '@rollup/plugin-dynamic-import-vars';
import glob from 'glob-all';
import { rollupPluginHTML as html } from '@web/rollup-plugin-html';
import { readFileSync } from 'fs';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';

const { version } = JSON.parse(readFileSync('./package.json'));
const buildDate = Intl.DateTimeFormat('en-CA', { timeZone: 'America/Toronto' }).format(new Date());

const jsGlob = [
	'@(src|demo)/**/*.js',
	'./index.js',
	'!**/*.@(test|axe|vdiff).js',
];
const nonJsGlob = [
	'@(src|demo)/**/*.*',
	'*.*',
	'!**/*.@(js|md)',
	'!./*.json',
	'!**/golden/**/*',
];

export default {
	input: glob.sync(jsGlob),
	output: { dir: 'build', format: 'es', preserveModules: true, assetFileNames: 'assets/[name][extname]' },
	plugins: [
		del({ targets: 'build' }),
		copy({
			targets: [{
				src: nonJsGlob,
				dest: 'build',
				rename: (_name, _extension, fullpath) => fullpath,
			}],
		}),
		html({
			flattenOutput: false,
			input: [{ path: 'index.html' }, { path: 'demo/**/*.html' }]
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
