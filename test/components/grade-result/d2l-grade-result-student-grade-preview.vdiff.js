import '../../src/components/d2l-grade-result-student-grade-preview.js';
import '../../src/components/d2l-grade-result-presentational.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('student-grade-preview', () => {

	const tests = [
		{
			name: 'none',
			outOf: 10
		},
		{
			name: 'no-display-options',
			outOf: 10,
			displayStudentGradePreview: true,
			studentGradePreview: '{}'
		},
		{
			name: 'select-box-symbol',
			outOf: 10,
			displayStudentGradePreview: true,
			studentGradePreview: '{"score":10, "symbol":"Very Good", "colour":"#00FFFF"}'
		},
		{
			name: 'percentage-symbol',
			outOf: 10,
			displayStudentGradePreview: true,
			studentGradePreview: '{"score":9, "symbol":"90 %", "colour":"#AAAAFF"}'
		},
		{
			name: 'score-and-symbol-only',
			outOf: 10,
			displayStudentGradePreview: true,
			studentGradePreview: '{"score":2, "symbol":"Bad"}'
		},
		{
			name: 'score-and-colour-only',
			outOf: 10,
			displayStudentGradePreview: true,
			studentGradePreview: '{"score":10, "colour":"#11FF11"}'
		},
		{
			name: 'symbol-and-colour-only',
			outOf: 10,
			displayStudentGradePreview: true,
			studentGradePreview: '{"symbol":"11 %", "colour":"#666666"}'
		},
		{
			name: 'score-only',
			outOf: 10,
			displayStudentGradePreview: true,
			studentGradePreview: '{"score":7}'
		},
		{
			name: 'symbol-only',
			outOf: 10,
			displayStudentGradePreview: true,
			studentGradePreview: '{"symbol":"A+"}'
		},
		{
			name: 'colour-only',
			outOf: 10,
			displayStudentGradePreview: true,
			studentGradePreview: '{"colour":"#FFAAAA"}'
		},
		{
			name: 'null-values',
			outOf: 10,
			displayStudentGradePreview: true,
			studentGradePreview: '{"score":null, "symbol":"-%", "colour":""}'
		},
		{
			name: 'hide-label',
			hideLabel: true,
			outOf: 10,
			displayStudentGradePreview: true,
			studentGradePreview: '{"score":9, "symbol":"90 %", "colour":"#AAAAFF"}'
		},
		{
			name: 'hide-student-grade-preview',
			hideLabel: false,
			outOf: 10,
			displayStudentGradePreview: false,
			studentGradePreview: '{"score":9, "symbol":"90 %", "colour":"#AAAAFF"}'
		},
	];

	tests.forEach((test) => {
		it(`${test.name}`, async() => {
			const el = await fixture(
				html`
					<d2l-grade-result-student-grade-preview
						?hidden=${!test.displayStudentGradePreview}
						?hide-label=${test.hideLabel}
						out-of=${test.outOf}
						student-grade-preview=${test.studentGradePreview}
					></d2l-grade-result-student-grade-preview>
				`
			);

			await expect(el).to.be.golden();
		});
	});

});

