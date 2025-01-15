import '../../d2l-navigation-immersive.js';
import { expect, fixture, focusElem, html } from '@brightspace-ui/testing';

const pageContent = html`<div style="background-color: pink;">Main Page Content</div>`;
const normalFixture = html`<d2l-navigation-immersive width-type="normal" back-link-href="https://www.d2l.com"></d2l-navigation-immersive>${pageContent}`;
const noRightSlotFixture = html`<d2l-navigation-immersive><div slot="middle">Middle</div></d2l-navigation-immersive>${pageContent}`;
const noMiddleSlotFixture = html`<d2l-navigation-immersive><div slot="right">Right</div></d2l-navigation-immersive>${pageContent}`;
const allowOverflowFixture = html`<d2l-navigation-immersive allow-overflow><div slot="right" style="background-color: red; height: 200px;">Should overflow</div></d2l-navigation-immersive>${pageContent}`;
const backLinkTextFixture = html`<d2l-navigation-immersive back-link-text="Long Text" back-link-text-short="Short Text"></d2l-navigation-immersive>`;

describe('d2l-navigation-immersive', () => {

	[1500, 929, 767].forEach((width) => {
		[
			{ name: 'normal', template: normalFixture },
			{ name: 'fullscreen', template: html`<d2l-navigation-immersive width-type="fullscreen"></d2l-navigation-immersive>${pageContent}` },
			{ name: 'both-slots', template: html`<d2l-navigation-immersive><div slot="middle">Middle</div><div slot="right">Right</div></d2l-navigation-immersive>${pageContent}` },
			{ name: 'no-right-slot', template: noRightSlotFixture },
			{ name: 'no-middle-slot', template: noMiddleSlotFixture },
			{ name: 'allow-overflow', template: allowOverflowFixture },
		].forEach(({ name, template }) => {
			describe(name, () => {
				it(`${width}`, async() => {
					await fixture(template, { viewport: { height: 200, width } });
					await expect(document).to.be.golden();
				});
			});
		});
	});

	describe('focus', () => {
		it('back-button', async() => {
			const elem = await fixture(normalFixture, { viewport: { height: 200, width: 1000 } });
			await focusElem(elem.shadowRoot.querySelector('d2l-navigation-link-back'));
			await expect(document).to.be.golden();
		});
	});

	describe('new-slots', () => {
		[
			{ name: 'right', template: noRightSlotFixture },
			{ name: 'middle', template: noMiddleSlotFixture }
		].forEach(({ name, template }) => {
			it(name, async() => {
				const elem = await fixture(template, { viewport: { height: 200, width: 1000 } });
				const newContent = document.createElement('div');
				newContent.setAttribute('slot', name);
				newContent.innerHTML = 'New Content';
				elem.appendChild(newContent);
				await elem.updateComplete;
				await expect(document).to.be.golden();
			});
		});
	});

	describe('back-text', () => {
		it('short', async() => {
			await fixture(backLinkTextFixture, { viewport: { height: 200, width: 500 } });
			await expect(document).to.be.golden();
		});
		it('long', async() => {
			await fixture(backLinkTextFixture, { viewport: { height: 200, width: 650 } });
			await expect(document).to.be.golden();
		});
		it('short-not-set', async() => {
			await fixture(
				html`<d2l-navigation-immersive back-link-text="Long Text"></d2l-navigation-immersive>`,
				{ viewport: { height: 200, width: 500 } }
			);
			await expect(document).to.be.golden();
		});
	});

});
