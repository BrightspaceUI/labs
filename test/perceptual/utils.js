import { aTimeout, expect, focusElem } from '@brightspace-ui/testing';

async function focusGradesButton(fixtureElement) {
	const gradeButtonElement = fixtureElement
		.querySelector('d2l-labs-d2l-grade-result-presentational')
		.shadowRoot.querySelector('d2l-grade-result-icon-button')
		.shadowRoot.querySelector('d2l-button-icon');

	await focusElem(gradeButtonElement);
}

async function focusReportsButton(fixtureElement) {
	const reportsButtonElement = fixtureElement
		.querySelector('d2l-labs-d2l-grade-result-presentational')
		.shadowRoot.querySelectorAll('d2l-grade-result-icon-button')[1]
		.shadowRoot.querySelector('d2l-button-icon');

	await focusElem(reportsButtonElement);
}

async function focusInputBox(fixtureElement) {
	const inputBoxElement = fixtureElement
		.querySelector('d2l-labs-d2l-grade-result-presentational')
		.shadowRoot.querySelector('d2l-grade-result-numeric-score')
		.shadowRoot.querySelector('d2l-input-number')
		.shadowRoot.querySelector('d2l-input-text')
		.shadowRoot.querySelector('input');

	await focusElem(inputBoxElement);
}

export async function testDiff(fixtureElement, focusGrades, focusReports, focusInput) {
	if (focusGrades) {
		focusGradesButton(fixtureElement);
	} else if (focusReports) {
		focusReportsButton(fixtureElement);
	} else if (focusInput) {
		focusInputBox(fixtureElement);
	}

	await aTimeout(200); // The webkit tests are unstable without this :(

	await expect(fixtureElement).to.be.golden();
}
