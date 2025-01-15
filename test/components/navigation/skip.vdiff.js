import '../../d2l-navigation-skip.js';
import { expect, fixture, focusElem, html } from '@brightspace-ui/testing';

describe('d2l-navigation-skip', () => {

	it('focus', async() => {
		const elem = await fixture(html`
			<div class="width: 600px;">
				<d2l-navigation-skip text="Skip to custom place" class="vdiff-include"></d2l-navigation-skip>
				<p>Some content</p>
			</div>
		`);
		await focusElem(elem.querySelector('d2l-navigation-skip'));
		await expect(elem).to.be.golden();
	});

});
