import '../../../src/components/navigation/navigation.js';
import '../../../src/components/navigation/navigation-band.js';
import '../../../src/components/navigation/navigation-main-header.js';
import '../../../src/components/navigation/navigation-main-footer.js';
import '../../../src/components/navigation/navigation-separator.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('d2l-navigation', () => {

	describe('accessibility', () => {
		it('should pass all aXe tests', async() => {
			const el = await fixture(html`<d2l-navigation></d2l-navigation>`);
			await expect(el).to.be.accessible();
		});
	});

});

describe('d2l-navigation-band', () => {

	describe('accessibility', () => {
		it('should pass all aXe tests', async() => {
			const el = await fixture(html`<d2l-navigation-band></d2l-navigation-band>`);
			await expect(el).to.be.accessible();
		});
	});

});

describe('d2l-navigation-main-header', () => {

	describe('accessibility', () => {
		it('should pass all aXe tests', async() => {
			const el = await fixture(html`<d2l-navigation-main-header>
				<div slot="left" class="d2l-navigation-header-left">Left</div>
				<div slot="right" class="d2l-navigation-header-right">Right</div>
			</d2l-navigation-main-header>`);
			await expect(el).to.be.accessible();
		});
	});

});

describe('d2l-navigation-main-footer', () => {

	describe('accessibility', () => {
		it('should pass all aXe tests', async() => {
			const el = await fixture(html`<d2l-navigation-main-footer>
				<div slot="main">Footer</div>
			</d2l-navigation-main-footer>`);
			await expect(el).to.be.accessible();
		});
	});

});

describe('d2l-navigation-separator', () => {

	describe('accessibility', () => {
		it('should pass all aXe tests', async() => {
			const el = await fixture(html`<d2l-navigation-separator></d2l-navigation-separator>`);
			await expect(el).to.be.accessible();
		});
	});

});
