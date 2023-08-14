import '../../../src/components/opt-in-flyout/opt-out-dialog.js';
import '../../../src/components/opt-in-flyout/opt-out-reason.js';
import { clickElem, expect, fixture, html, oneEvent } from '@brightspace-ui/testing';

const setSelection = (reasonSelector, selectIndex) => {
	const select = reasonSelector.shadowRoot.querySelector('select');
	select.selectedIndex = selectIndex;
	reasonSelector._reasonSelected();
};

const setFeedback = (flyout, value) => {
	const feedback = flyout.shadowRoot.querySelector('d2l-input-textarea');
	feedback.value = value;
};

const clickDone = (flyout) => {
	const doneButton = flyout.shadowRoot.querySelector('d2l-button[primary]');
	clickElem(doneButton);
};

describe('opt-out-dialog', () => {

	describe('defaults', () => {

		let flyout, reasonSelector;

		beforeEach(async() => {
			flyout = await fixture(html`<d2l-labs-opt-out-dialog></d2l-labs-opt-out-dialog>`);
			reasonSelector = flyout.shadowRoot.querySelector('d2l-labs-opt-out-reason-selector');
		});

		it('should contain a title', () => {
			const message = flyout.shadowRoot.querySelector('#title-label');
			expect(message.textContent).to.contain('Let us know how to improve!');
		});

		it('should contain d2l-labs-opt-out-reason-selector', () => {
			const selector = flyout.shadowRoot.querySelector('d2l-labs-opt-out-reason-selector');
			expect(selector).to.exist;
		});

		it('should contain feedback text input box', () => {
			const feedback = flyout.shadowRoot.querySelector('#feedback');
			expect(feedback).to.exist;
		});

		it('should contain cancel button', () => {
			const cancelButton = flyout.shadowRoot.querySelector('d2l-button:not([primary])');
			expect(cancelButton).to.exist;
		});

		it('should fire confirm event when reason selected and done clicked (no feedback)', async() => {
			setSelection(reasonSelector, 1);
			clickDone(flyout);
			const e = await oneEvent(flyout, 'confirm');
			expect(e.detail.reason).to.equal('PreferOldExperience');
			expect(e.detail.feedback).to.equal('');
		});

		it('should fire confirm event when reason selected and done clicked with feedback', async() => {
			const textFeedback = 'not a fan';
			setSelection(reasonSelector, 1);
			setFeedback(flyout, textFeedback);
			clickDone(flyout);
			const e = await oneEvent(flyout, 'confirm');
			expect(e.detail.reason).to.equal('PreferOldExperience');
			expect(e.detail.feedback).to.equal(textFeedback);
		});

	});

	describe('options specified', () => {

		let flyout, reasonSelector;

		beforeEach(async() => {
			flyout = await fixture(html`
				<d2l-labs-opt-out-dialog>
					<d2l-labs-opt-out-reason key="test-1" text="Test Option 1"></d2l-labs-opt-out-reason>
					<d2l-labs-opt-out-reason key="test-2" text="Test Option 2"></d2l-labs-opt-out-reason>
				</d2l-labs-opt-out-dialog>
			`);
			reasonSelector = flyout.shadowRoot.querySelector('d2l-labs-opt-out-reason-selector');
		});

		it('should contain the first option', async() => {
			setSelection(reasonSelector, 1);
			clickDone(flyout);
			const e = await oneEvent(flyout, 'confirm');
			expect(e.detail.reason).to.equal('test-1');
		});

		it('should contain the second option', async() => {
			setSelection(reasonSelector, 2);
			clickDone(flyout);
			const e = await oneEvent(flyout, 'confirm');
			expect(e.detail.reason).to.equal('test-2');
		});

	});

	describe('reason hidden', () => {

		it('fires confirm with no reason', async() => {
			const flyout = await fixture(html`
				<d2l-labs-opt-out-dialog hide-reason>
					<d2l-labs-opt-out-reason key="test-1" text="Test Option 1"></d2l-labs-opt-out-reason>
					<d2l-labs-opt-out-reason key="test-2" text="Test Option 2"></d2l-labs-opt-out-reason>
				</d2l-labs-opt-out-dialog>
			`);
			const hiddenReason = flyout.shadowRoot.querySelector('div[hidden] > #reason-selector');
			expect(hiddenReason).to.exist;
			clickDone(flyout);
			const e = await oneEvent(flyout, 'confirm');
			expect(e.detail.reason).to.equal('');
		});

	});

	describe('feedback hidden', () => {

		it('fires confirm with no feedback', async() => {
			const flyout = await fixture(html`<d2l-labs-opt-out-dialog hide-feedback></d2l-labs-opt-out-dialog>`);
			const hiddenFeedback = flyout.shadowRoot.querySelector('div[hidden] > #feedback');
			expect(hiddenFeedback).to.exist;
			clickDone(flyout);
			const e = await oneEvent(flyout, 'confirm');
			expect(e.detail.feedback).to.equal('');
		});

	});

});
