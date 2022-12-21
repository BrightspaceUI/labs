async function focusGradesButton(page, id) {
	await page.evaluate((id) => {
		document
			.querySelector(id)
			.querySelector('d2l-labs-d2l-grade-result-presentational')
			.shadowRoot.querySelector('d2l-grade-result-icon-button')
			.shadowRoot.querySelector('d2l-button-icon')
			.focus();
	}, id);
}

async function focusReportsButton(page, id) {
	await page.evaluate((id) => {
		document
			.querySelector(id)
			.querySelector('d2l-labs-d2l-grade-result-presentational')
			.shadowRoot.querySelectorAll('d2l-grade-result-icon-button')[1]
			.shadowRoot.querySelector('d2l-button-icon')
			.focus();
	}, id);
}

async function focusInputBox(page, id) {
	await page.evaluate((id) => {
		document
			.querySelector(id)
			.querySelector('d2l-labs-d2l-grade-result-presentational')
			.shadowRoot.querySelector('d2l-grade-result-numeric-score')
			.shadowRoot.querySelector('d2l-input-number')
			.shadowRoot.querySelector('d2l-input-text')
			.shadowRoot.querySelector('input')
			.focus();
	}, id);
}

export async function testDiff(visualDiff, page, id, fullTitle, focusGrades = false, focusReports = false, focusInput = false) {
	const rect = await visualDiff.getRect(page, id);
	if (focusGrades) {
		await focusGradesButton(page, id);
	} else if (focusReports) {
		await focusReportsButton(page, id);
	} else if (focusInput) {
		await focusInputBox(page, id);
	}

	await visualDiff.screenshotAndCompare(page, fullTitle, { clip: rect });
}
