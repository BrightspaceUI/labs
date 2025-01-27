import '../../../src/components/navigation/navigation-skip.js';
import { expect, fixture, focusElem, html } from '@brightspace-ui/testing';

describe('d2l-labs-navigation-skip', () => {

	it('focus', async() => {
		const elem = await fixture(html`
			<div class="width: 600px;">
				<d2l-labs-navigation-skip text="Skip to custom place" class="vdiff-include"></d2l-labs-navigation-skip>
				<p>Some content</p>
			</div>
		`);
		await focusElem(elem.querySelector('d2l-labs-navigation-skip'));
		await expect(elem).to.be.golden();
	});

});
