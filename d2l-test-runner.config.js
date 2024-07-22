import { env } from 'node:process';

export default {
	testReporting: !!env['CI']
};
