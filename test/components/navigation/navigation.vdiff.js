import '../../d2l-navigation.js';
import '../../d2l-navigation-band.js';
import '../../d2l-navigation-separator.js';
import '../../d2l-navigation-main-header.js';
import '../../d2l-navigation-main-footer.js';
import { expect, fixture, focusElem, html } from '@brightspace-ui/testing';

const navigationDefaultFixture = html`<d2l-navigation has-skip-nav>Stuff in here</d2l-navigation>`;

describe('d2l-navigation', () => {

	[
		{ name: 'band-default', template: html`<d2l-navigation-band></d2l-navigation-band>` },
		{ name: 'band-custom-color', template: html`<d2l-navigation-band style="--d2l-branding-primary-color: #ff0000;"></d2l-navigation-band>` },
		{ name: 'separator', template: html`<d2l-navigation-separator></d2l-navigation-band>` },
		{ name: 'main-footer', template: html`<d2l-navigation-main-footer><div slot="main">Footer</div></d2l-navigation-main-footer>` },
		{ name: 'navigation-default', template: navigationDefaultFixture },
		{
			name: 'navigation-header-footer',
			template: html`
				<d2l-navigation>
					<d2l-navigation-main-header>
						<div slot="left" class="d2l-navigation-header-left" style="background-color: pink;">Header Left</div>
						<div slot="right" class="d2l-navigation-header-right" style="background-color: lightblue;">Header Right</div>
					</d2l-navigation-main-header>
					<d2l-navigation-main-footer>
						<div slot="main">Footer</div>
					</d2l-navigation-main-footer>
				</d2l-navigation>
			`
		},
		{
			name: 'navigation-header-only',
			template: html`
				<d2l-navigation>
					<d2l-navigation-main-header>
						<div slot="left" class="d2l-navigation-header-left" style="background-color: pink;">Header Left</div>
						<div slot="right" class="d2l-navigation-header-right" style="background-color: lightblue;">Header Right</div>
					</d2l-navigation-main-header>
				</d2l-navigation>
			`
		}
	].forEach(({ name, template }) => {
		it(name, async() => {
			const elem = await fixture(template);
			await expect(elem).to.be.golden();
		});
	});

	it('skip-nav', async() => {
		const elem = await fixture(navigationDefaultFixture);
		await focusElem(elem.shadowRoot.querySelector('d2l-navigation-skip-main'));
		await expect(elem).to.be.golden();
	});

	[ 800, 767, 615].forEach((width) => {
		it(`main-header-${width}`, async() => {
			const elem = await fixture(html`
				<d2l-navigation-main-header>
					<div slot="left" class="d2l-navigation-header-left" style="background-color: pink;">Header Left. As the width changes, it shrinks as needed.</div>
					<div slot="right" class="d2l-navigation-header-right" style="background-color: lightblue;">Header Right. It doesn't shrink.</div>
				</d2l-navigation-main-header>
			`, { viewport: { width } });
			await expect(elem).to.be.golden();
		});
	});

});
