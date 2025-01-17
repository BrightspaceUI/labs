import '../../../src/components/navigation/navigation.js';
import '../../../src/components/navigation/navigation-band.js';
import '../../../src/components/navigation/navigation-main-header.js';
import '../../../src/components/navigation/navigation-main-footer.js';
import '../../../src/components/navigation/navigation-separator.js';
import { expect, fixture, html, runConstructor } from '@brightspace-ui/testing';

describe('d2l-labs-navigation', () => {

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-labs-navigation');
		});
	});

});

describe('d2l-labs-navigation-band', () => {

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-labs-navigation-band');
		});
	});

	describe('custom scrollbar', () => {

		const originalUserAgent = navigator.userAgent;

		after(() => {
			Object.defineProperty(window.navigator, 'userAgent', { value: originalUserAgent, configurable: true });
		});

		[
			{ userAgent: '', result: false },
			{ userAgent: 'test', result: false },
			{ userAgent: 'Mac OS X', result: false },
			{ userAgent: 'Mac OS X Mobile', result: false },
			{ userAgent: 'Windows', result: true },
			{ userAgent: 'Windows Mobile', result: false },
			{ userAgent: 'Mobile', result: false },
			{ userAgent: 'Windows Mac OS X', result: true }
		].forEach((input) => {
			it(`should set data-custom-scroll to "${input.result}" for user-agent "${input.userAgent}"`, async() => {
				Object.defineProperty(window.navigator, 'userAgent', { value: input.userAgent, configurable: true });
				const el = await fixture(html`<d2l-labs-navigation-band></d2l-labs-navigation-band>`);
				expect(el._customScroll).to.equal(input.result);
			});
		});

	});

});

describe('d2l-labs-navigation-main-header', () => {

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-labs-navigation-main-header');
		});
	});

});

describe('d2l-labs-navigation-main-footer', () => {

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-labs-navigation-main-footer');
		});
	});

});

describe('d2l-labs-navigation-separator', () => {

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-labs-navigation-separator');
		});
	});

});
