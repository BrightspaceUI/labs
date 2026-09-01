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

	[false, true].forEach(rtl => {

		describe(rtl ? 'rtl' : 'ltr', () => {

			it('default', async() => {
				const menu = await fixture(defaultFixture, { rtl });
				await expect(menu).to.be.golden();
			});

			it('mixed', async() => {
				const menu = await fixture(mixedFixture, { rtl });
				await expect(menu).to.be.golden();
			});

			it('child view', async() => {
				const menu = await fixture(childViewFixture, { rtl });
				await expect(menu).to.be.golden();
			});

			it('disabled', async() => {
				const menu = await fixture(disabledFixture, { rtl });
				await expect(menu).to.be.golden();
			});

			it('long text', async() => {
				const menu = await fixture(longTextFixture, { rtl });
				await expect(menu).to.be.golden();
			});

			it('single line', async() => {
				const menu = await fixture(singleLineFixture, { rtl });
				await expect(menu).to.be.golden();
			});

			it('focus', async() => {
				const menu = await fixture(defaultFixture, { rtl });
				await focusElem(menu.querySelector('d2l-menu-item-ai'));
				await expect(menu).to.be.golden();
			});

			it('hover', async() => {
				const menu = await fixture(defaultFixture, { rtl });
				await hoverElem(menu.querySelector('d2l-menu-item-ai'));
				await expect(menu).to.be.golden();
			});

		});

	});

});
