import '../../d2l-navigation-link.js';
import '../../d2l-navigation-link-back.js';
import '../../d2l-navigation-link-icon.js';
import '../../d2l-navigation-link-image.js';
import { expect, fixture, focusElem, hoverElem, html, oneEvent } from '@brightspace-ui/testing';
import { ifDefined } from 'lit/directives/if-defined.js';

const createLinkImage = (hasHref) => {
	const href = hasHref ? 'https://www.d2l.com' : undefined;
	return html`
		<d2l-navigation-link-image
			href="${ifDefined(href)}"
			src="data:image/png;base64,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"
			text="D2L"></d2l-navigation-link-image>
		`;
};

describe('d2l-navigation-link', () => {

	[
		{ name: 'base', template: html`<d2l-navigation-link href="https://www.d2l.com" text="D2L">D2L</d2l-navigation-link>` },
		{ name: 'back', template: html`<d2l-navigation-link-back href="https://www.d2l.com" text="D2L">D2L</d2l-navigation-link-back>` },
		{ name: 'icon-text', template: html`<d2l-navigation-link-icon href="https://www.example.org" icon="tier3:gear" text="Settings"></d2l-navigation-link-icon>` },
		{ name: 'icon-text-hidden', tooltip: true, template: html`<d2l-navigation-link-icon href="https://www.example.org" icon="tier3:gear" text="Settings" text-hidden></d2l-navigation-link-icon>` },
		{ name: 'image', tooltip: true, template: createLinkImage(true) },
		{ name: 'image-no-href', template: createLinkImage(false), noFocus: true }
	].forEach(({ name, noFocus, template, tooltip }) => {
		describe(name, () => {

			let elem;
			beforeEach(async() => elem = await fixture(template));

			it('normal', async() => {
				await expect(elem).to.be.golden();
			});

			it('hover', async() => {
				if (tooltip) {
					hoverElem(elem);
					await oneEvent(elem, 'd2l-tooltip-show');
				} else {
					await hoverElem(elem);
				}
				await expect(elem).to.be.golden();
			});

			if (!noFocus) {
				it('focus', async() => {
					if (tooltip) {
						focusElem(elem);
						await oneEvent(elem, 'd2l-tooltip-show');
					} else {
						await focusElem(elem);
					}
					await expect(elem).to.be.golden();
				});
			}
		});
	});

});
