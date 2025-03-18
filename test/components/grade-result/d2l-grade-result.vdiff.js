import '../../d2l-grade-result.js';
import '../../src/components/d2l-grade-result-presentational.js';
import { fixture, html } from '@brightspace-ui/testing';
import { testDiff } from './utils.js';

describe('d2l-labs-d2l-grade-result', () => {

	it('d2l-labs-d2l-grade-result', async() => {
		const fixtureElement = await fixture(
			html`
				<div style='margin: 10px 18px; padding: 50px; display: flex; justify-content: center;'>
					<d2l-labs-d2l-grade-result></d2l-labs-d2l-grade-result>
				<div>`,
			{ pagePadding: false }
		);

		await testDiff(fixtureElement);
	});

});
