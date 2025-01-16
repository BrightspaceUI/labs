import '../../../src/components/navigation/d2l-navigation.js';
import '../../../src/components/navigation/d2l-navigation-band.js';
import '../../../src/components/navigation/d2l-navigation-main-header.js';
import '../../../src/components/navigation/d2l-navigation-main-footer.js';
import '../../../src/components/navigation/d2l-navigation-separator.js';
import { expect, fixture, html, runConstructor } from '@brightspace-ui/testing';

describe('d2l-navigation', () => {

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-navigation');
		});
	});

});

describe('d2l-navigation-band', () => {

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-navigation-band');
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
				const el = await fixture(html`<d2l-navigation-band></d2l-navigation-band>`);
				expect(el._customScroll).to.equal(input.result);
			});
		});

	});

});

describe('d2l-navigation-main-header', () => {

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-navigation-main-header');
		});
	});

});

describe('d2l-navigation-main-footer', () => {

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-navigation-main-footer');
		});
	});

});

describe('d2l-navigation-separator', () => {

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-navigation-separator');
		});
	});

});
