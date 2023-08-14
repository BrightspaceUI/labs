import '../../../src/components/opt-in-flyout/opt-out-flyout.js';
import { clickElem, expect, fixture, html, oneEvent } from '@brightspace-ui/testing';
import TestUtil from './utilities.js';

describe('d2l-labs-opt-out-flyout', () => {

	describe('defaults', () => {

		let flyout, innerFlyout;

		beforeEach(async() => {
			flyout = await fixture(html`<d2l-labs-opt-out-flyout open></d2l-labs-opt-out-flyout>`);
			innerFlyout = flyout.shadowRoot.querySelector('d2l-labs-opt-in-flyout-impl');
		});

		it('should not contain short description', () => {
			const shortDescription = innerFlyout.shadowRoot.querySelector('#short-description');
			expect(shortDescription).to.not.exist;
		});

		it('should not contain long description', () => {
			const longDescription = innerFlyout.shadowRoot.querySelector('#long-description');
			expect(longDescription).to.not.exist;
		});

		it('should not contain tutorial link or help documentation if not set', () => {
			const tutorial = innerFlyout.shadowRoot.querySelector('.flyout-tutorial');
			expect(tutorial).to.not.exist;
		});

		it('should not display reason dialog', () => {
			const dialog = innerFlyout.shadowRoot.querySelector('d2l-labs-opt-out-dialog');
			expect(dialog).to.equal(null);
		});

	});

	describe('properties specified', () => {

		let flyout, innerFlyout;

		beforeEach(async() => {
			flyout = await fixture(html`
				<d2l-labs-opt-out-flyout
					open
					title="Flyout Demo"
					short-description="This is a short description"
					long-description="This is a long description"
					tab-position="right"
					tutorial-link="https://www.testlink1.com"
					help-docs-link="https://www.testlink2.com"></d2l-labs-opt-out-flyout>
			`);
			innerFlyout = flyout.shadowRoot.querySelector('d2l-labs-opt-in-flyout-impl');
		});

		it('should contain short description', () => {
			const shortDescription = innerFlyout.shadowRoot.querySelector('#short-description');
			expect(shortDescription).to.exist;
		});

		it('should contain title', () => {
			const title = innerFlyout.shadowRoot.querySelector('#title');
			expect(title.textContent).to.equal('Flyout Demo');
		});

		it('should reflect title attribute to property', async() => {
			const newTitle = 'new title';
			flyout.setAttribute('title', newTitle);
			await flyout.updateComplete;
			await innerFlyout.updateComplete;
			expect(flyout.title).to.equal(newTitle);
			const title = innerFlyout.shadowRoot.querySelector('#title');
			expect(title.textContent).to.equal(newTitle);
		});

		it('should contain long description', () => {
			const longDescription = innerFlyout.shadowRoot.querySelector('#long-description');
			expect(longDescription).to.exist;
		});

		it('should contain tutorial link', () => {
			const tutorial = innerFlyout.shadowRoot.querySelector('.flyout-tutorial');
			const links = TestUtil.selectVisible(tutorial, 'a');

			expect(links.length).to.equal(2);

			expect(links[0].href).to.contain('https://www.testlink1.com');
			expect(links[0].textContent).to.contain('tutorials');
		});

		it('should contain help documentation link', () => {
			const tutorial = innerFlyout.shadowRoot.querySelector('.flyout-tutorial');
			const links = TestUtil.selectVisible(tutorial, 'a');

			expect(links.length).to.equal(2);

			expect(links[1].href).to.contain('https://www.testlink2.com');
			expect(links[1].textContent).to.contain('help documentation');
		});

		it('should contain only tutorial specific text when only tutorial link specified', async() => {
			innerFlyout.helpDocsLink = null;
			await innerFlyout.updateComplete;
			const tutorial = innerFlyout.shadowRoot.querySelector('.flyout-tutorial');
			const links = TestUtil.selectVisible(tutorial, 'a');

			expect(links.length).to.equal(1);

			expect(links[0].href).to.contain('https://www.testlink1.com');
			expect(links[0].textContent).to.contain('tutorials');
		});

		it('should contain only help documentation specific text when only help link specified', async() => {
			innerFlyout.tutorialLink = null;
			await innerFlyout.updateComplete;
			const tutorial = innerFlyout.shadowRoot.querySelector('.flyout-tutorial');
			const links = TestUtil.selectVisible(tutorial, 'a');

			expect(links.length).to.equal(1);

			expect(links[0].href).to.contain('https://www.testlink2.com');
			expect(links[0].textContent).to.contain('help documentation');
		});

		it('should contain enable button', () => {
			const button = innerFlyout.shadowRoot.querySelector('d2l-button[primary]');
			expect(button.textContent).to.equal('Leave it on');
			expect(button).to.exist;
		});

		it('should contain turn it off button', () => {
			const button = innerFlyout.shadowRoot.querySelector('d2l-button:not([primary])');
			expect(button.textContent).to.equal('Turn it off');
			expect(button).to.exist;
		});

		it('should fire opt-in event when "leave it on" button clicked', async() => {
			const button = innerFlyout.shadowRoot.querySelector('d2l-button[primary]');
			clickElem(button);
			await oneEvent(flyout, 'opt-in');
		});

		it('should fire flyout-closed event when "leave it on" button clicked and not display dialog', async() => {
			const button = innerFlyout.shadowRoot.querySelector('d2l-button[primary]');
			clickElem(button);
			await oneEvent(flyout, 'flyout-closed');
			const dialog = innerFlyout.shadowRoot.querySelector('d2l-labs-opt-out-dialog');
			expect(dialog).to.not.exist;
		});

		it('should open reason dialog when "turn it off" button clicked', async() => {
			const button = innerFlyout.shadowRoot.querySelector('d2l-button:not([primary])');
			await clickElem(button);
			const dialog = innerFlyout.shadowRoot.querySelector('d2l-labs-opt-out-dialog');
			expect(dialog).to.exist;
		});

		it('should fire flyout-closed event when tab clicked', async() => {
			const tab = innerFlyout.shadowRoot.querySelector('.flyout-tab');
			clickElem(tab);
			await oneEvent(flyout, 'flyout-closed');
		});

	});

	describe('flyout closed', () => {

		it('should fire flyout-opened event when tab clicked', async() => {
			const flyout = await fixture(html`<d2l-labs-opt-out-flyout></d2l-labs-opt-out-flyout>`);
			const innerFlyout = flyout.shadowRoot.querySelector('d2l-labs-opt-in-flyout-impl');
			const tab = innerFlyout.shadowRoot.querySelector('.flyout-tab');
			clickElem(tab);
			await oneEvent(flyout, 'flyout-opened');
		});

	});

});