import '@brightspace-ui/core/components/dropdown/dropdown-content.js';
import '../../d2l-navigation-button-icon.js';
import '../../d2l-navigation-dropdown-button-custom.js';
import '../../d2l-navigation-dropdown-button-icon.js';
import { expect, fixture, focusElem, hoverElem, html, oneEvent } from '@brightspace-ui/testing';
import { ifDefined } from 'lit/directives/if-defined.js';
import { nothing } from 'lit';

const create = (opts = {}) => {
	const { disabled, icon, iconPosition, noHighlightBorder, text, textHidden } = {
		disabled: false,
		icon: 'tier3:classes',
		noHighlightBorder: false,
		text: 'Classes',
		textHidden: false,
		...opts
	};
	return html`
		<d2l-navigation-button-icon
			?disabled="${disabled}"
			icon="${icon}"
			icon-position="${ifDefined(iconPosition)}"
			?no-highlight-border="${noHighlightBorder}"
			text="${text}"
			?text-hidden="${textHidden}"></d2l-navigation-button-icon>
	`;
};

const createDropdown = (opts = {}) => {
	const { disabled, hasDropdown, hasNotification, icon, notificationText, text } = {
		disabled: false,
		hasNotification: false,
		icon: 'tier3:notification-bell',
		text: 'Notification off',
		...opts
	};
	const dropdown = hasDropdown ? html`<d2l-dropdown-content>content</d2l-dropdown-content>` : nothing;
	return html`
		<d2l-navigation-dropdown-button-icon
			?disabled="${disabled}"
			?has-notification="${hasNotification}"
			icon="${icon}"
			?notification-text="${ifDefined(notificationText)}"
			style="margin: 0 60px"
			text="${text}">${dropdown}</d2l-navigation-dropdown-button-icon>
	`;
};

describe('d2l-navigation-button', () => {

	[
		{ name: 'icon-text', template: create() },
		{ name: 'icon-text-disabled', template: create({ disabled: true }) },
		{ name: 'icon-text-no-highlight-border', template: create({ noHighlightBorder: true }) },
		{ name: 'icon-text-flip', template: create({ iconPosition: 'end' }) },
		{ name: 'icon-text-hidden', template: create({ textHidden: true }), tooltip: true },
		{ name: 'icon-text-hidden-disabled', template: create({ disabled: true, textHidden: true }) },
		{ name: 'dropdown-icon-off', template: createDropdown(), tooltip: true },
		{ name: 'dropdown-icon-on', template: createDropdown({ hasNotification: true, notificationText: 'You have new notifications', text: 'Notification on' }), tooltip: true },
		{ name: 'dropdown-icon-disabled', template: createDropdown({ disabled: true, text: 'Disabled' }) },
		{ name: 'dropdown-custom', template: html`<d2l-navigation-dropdown-button-custom><span slot="opener">custom</span><d2l-dropdown-content>content</d2l-dropdown-content></d2l-navigation-dropdown-button-custom>` }
	].forEach(({ name, template, tooltip }) => {
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

			it('focus', async() => {
				if (tooltip) {
					focusElem(elem);
					await oneEvent(elem, 'd2l-tooltip-show');
				} else {
					await focusElem(elem);
				}
				await expect(elem).to.be.golden();
			});

		});
	});

});
