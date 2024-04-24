import '../../d2l-grade-result.js';
import '../../src/components/d2l-grade-result-presentational.js';
import { fixture, html } from '@brightspace-ui/testing';
import { testDiff } from './utils.js';

describe('optional override text substitution visual diff tests', () => {

	it('custom-manual-override-clear-text', async() => {
		const fixtureElement = await fixture(
			html`
				<div style='margin: 10px 18px; padding: 50px; display: flex; justify-content: center;'>
					<d2l-labs-d2l-grade-result-presentational
						gradeType='Numeric'
						labelText='Overall Grade'
						scoreNumerator=5
						scoreDenominator=20
						customManualOverrideClearText='Substituted Override Clear Text'
						isGradeAutoCompleted
						isManualOverrideActive
					></d2l-labs-d2l-grade-result-presentational>
				<div>`,
			{ pagePadding: false }
		);

		await testDiff(fixtureElement);
	});

});
