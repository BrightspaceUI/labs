import '@brightspace-ui/core/components/menu/menu.js';
import '@brightspace-ui/core/components/menu/menu-item.js';
import '../../../src/components/menu-item-ai/menu-item-ai.js';
import { expect, fixture, focusElem, hoverElem } from '@brightspace-ui/testing';
import { html } from 'lit';

const defaultFixture = html`
	<d2l-menu label="Astronomy" style="width: 300px;">
		<d2l-menu-item-ai text="Summarize with AI"></d2l-menu-item-ai>
	</d2l-menu>
`;

const mixedFixture = html`
	<d2l-menu label="Astronomy" style="width: 300px;">
		<d2l-menu-item text="Earth"></d2l-menu-item>
		<d2l-menu-item-ai text="Summarize with AI"></d2l-menu-item-ai>
		<d2l-menu-item text="Mars"></d2l-menu-item>
	</d2l-menu>
`;

const childViewFixture = html`
	<d2l-menu label="Astronomy" style="width: 300px;">
		<d2l-menu-item-ai text="Summarize with AI">
			<d2l-menu label="Summarize with AI">
				<d2l-menu-item text="Short summary"></d2l-menu-item>
			</d2l-menu>
		</d2l-menu-item-ai>
	</d2l-menu>
`;

const disabledFixture = html`
	<d2l-menu label="Astronomy" style="width: 300px;">
		<d2l-menu-item-ai text="Summarize with AI" disabled></d2l-menu-item-ai>
	</d2l-menu>
`;

const longTextFixture = html`
	<d2l-menu label="Astronomy" style="width: 200px;">
		<d2l-menu-item-ai text="Summarize this topic with AI so that the text wraps and eventually truncates"></d2l-menu-item-ai>
	</d2l-menu>
`;

const singleLineFixture = html`
	<d2l-menu label="Astronomy" style="width: 200px;">
		<d2l-menu-item-ai lines="1" text="Summarize this topic with AI so that the text truncates"></d2l-menu-item-ai>
	</d2l-menu>
`;

describe('menu-item-ai', () => {

	[
		{ name: 'default', template: defaultFixture },
		{ name: 'default-rtl', template: defaultFixture, rtl: true },
		{ name: 'mixed', template: mixedFixture },
		{ name: 'child-view', template: childViewFixture },
		{ name: 'child-view-rtl', template: childViewFixture, rtl: true },
		{ name: 'disabled', template: disabledFixture },
		{ name: 'long-text', template: longTextFixture },
		{ name: 'single-line', template: singleLineFixture },
		{ name: 'single-line-rtl', template: singleLineFixture, rtl: true },
		{ name: 'focus', template: defaultFixture, action: elem => focusElem(elem.querySelector('d2l-menu-item-ai')) },
		{ name: 'hover', template: defaultFixture, action: elem => hoverElem(elem.querySelector('d2l-menu-item-ai')) }
	].forEach(({ name, rtl, template, action }) => {
		it(name, async() => {
			const elem = await fixture(template, { rtl });
			if (action) await action(elem);
			await expect(elem).to.be.golden();
		});
	});

});
