import '@brightspace-ui/core/components/menu/menu.js';
import '../../../src/components/menu-item-ai/menu-item-ai.js';
import { clickElem, expect, fixture, html, oneEvent } from '@brightspace-ui/testing';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';

const basicFixture = html`
	<d2l-menu label="Astronomy">
		<d2l-menu-item-ai text="Summarize with AI"></d2l-menu-item-ai>
	</d2l-menu>
`;

const childViewFixture = html`
	<d2l-menu label="Astronomy">
		<d2l-menu-item-ai text="Summarize with AI">
			<d2l-menu label="Summarize with AI">
				<d2l-menu-item-ai text="Short summary"></d2l-menu-item-ai>
			</d2l-menu>
		</d2l-menu-item-ai>
	</d2l-menu>
`;

describe('d2l-menu-item-ai', () => {

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-menu-item-ai');
		});
	});

	describe('rendering', () => {
		it('should render the ai icon before the text', async() => {
			const menu = await fixture(basicFixture);
			const item = menu.querySelector('d2l-menu-item-ai');
			const icon = item.shadowRoot.querySelector('d2l-icon[icon="tier1:ai"]');
			const text = item.shadowRoot.querySelector('.d2l-menu-item-text');

			expect(icon).to.exist;
			expect(icon.getAttribute('icon')).to.equal('tier1:ai');
			expect(icon.compareDocumentPosition(text) & Node.DOCUMENT_POSITION_FOLLOWING).to.be.greaterThan(0);
		});

		it('should render the text', async() => {
			const menu = await fixture(basicFixture);
			const item = menu.querySelector('d2l-menu-item-ai');
			expect(item.shadowRoot.querySelector('.d2l-menu-item-text').textContent).to.equal('Summarize with AI');
		});

		it('should not render a chevron when there is no child view', async() => {
			const menu = await fixture(basicFixture);
			const item = menu.querySelector('d2l-menu-item-ai');
			expect(item.hasChildView).to.not.be.true;
			expect(item.shadowRoot.querySelector('d2l-icon[icon="tier1:chevron-right"]')).to.not.exist;
		});

		it('should render a chevron when there is a child view', async() => {
			const menu = await fixture(childViewFixture);
			const item = menu.querySelector('d2l-menu-item-ai');
			await item.updateComplete;

			expect(item.hasChildView).to.be.true;
			expect(item.getAttribute('aria-haspopup')).to.equal('true');
			expect(item.shadowRoot.querySelector('d2l-icon[icon="tier1:chevron-right"]')).to.exist;
		});
	});

	describe('accessibility attributes', () => {
		it('should have the menuitem role and use the text as the label', async() => {
			const menu = await fixture(basicFixture);
			const item = menu.querySelector('d2l-menu-item-ai');
			expect(item.getAttribute('role')).to.equal('menuitem');
			expect(item.getAttribute('aria-label')).to.equal('Summarize with AI');
		});

		it('should use the description as the label when provided', async() => {
			const menu = await fixture(basicFixture);
			const item = menu.querySelector('d2l-menu-item-ai');
			item.description = 'Summarize this topic with AI';
			await item.updateComplete;
			expect(item.getAttribute('aria-label')).to.equal('Summarize this topic with AI');
		});

		it('should set aria-disabled when disabled', async() => {
			const menu = await fixture(basicFixture);
			const item = menu.querySelector('d2l-menu-item-ai');
			item.disabled = true;
			await item.updateComplete;
			expect(item.hasAttribute('disabled')).to.be.true;
			expect(item.getAttribute('aria-disabled')).to.equal('true');
		});
	});

	describe('events', () => {
		it('should dispatch d2l-menu-item-select when clicked', async() => {
			const menu = await fixture(basicFixture);
			const item = menu.querySelector('d2l-menu-item-ai');

			clickElem(item);
			const e = await oneEvent(item, 'd2l-menu-item-select');
			expect(e.target).to.equal(item);
		});

		it('should not dispatch d2l-menu-item-select when disabled', async() => {
			const menu = await fixture(basicFixture);
			const item = menu.querySelector('d2l-menu-item-ai');
			item.disabled = true;
			await item.updateComplete;

			let selected = false;
			item.addEventListener('d2l-menu-item-select', () => selected = true);
			await clickElem(item);
			expect(selected).to.be.false;
		});
	});
});
