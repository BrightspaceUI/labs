export const getPresentationalComponent = (el) => {
	return el.shadowRoot.querySelector('d2l-labs-d2l-grade-result-presentational');
};

export const getGradesButton = (el) => {
	return el
		.shadowRoot.querySelector('d2l-grade-result-icon-button')
		.shadowRoot.querySelector('d2l-button-icon');
};

export const getReportsButton = (el) => {
	return el
		.shadowRoot.querySelectorAll('d2l-grade-result-icon-button')[1]
		.shadowRoot.querySelector('d2l-button-icon');
};

export const getManualOverrideButton = (el) => {
	return el.shadowRoot.querySelector('d2l-button-subtle');
};

export const getNumericScore = (el) => {
	return el.shadowRoot.querySelector('d2l-grade-result-numeric-score');
};

export const getNumericScoreInput = (el) => {
	return getNumericScore(el).shadowRoot.querySelector('d2l-input-number');
};

export const getLetterScore = (el) => {
	return el.shadowRoot.querySelector('d2l-grade-result-letter-score');
};

export const getLetterScoreSelect = (el) => {
	return getLetterScore(el).shadowRoot.querySelector('select');
};
