import '../../../src/components/grade-result/grade-result-presentational.js';
import { fixture, html } from '@brightspace-ui/testing';
import { ifDefined } from 'lit/directives/if-defined.js';
import { testDiff } from './vdiff-utils.js';

describe('write enabled visual diff tests', () => {

	const tests = [
		{
			name: 'write-enabled-number-grade-no-icons',
			gradeType: 'Numeric',
			labelText: 'Overall Grade',
			scoreNumerator: 5,
			scoreDenominator: 20
		},
		{
			name: 'write-enabled-number-decimal-grade-no-icons',
			gradeType: 'Numeric',
			labelText: 'Overall Grade',
			scoreNumerator: 1.55555,
			scoreDenominator: 20
		},
		{
			name: 'write-enabled-number-grade-icons',
			gradeType: 'Numeric',
			labelText: 'Overall Grade',
			scoreNumerator: 5,
			scoreDenominator: 20,
			includeGradeButton: true,
			includeReportsButton: true
		},
		{
			name: 'write-enabled-number-grade-icons-tooltips-grade',
			gradeType: 'Numeric',
			labelText: 'Overall Grade',
			scoreNumerator: 5,
			scoreDenominator: 20,
			gradeButtonTooltip: 'Assignment 1 Grade Item Attached',
			reportsButtonTooltip: 'Class and user statistics',
			includeGradeButton: true,
			includeReportsButton: true,
			focusGradesButton: true
		},
		{
			name: 'write-enabled-number-grade-icons-tooltips-reports',
			gradeType: 'Numeric',
			labelText: 'Overall Grade',
			scoreNumerator: 5,
			scoreDenominator: 20,
			gradeButtonTooltip: 'Assignment 1 Grade Item Attached',
			reportsButtonTooltip: 'Class and user statistics',
			includeGradeButton: true,
			includeReportsButton: true,
			focusReportsButton: true
		},
		{
			name: 'write-enabled-number-range-validation-error',
			gradeType: 'Numeric',
			labelText: 'Overall Grade',
			scoreNumerator: -2,
			scoreDenominator: 20
		},
		{
			name: 'write-enabled-number-range-validation-error-tooltip',
			gradeType: 'Numeric',
			labelText: 'Overall Grade',
			scoreNumerator: -2,
			scoreDenominator: 20,
			focusInputBox: true
		},
		{
			name: 'write-enabled-number-negative-marking-enabled',
			gradeType: 'Numeric',
			labelText: 'Overall Grade',
			scoreNumerator: -2,
			scoreDenominator: 20,
			allowNegativeScore: true
		},
		{
			name: 'write-enabled-negative-grade-warning',
			gradeType: 'Numeric',
			labelText: 'Attempt Grade',
			scoreNumerator: 0,
			scoreDenominator: 20,
			showFlooredScoreWarning: true,
			focusInputBox: true
		},
		{
			name: 'write-enabled-negative-grade-warning-icons',
			gradeType: 'Numeric',
			labelText: 'Attempt Grade',
			scoreNumerator: 0,
			scoreDenominator: 20,
			includeGradeButton: true,
			includeReportsButton: true,
			showFlooredScoreWarning: true,
			focusInputBox: true
		},
		{
			name: 'write-enabled-number-dynamic-width',
			gradeType: 'Numeric',
			labelText: 'Overall Grade',
			scoreNumerator: 33333333,
			scoreDenominator: 33333333
		},
		{
			name: 'write-enabled-letter-grade-no-icons',
			gradeType: 'LetterGrade',
			labelText: 'Overall Grade',
			letterGradeOptions: { '0': { 'LetterGrade': 'None', 'PercentStart': null }, '1': { 'LetterGrade': 'A', 'PercentStart': '75' }, '2': { 'LetterGrade': 'B', 'PercentStart': '50' } },
			selectedLetterGrade: '2'
		},
		{
			name: 'write-enabled-letter-grade-icons',
			gradeType: 'LetterGrade',
			labelText: 'Overall Grade',
			letterGradeOptions: { '0': { 'LetterGrade': 'None', 'PercentStart': null }, '1': { 'LetterGrade': 'A', 'PercentStart': '75' }, '2': { 'LetterGrade': 'B', 'PercentStart': '50' } },
			includeGradeButton: true,
			includeReportsButton: true
		},
		{
			name: 'write-enabled-letter-grade-icons-tooltips-grades',
			gradeType: 'LetterGrade',
			labelText: 'Overall Grade',
			letterGradeOptions: { '0': { 'LetterGrade': 'None', 'PercentStart': null }, '1': { 'LetterGrade': 'A', 'PercentStart': '75' }, '2': { 'LetterGrade': 'B', 'PercentStart': '50' } },
			gradeButtonTooltip: 'Assignment 1 Grade Item Attached',
			reportsButtonTooltip: 'Class and user statistics',
			includeGradeButton: true,
			includeReportsButton: true,
			focusGradesButton: true
		},
		{
			name: 'write-enabled-letter-grade-icons-tooltips-reports',
			gradeType: 'LetterGrade',
			labelText: 'Overall Grade',
			letterGradeOptions: { '0': { 'LetterGrade': 'None', 'PercentStart': null }, '1': { 'LetterGrade': 'A', 'PercentStart': '75' }, '2': { 'LetterGrade': 'B', 'PercentStart': '50' } },
			gradeButtonTooltip: 'Assignment 1 Grade Item Attached',
			reportsButtonTooltip: 'Class and user statistics',
			includeGradeButton: true,
			includeReportsButton: true,
			focusReportsButton: true
		}
	];

	tests.forEach((test) => {
		it(`${test.name}`, async() => {
			const fixtureElement = await fixture(
				html`
				<div style='margin: 10px 18px; padding: 50px; padding-bottom: 80px; display: flex; justify-content: center;'>
					<d2l-labs-grade-result-presentational
						grade-type="${test.gradeType}"
						label-text="${test.labelText}"
						score-numerator="${ifDefined(test.scoreNumerator)}"
						score-denominator="${ifDefined(test.scoreDenominator)}"
						grade-button-tooltip="${ifDefined(test.gradeButtonTooltip)}"
						reports-button-tooltip="${ifDefined(test.reportsButtonTooltip)}"
						.letterGradeOptions="${test.letterGradeOptions}"
						selected-letter-grade="${ifDefined(test.selectedLetterGrade)}"
						?include-grade-button="${test.includeGradeButton}"
						?include-reports-button="${test.includeReportsButton}"
						?show-floored-score-warning="${test.showFlooredScoreWarning}"
						?allow-negative-score="${test.allowNegativeScore}"
					></d2l-labs-grade-result-presentational>
				<div>`,
				{ pagePadding: false }
			);

			await testDiff(fixtureElement, test.focusGradesButton, test.focusReportsButton, test.focusInputBox);
		});
	});

});
