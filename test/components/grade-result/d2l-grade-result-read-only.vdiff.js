import '../../../src/components/grade-result/grade-result-presentational.js';
import { fixture, html } from '@brightspace-ui/testing';
import { ifDefined } from 'lit/directives/if-defined.js';
import { testDiff } from './vdiff-utils.js';

describe('read only visual diff tests', () => {

	const tests = [
		{
			name: 'read-only-number-grade-no-icons',
			gradeType: 'Numeric',
			labelText: 'Overall Grade',
			scoreNumerator: 5,
			scoreDenominator: 20
		},
		{
			name: 'read-only-number-decimal-grade-no-icons',
			gradeType: 'Numeric',
			labelText: 'Overall Grade',
			scoreNumerator: 1.55555,
			scoreDenominator: 20
		},
		{
			name: 'read-only-negative-grade-no-icons',
			gradeType: 'Numeric',
			labelText: 'Attempt Grade',
			scoreNumerator: 0,
			scoreDenominator: 20,
			showFlooredScoreWarning: true
		},
		{
			name: 'read-only-number-grade-icons',
			gradeType: 'Numeric',
			labelText: 'Overall Grade',
			scoreNumerator: 5,
			scoreDenominator: 20,
			includeGradeButton: true,
			includeReportsButton: true
		},
		{
			name: 'read-only-number-grade-icons-tooltips-grades',
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
			name: 'read-only-number-grade-icons-tooltips-reports',
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
			name: 'read-only-negative-grade-icons',
			gradeType: 'Numeric',
			labelText: 'Attempt Grade',
			scoreNumerator: 5,
			scoreDenominator: 20,
			showFlooredScoreWarning: true,
			includeGradeButton: true,
			includeReportsButton: true
		},
		{
			name: 'read-only-number-grade-empty-numerator',
			gradeType: 'Numeric',
			labelText: 'Overall Grade',
			scoreDenominator: 20
		},
		{
			name: 'read-only-letter-grade-no-icons',
			gradeType: 'LetterGrade',
			labelText: 'Overall Grade',
			letterGradeOptions: { '0': { 'LetterGrade': 'None', 'PercentStart': null }, '1': { 'LetterGrade': 'A', 'PercentStart': '75' }, '2': { 'LetterGrade': 'B', 'PercentStart': '50' } },
			selectedLetterGrade: '2'
		},
		{
			name: 'read-only-letter-grade-icons',
			gradeType: 'LetterGrade',
			labelText: 'Overall Grade',
			letterGradeOptions: { '0': { 'LetterGrade': 'None', 'PercentStart': null }, '1': { 'LetterGrade': 'A', 'PercentStart': '75' }, '2': { 'LetterGrade': 'B', 'PercentStart': '50' } },
			selectedLetterGrade: '2',
			includeGradeButton: true,
			includeReportsButton: true
		},
		{
			name: 'read-only-letter-grade-icons-tooltips-grades',
			gradeType: 'LetterGrade',
			labelText: 'Overall Grade',
			letterGradeOptions: { '0': { 'LetterGrade': 'None', 'PercentStart': null }, '1': { 'LetterGrade': 'A', 'PercentStart': '75' }, '2': { 'LetterGrade': 'B', 'PercentStart': '50' } },
			selectedLetterGrade: '2',
			gradeButtonTooltip: 'Assignment 1 Grade Item Attached',
			reportsButtonTooltip: 'Class and user statistics',
			includeGradeButton: true,
			includeReportsButton: true,
			focusGradesButton: true
		},
		{
			name: 'read-only-letter-grade-icons-tooltips-reports',
			gradeType: 'LetterGrade',
			labelText: 'Overall Grade',
			letterGradeOptions: { '0': { 'LetterGrade': 'None', 'PercentStart': null }, '1': { 'LetterGrade': 'A', 'PercentStart': '75' }, '2': { 'LetterGrade': 'B', 'PercentStart': '50' } },
			selectedLetterGrade: '2',
			gradeButtonTooltip: 'Assignment 1 Grade Item Attached',
			reportsButtonTooltip: 'Class and user statistics',
			includeGradeButton: true,
			includeReportsButton: true,
			focusReportsButton: true
		},
		{
			name: 'd2l-labs-d2l-grade-result-with-subtitle',
			gradeType: 'Numeric',
			labelText: 'Overall Grade',
			scoreNumerator: 5,
			scoreDenominator: 20,
			subtitleText: 'Average grade post'
		}
	];

	tests.forEach((test) => {
		it(`${test.name}`, async() => {
			const fixtureElement = await fixture(
				html`
				<div style='margin: 10px 18px; padding: 50px; display: flex; justify-content: center;'>
					<d2l-labs-grade-result-presentational
						grade-type="${test.gradeType}"
						label-text="${test.labelText}"
						score-numerator="${ifDefined(test.scoreNumerator)}"
						score-denominator="${ifDefined(test.scoreDenominator)}"
						grade-button-tooltip="${ifDefined(test.gradeButtonTooltip)}"
						reports-tutton-tooltip="${ifDefined(test.reportsButtonTooltip)}"
						.letterGradeOptions="${test.letterGradeOptions}"
						selected-letter-grade="${ifDefined(test.selectedLetterGrade)}"
						subtitle-text="${ifDefined(test.subtitleText)}"
						?include-grade-button="${test.includeGradeButton}"
						?include-reports-button="${test.includeReportsButton}"
						?show-floored-score-warning="${test.showFlooredScoreWarning}"
						readonly
					></d2l-labs-grade-result-presentational>
				<div>`,
				{ pagePadding: false }
			);

			await testDiff(fixtureElement, test.focusGradesButton, test.focusReportsButton);
		});
	});

});
