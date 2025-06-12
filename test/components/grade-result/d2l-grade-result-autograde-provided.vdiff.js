import '../../../src/components/grade-result/grade-result-presentational.js';
import { fixture, html } from '@brightspace-ui/testing';
import { ifDefined } from 'lit/directives/if-defined.js';
import { testDiff } from './vdiff-utils.js';

describe('autograde provided visual diff tests', () => {

	const tests = [
		{
			name: 'autograde-provided-number-grade-no-icons-clear-manual-override-option',
			gradeType: 'Numeric',
			labelText: 'Overall Grade',
			scoreNumerator: 5,
			scoreDenominator: 20
		},
		{
			name: 'autograde-provided-number-grade-icons-clear-manual-override-option',
			gradeType: 'Numeric',
			labelText: 'Overall Grade',
			scoreNumerator: 5,
			scoreDenominator: 20,
			includeGradeButton: true,
			includeReportsButton: true
		},
		{
			name: 'autograde-provided-number-grade-icons-tooltips-clear-manual-override-option-grades',
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
			name: 'autograde-provided-number-grade-icons-tooltips-clear-manual-override-option-reports',
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
			name: 'autograde-provided-letter-grade-no-icons-clear-manual-override-option',
			gradeType: 'LetterGrade',
			labelText: 'Overall Grade',
			letterGradeOptions: { '0': { 'LetterGrade': 'None', 'PercentStart': null }, '1': { 'LetterGrade': 'A', 'PercentStart': '75' }, '2': { 'LetterGrade': 'B', 'PercentStart': '50' } },
			selectedLetterGrade: '2'
		},
		{
			name: 'autograde-provided-letter-grade-icons-clear-manual-override-option',
			gradeType: 'LetterGrade',
			labelText: 'Overall Grade',
			letterGradeOptions: { '0': { 'LetterGrade': 'None', 'PercentStart': null }, '1': { 'LetterGrade': 'A', 'PercentStart': '75' }, '2': { 'LetterGrade': 'B', 'PercentStart': '50' } },
			selectedLetterGrade: '2',
			includeGradeButton: true,
			includeReportsButton: true
		},
		{
			name: 'autograde-provided-letter-grade-icons-tooltips-clear-manual-override-option-grades',
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
			name: 'autograde-provided-letter-grade-icons-tooltips-clear-manual-override-option-reports',
			gradeType: 'LetterGrade',
			labelText: 'Overall Grade',
			letterGradeOptions: { '0': { 'LetterGrade': 'None', 'PercentStart': null }, '1': { 'LetterGrade': 'A', 'PercentStart': '75' }, '2': { 'LetterGrade': 'B', 'PercentStart': '50' } },
			selectedLetterGrade: '2',
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
				<div style='margin: 10px 18px; padding: 50px; display: flex; justify-content: center;'>
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
						is-manual-override-active
					></d2l-labs-grade-result-presentational>
				<div>`,
				{ pagePadding: false }
			);

			await testDiff(fixtureElement, test.focusGradesButton, test.focusReportsButton);
		});
	});

});
