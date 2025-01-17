import '../../../src/components/navigation/navigation.js';
import '../../../src/components/navigation/navigation-band.js';
import '../../../src/components/navigation/navigation-main-header.js';
import '../../../src/components/navigation/navigation-main-footer.js';
import '../../../src/components/navigation/navigation-separator.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('d2l-labs-navigation', () => {

	describe('accessibility', () => {
		it('should pass all aXe tests', async() => {
			const el = await fixture(html`<d2l-labs-navigation></d2l-labs-navigation>`);
			await expect(el).to.be.accessible();
		});
	});

});

describe('d2l-labs-navigation-band', () => {

	describe('accessibility', () => {
		it('should pass all aXe tests', async() => {
			const el = await fixture(html`<d2l-labs-navigation-band></d2l-labs-navigation-band>`);
			await expect(el).to.be.accessible();
		});
	});

});

describe('d2l-labs-navigation-main-header', () => {

	describe('accessibility', () => {
		it('should pass all aXe tests', async() => {
			const el = await fixture(html`<d2l-labs-navigation-main-header>
				<div slot="left" class="d2l-labs-navigation-header-left">Left</div>
				<div slot="right" class="d2l-labs-navigation-header-right">Right</div>
			</d2l-labs-navigation-main-header>`);
			await expect(el).to.be.accessible();
		});
	});

});

describe('d2l-labs-navigation-main-footer', () => {

	describe('accessibility', () => {
		it('should pass all aXe tests', async() => {
			const el = await fixture(html`<d2l-labs-navigation-main-footer>
				<div slot="main">Footer</div>
			</d2l-labs-navigation-main-footer>`);
			await expect(el).to.be.accessible();
		});
	});

});

describe('d2l-labs-navigation-separator', () => {

	describe('accessibility', () => {
		it('should pass all aXe tests', async() => {
			const el = await fixture(html`<d2l-labs-navigation-separator></d2l-labs-navigation-separator>`);
			await expect(el).to.be.accessible();
		});
	});

});
