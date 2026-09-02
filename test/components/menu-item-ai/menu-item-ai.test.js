import '@brightspace-ui/core/components/menu/menu.js';
import '../../../src/components/menu-item-ai/menu-item-ai.js';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';

describe('d2l-menu-item-ai', () => {

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-menu-item-ai');
		});
	});
});
