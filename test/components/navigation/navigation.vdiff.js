import '../../../src/components/navigation/navigation.js';
import '../../../src/components/navigation/navigation-band.js';
import '../../../src/components/navigation/navigation-separator.js';
import '../../../src/components/navigation/navigation-main-header.js';
import '../../../src/components/navigation/navigation-main-footer.js';
import { expect, fixture, focusElem, html } from '@brightspace-ui/testing';

const navigationDefaultFixture = html`<d2l-labs-navigation has-skip-nav>Stuff in here</d2l-labs-navigation>`;

describe('d2l-labs-navigation', () => {

	[
		{ name: 'band-default', template: html`<d2l-labs-navigation-band></d2l-labs-navigation-band>` },
		{ name: 'band-custom-color', template: html`<d2l-labs-navigation-band style="--d2l-branding-primary-color: #ff0000;"></d2l-labs-navigation-band>` },
		{ name: 'separator', template: html`<d2l-labs-navigation-separator></d2l-labs-navigation-band>` },
		{ name: 'main-footer', template: html`<d2l-labs-navigation-main-footer><div slot="main">Footer</div></d2l-labs-navigation-main-footer>` },
		{ name: 'navigation-default', template: navigationDefaultFixture },
		{
			name: 'navigation-header-footer',
			template: html`
				<d2l-labs-navigation>
					<d2l-labs-navigation-main-header>
						<div slot="left" class="d2l-labs-navigation-header-left" style="background-color: pink;">Header Left</div>
						<div slot="right" class="d2l-labs-navigation-header-right" style="background-color: lightblue;">Header Right</div>
					</d2l-labs-navigation-main-header>
					<d2l-labs-navigation-main-footer>
						<div slot="main">Footer</div>
					</d2l-labs-navigation-main-footer>
				</d2l-labs-navigation>
			`
		},
		{
			name: 'navigation-header-only',
			template: html`
				<d2l-labs-navigation>
					<d2l-labs-navigation-main-header>
						<div slot="left" class="d2l-labs-navigation-header-left" style="background-color: pink;">Header Left</div>
						<div slot="right" class="d2l-labs-navigation-header-right" style="background-color: lightblue;">Header Right</div>
					</d2l-labs-navigation-main-header>
				</d2l-labs-navigation>
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
		await focusElem(elem.shadowRoot.querySelector('d2l-labs-navigation-skip-main'));
		await expect(elem).to.be.golden();
	});

	[ 800, 767, 615].forEach((width) => {
		it(`main-header-${width}`, async() => {
			const elem = await fixture(html`
				<d2l-labs-navigation-main-header>
					<div slot="left" class="d2l-labs-navigation-header-left" style="background-color: pink;">Header Left. As the width changes, it shrinks as needed.</div>
					<div slot="right" class="d2l-labs-navigation-header-right" style="background-color: lightblue;">Header Right. It doesn't shrink.</div>
				</d2l-labs-navigation-main-header>
			`, { viewport: { width } });
			await expect(elem).to.be.golden();
		});
	});

});
