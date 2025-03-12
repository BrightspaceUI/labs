import '../../../src/components/accordion/accordion.js';
import { clickElem, expect, fixture, html } from '@brightspace-ui/testing';

const accordionCollapseFixture = html`
	<d2l-labs-accordion>
		<d2l-labs-accordion-collapse title="Item 1">Test</d2l-labs-accordion-collapse>
		<d2l-labs-accordion-collapse title="Item 2">Test</d2l-labs-accordion-collapse>
		<d2l-labs-accordion-collapse title="Item 3">Test</d2l-labs-accordion-collapse>
	</d2l-labs-accordion>
`;
const accordionCollapseFixtureLabel = html`
	<d2l-labs-accordion>
		<d2l-labs-accordion-collapse label="Item 1">Test</d2l-labs-accordion-collapse>
		<d2l-labs-accordion-collapse label="Item 2">Test</d2l-labs-accordion-collapse>
		<d2l-labs-accordion-collapse label="Item 3">Test</d2l-labs-accordion-collapse>
	</d2l-labs-accordion>
`;

describe('d2l-labs-accordion', () => {

	it('initial select state', async() => {
		const myEl = await fixture(accordionCollapseFixture);
		expect(myEl.selected).to.not.exist;
		expect(myEl.items[0].opened).to.be.false;
		expect(myEl.items[1].opened).to.be.false;
		expect(myEl.items[2].opened).to.be.false;
		expect(myEl.items[0].shadowRoot.querySelector('.collapse-title').title).to.equal('');
		expect(myEl.items[1].shadowRoot.querySelector('.collapse-title').title).to.equal('');
		expect(myEl.items[2].shadowRoot.querySelector('.collapse-title').title).to.equal('');
	});

	it('state change', async() => {
		const myEl = await fixture(accordionCollapseFixture);
		expect(myEl.items[0].opened).to.be.false;
		expect(myEl.items[1].opened).to.be.false;
		expect(myEl.items[2].opened).to.be.false;
		myEl.selected = 1;
		expect(myEl.items[0].opened).to.be.false;
		expect(myEl.items[1].opened).to.be.true;
		expect(myEl.items[2].opened).to.be.false;
	});

	it('trigger test', async() => {
		const myEl = await fixture(accordionCollapseFixture);
		expect(myEl.items[0].opened).to.be.false;
		await clickElem(myEl.items[0].shadowRoot.querySelector('#trigger'));
		expect(myEl.items[0].opened).to.be.true;
	});

	it('label instead of title', async() => {
		const myEl = await fixture(accordionCollapseFixtureLabel);
		expect(myEl.items[0].shadowRoot.querySelector('.collapse-title').title).to.equal('Item 1');
		expect(myEl.items[1].shadowRoot.querySelector('.collapse-title').title).to.equal('Item 2');
		expect(myEl.items[2].shadowRoot.querySelector('.collapse-title').title).to.equal('Item 3');
	});

});
