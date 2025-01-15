import '../../d2l-navigation-skip-main.js';
import { expect, fixture, focusElem, html } from '@brightspace-ui/testing';

const mainFixture = html`
	<div class="width: 600px;">
		<d2l-navigation-skip-main class="vdiff-include"></d2l-navigation-skip-main>
		<main>
			<h1>Heading</h1>
			<p>Some content</p>
		</main>
	</div>
`;

describe('d2l-navigation-skip-main', () => {

	['en', 'ar'].forEach(lang => {
		it(lang, async() => {
			const elem = await fixture(mainFixture, { lang });
			await focusElem(elem.querySelector('d2l-navigation-skip-main'));
			await expect(elem).to.be.golden();
		});
	});

});
