import '../../../src/components/grade-result/grade-result-presentational.js';
import { fixture, html } from '@brightspace-ui/testing';
import { testDiff } from './vdiff-utils.js';

describe('optional override text substitution visual diff tests', () => {

	it('custom-manual-override-clear-text', async() => {
		const fixtureElement = await fixture(
			html`
				<div style='margin: 10px 18px; padding: 50px; display: flex; justify-content: center;'>
					<d2l-labs-grade-result-presentational
						grade-type="Numeric"
						label-text="Overall Grade"
						score-numerator="5"
						score-denominator="20"
						custom-manual-override-clear-text="Substituted Override Clear Text"
						is-manual-override-active
					></d2l-labs-grade-result-presentational>
				<div>`,
			{ pagePadding: false }
		);

		await testDiff(fixtureElement);
	});

});
