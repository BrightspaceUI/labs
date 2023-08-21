import '../../../src/components/opt-in-flyout/opt-out-dialog.js';
import '../../../src/components/opt-in-flyout/opt-out-reason.js';
import { clickElem, expect, fixture, html, oneEvent } from '@brightspace-ui/testing';

const setSelection = (elem, selectIndex) => {
	const reasonSelector = elem.shadowRoot.querySelector('d2l-labs-opt-out-reason-selector');
	const select = reasonSelector.shadowRoot.querySelector('select');
	select.selectedIndex = selectIndex;
	reasonSelector._reasonSelected();
};

const setFeedback = (flyout, value) => {
	const feedback = flyout.shadowRoot.querySelector('d2l-input-textarea');
	feedback.value = value;
};

const clickDone = (elem) => {
	const doneButton = elem.shadowRoot.querySelector('d2l-button[primary]');
	clickElem(doneButton);
};

describe('opt-out-dialog', () => {

	describe('events', () => {

		let elem;

		beforeEach(async() => {
			elem = await fixture(html`<d2l-labs-opt-out-dialog></d2l-labs-opt-out-dialog>`);
		});

		it('should dispatch "confirm" event when reason selected and done clicked (no feedback)', async() => {
			setSelection(elem, 1);
			clickDone(elem);
			const e = await oneEvent(elem, 'confirm');
			expect(e.detail.reason).to.equal('PreferOldExperience');
			expect(e.detail.feedback).to.equal('');
		});

		it('should dispatch "confirm" event when reason selected and done clicked with feedback', async() => {
			const textFeedback = 'not a fan';
			setSelection(elem, 1);
			setFeedback(elem, textFeedback);
			clickDone(elem);
			const e = await oneEvent(elem, 'confirm');
			expect(e.detail.reason).to.equal('PreferOldExperience');
			expect(e.detail.feedback).to.equal(textFeedback);
		});

	});

});
