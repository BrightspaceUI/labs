import '../../../src/components/opt-in-flyout/flyout-impl.js';
import '../../../src/components/opt-in-flyout/opt-in-flyout.js';
import '../../../src/components/opt-in-flyout/opt-out-flyout.js';
import { expect, fixture, html, oneEvent, sendKeysElem } from '@brightspace-ui/testing';

export function wrap(elem) {
	return html`<div style="height: 500px; position: relative; width: 100%;">${elem}</div>`;
}

describe('flyout-impl', () => {

	it('closed', async() => {
		const elem = await fixture(wrap(html`
			<d2l-labs-opt-in-flyout-impl flyout-title="Flyout Impl">
			</d2l-labs-opt-in-flyout-impl>
		`));
		await expect(elem).to.be.golden({ margin: 0 });
	});

	it('closed-focus', async() => {
		const elem = await fixture(wrap(html`
			<d2l-labs-opt-in-flyout-impl flyout-title="Flyout Impl" opened>
			</d2l-labs-opt-in-flyout-impl>
		`));
		const tabButton = elem.querySelector('d2l-labs-opt-in-flyout-impl').shadowRoot.querySelector('#flyout-tab');
		sendKeysElem(tabButton, 'press', 'Enter');
		await oneEvent(elem, 'flyout-closed');
		await expect(elem).to.be.golden({ margin: 0 });
	});

	it('opened', async() => {
		const elem = await fixture(wrap(html`
			<d2l-labs-opt-in-flyout-impl flyout-title="Flyout Impl" opened>
			</d2l-labs-opt-in-flyout-impl>
		`));
		await expect(elem).to.be.golden({ margin: 0 });
	});

	it('opened-focus', async() => {
		const elem = await fixture(wrap(html`
			<d2l-labs-opt-in-flyout-impl flyout-title="Flyout Impl">
			</d2l-labs-opt-in-flyout-impl>
		`));
		const tabButton = elem.querySelector('d2l-labs-opt-in-flyout-impl').shadowRoot.querySelector('#flyout-tab');
		sendKeysElem(tabButton, 'press', 'Enter');
		await oneEvent(elem, 'flyout-opened');
		await expect(elem).to.be.golden({ margin: 0 });
	});

	it('short description only', async() => {
		const elem = await fixture(wrap(html`
			<d2l-labs-opt-in-flyout-impl
				flyout-title="Flyout Impl"
				opened
				short-description="short description">
			</d2l-labs-opt-in-flyout-impl>
		`));
		await expect(elem).to.be.golden({ margin: 0 });
	});

	it('long description only', async() => {
		const elem = await fixture(wrap(html`
			<d2l-labs-opt-in-flyout-impl
				flyout-title="Flyout Impl"
				opened
				long-description="long description">
			</d2l-labs-opt-in-flyout-impl>
		`));
		await expect(elem).to.be.golden({ margin: 0 });
	});

	it('short and long description', async() => {
		const elem = await fixture(wrap(html`
			<d2l-labs-opt-in-flyout-impl
				flyout-title="Flyout Impl"
				opened
				long-description="long description"
				short-description="short description">
			</d2l-labs-opt-in-flyout-impl>
		`));
		await expect(elem).to.be.golden({ margin: 0 });
	});

	it('tutorial link only', async() => {
		const elem = await fixture(wrap(html`
			<d2l-labs-opt-in-flyout-impl
				flyout-title="Flyout Impl"
				opened
				tutorial-link="https://www.d2l.com">
			</d2l-labs-opt-in-flyout-impl>
		`));
		await expect(elem).to.be.golden({ margin: 0 });
	});

	it('help-docs link only', async() => {
		const elem = await fixture(wrap(html`
			<d2l-labs-opt-in-flyout-impl
				flyout-title="Flyout Impl"
				help-docs-link="https://www.d2l.com"
				opened>
			</d2l-labs-opt-in-flyout-impl>
		`));
		await expect(elem).to.be.golden({ margin: 0 });
	});

	it('tutorial and help-docs links', async() => {
		const elem = await fixture(wrap(html`
			<d2l-labs-opt-in-flyout-impl
				flyout-title="Flyout Impl"
				help-docs-link="https://www.d2l.com"
				opened
				tutorial-link="https://www.d2l.com">
			</d2l-labs-opt-in-flyout-impl>
		`));
		await expect(elem).to.be.golden({ margin: 0 });
	});

});

describe('opt-in-flyout', () => {

	it('opened', async() => {
		const elem = await fixture(wrap(html`
			<d2l-labs-opt-in-flyout
				flyout-title="Opt-In Flyout"
				opened>
			</d2l-labs-opt-in-flyout>
		`));
		await expect(elem).to.be.golden({ margin: 0 });
	});

});

describe('opt-out-flyout', () => {

	it('opened', async() => {
		const elem = await fixture(wrap(html`
			<d2l-labs-opt-out-flyout flyout-title="Opt-Out Flyout" opened>
			</d2l-labs-opt-out-flyout>
		`));
		await expect(elem).to.be.golden({ margin: 0 });
	});

	it('opted out', async() => {
		const elem = await fixture(wrap(html`
			<d2l-labs-opt-out-flyout flyout-title="Opt-Out Flyout" opened>
			</d2l-labs-opt-out-flyout>
		`));
		const optOutButton = elem.querySelector('d2l-labs-opt-out-flyout')
			.shadowRoot.querySelector('d2l-labs-opt-in-flyout-impl')
			.shadowRoot.querySelector('#opt-out-button');
		sendKeysElem(optOutButton, 'press', 'Enter');
		await expect(elem).to.be.golden({ margin: 0 });
	});

});