describe('presentational-with-grade-preview', () => {

	const tests = [
		{
			name: 'write-numeric',
			gradeType: 'Numeric',
			labelText: 'Overall Grade',
			scoreNumerator: '5',
			scoreDenominator: '20',
			includeGradeButton: true,
			includeReportsButton: true,
			readOnly: false,
			displayStudentGradePreview: true,
			studentGradePreview: '{"score":5, "symbol":"Fine", "colour":"#FFCC00"}'
		},
		{
			name: 'write-letter',
			gradeType: 'LetterGrade',
			labelText: 'Overall Grade',
			letterGradeOptions: '{ "0": { "LetterGrade": "None", "PercentStart": null}, "1": { "LetterGrade": "A", "PercentStart": "75"}, "2": { "LetterGrade": "B", "PercentStart": "50"}}',
			selectedLetterGrade: '2',
			scoreDenominator: '5',
			includeGradeButton: true,
			includeReportsButton: true,
			readOnly: false,
			displayStudentGradePreview: true,
			studentGradePreview: '{"score":5, "symbol":"B", "colour":"#00FF00"}'
		},
		{
			name: 'readonly-numeric',
			gradeType: 'Numeric',
			labelText: 'Overall Grade',
			scoreNumerator: '5',
			scoreDenominator: '20',
			includeGradeButton: true,
			includeReportsButton: true,
			readOnly: true,
			displayStudentGradePreview: true,
			studentGradePreview: '{"score":5, "symbol":"Fine", "colour":"#FFCC00"}'
		},
		{
			name: 'readonly-letter',
			gradeType: 'LetterGrade',
			labelText: 'Overall Grade',
			letterGradeOptions: '{ "0": { "LetterGrade": "None", "PercentStart": null}, "1": { "LetterGrade": "A", "PercentStart": "75"}, "2": { "LetterGrade": "B", "PercentStart": "50"}}',
			selectedLetterGrade: '2',
			scoreDenominator: '5',
			includeGradeButton: true,
			includeReportsButton: true,
			readOnly: true,
			displayStudentGradePreview: true,
			studentGradePreview: '{"score":5, "symbol":"B", "colour":"#00FF00"}'
		},
		{
			name: 'readonly-letter-long-letter',
			gradeType: 'LetterGrade',
			labelText: 'Overall Grade',
			letterGradeOptions: '{ "0": { "LetterGrade": "None", "PercentStart": null}, "1": { "LetterGrade": "A", "PercentStart": "75"}, "2": { "LetterGrade": "This is a really really really really really long letter grade", "PercentStart": "50"}}',
			selectedLetterGrade: '2',
			scoreDenominator: '5',
			includeGradeButton: true,
			includeReportsButton: true,
			readOnly: true,
			displayStudentGradePreview: true,
			studentGradePreview: '{"score":5, "symbol":"B", "colour":"#00FF00"}'
		},
		{
			name: 'manual-override',
			gradeType: 'Numeric',
			labelText: 'Overall Grade',
			scoreNumerator: '5',
			scoreDenominator: '20',
			isGradeAutoCompleted: true,
			isManualOverrideActive: true,
			includeGradeButton: true,
			includeReportsButton: true,
			readOnly: false,
			displayStudentGradePreview: true,
			studentGradePreview: '{"score":5, "symbol":"Fine", "colour":"#FFCC00"}'
		},
		{
			name: 'grade-calculation',
			gradeType: 'Numeric',
			labelText: 'Overall Grade',
			scoreNumerator: '5',
			scoreDenominator: '20',
			isGradeAutoCompleted: false,
			isManualOverrideActive: false,
			includeGradeButton: true,
			includeReportsButton: true,
			readOnly: true,
			subtitleText: 'Average post score',
			displayStudentGradePreview: true,
			studentGradePreview: '{"score":5, "symbol":"Fine", "colour":"#FFCC00"}'
		},
		{
			name: 'negative-score-hint',
			gradeType: 'Numeric',
			labelText: 'Attempt Grade',
			scoreNumerator: '0',
			scoreDenominator: '20',
			showFlooredScoreWarning: true,
			isGradeAutoCompleted: false,
			isManualOverrideActive: false,
			includeGradeButton: true,
			includeReportsButton: true,
			readOnly: false,
			displayStudentGradePreview: true,
			studentGradePreview: '{"score":5, "symbol":"Fine", "colour":"#FFCC00"}'
		},
		{
			name: 'grade-not-shown-to-learners',
			gradeType: 'Numeric',
			labelText: 'Overall Grade',
			scoreNumerator: '5',
			scoreDenominator: '20',
			includeGradeButton: true,
			includeReportsButton: true,
			readOnly: false,
			displayStudentGradePreview: true,
			studentGradePreview: '{}'
		},
	];

	const screenSizeCategories = [
		{ name: 'desktop', viewport: { height: 800, width: 700 } },
		{ name: 'mobile', viewport: { height: 800, width: 400 } }
	];

	screenSizeCategories.forEach((screenSizeCategory) => {
		describe(screenSizeCategory.name, () => {
			tests.forEach((test) => {
				it(`${test.name}`, async() => {
					const el = await fixture(
						html`
							<d2l-labs-d2l-grade-result-presentational
								?display-student-grade-preview=${test.displayStudentGradePreview}
								gradeType=${test.gradeType}
								?includeGradeButton=${test.includeGradeButton}
								?includeReportsButton=${test.includeReportsButton}
								?isManualOverrideActive=${test.isManualOverrideActive}
								?isGradeAutoCompleted=${test.isGradeAutoCompleted}
								labelText=${test.labelText}
								letterGradeOptions=${test.letterGradeOptions}
								?readOnly=${test.readOnly}
								scoreDenominator=${test.scoreDenominator}
								scoreNumerator=${test.scoreNumerator}
								selectedLetterGrade=${test.selectedLetterGrade}
								?showFlooredScoreWarning=${test.showFlooredScoreWarning}
								student-grade-preview=${test.studentGradePreview}
								subtitleText=${test.subtitleText}
							></d2l-labs-d2l-grade-result-presentational>
						`, { viewport: screenSizeCategory.viewport }
					);

					await expect(el).to.be.golden();
				});
			});
		});
	});

});
