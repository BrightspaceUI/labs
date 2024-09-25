
export const GradeType = {
	Letter: 'LetterGrade',
	Number: 'Numeric'
};

export const GradeErrors = {
	GET_LETTER_GRADE_FROM_NUMERIC_SCORE: 'Grade must be of type LetterGrade to get the letter grade',
	GET_ASSIGNED_VALUE_FROM_NUMERIC_SCORE: 'Grade must be of type LetterGrade to get the assigned value',
	INVALID_SCORE_TYPE: 'Invalid scoreType provided',
	INVALID_SCORE: 'Invalid score provided',
	INVALID_OUT_OF: 'Invalid outOf provided',
	INVALID_LETTER_GRADE: 'Invalid letterGrade provided',
	INVALID_LETTER_GRADE_ID: 'Invalid letterGradeId provided',
	INVALID_LETTER_GRADE_OPTIONS: 'Invalid letterGradeOptions provided',
	LETTER_GRADE_NOT_IN_OPTIONS: 'letterGrade must be one of the letterGradeOptions provided',
	LETTER_GRADE_ID_NO_ASSIGNED_VALUE: 'LetterGradeId does not have a corresponding AssignedValue',
};

export class Grade {

	constructor(scoreType, score, outOf, letterGrade, letterGradeOptions, entity, calculatedScore = null, aggregatedScore = null) {
		this.entity = entity;
		this.isManuallyOverridden = false;
		this.calculatedScore = calculatedScore;
		this.aggregatedScore = aggregatedScore;
		this.scoreType = this._parseScoreType(scoreType);
		if (this.isNumberGrade()) {
			this._parseNumberGrade(score, outOf);
		} else {
			const letterGradeId = this._getLetterGradeIdFromLetterGrade(letterGrade, letterGradeOptions);
			this._parseLetterGrade(letterGradeId, letterGradeOptions);
		}
	}

	getEntity() {
		return this.entity;
	}

	getLetterGrade() {
		if (this.isNumberGrade()) {
			throw new Error(GradeErrors.GET_LETTER_GRADE_FROM_NUMERIC_SCORE);
		}
		return this.letterGrade;
	}

	getLetterGradeAssignedValue() {
		if (this.isNumberGrade()) {
			throw new Error(GradeErrors.GET_LETTER_GRADE_FROM_NUMERIC_SCORE);
		}

		const letterGradeOption = this.letterGradeOptions[this.letterGradeId];

		if (!letterGradeOption || (typeof letterGradeOption.AssignedValue !== 'number' && letterGradeOption.AssignedValue !== null)) {
			throw new Error(GradeErrors.LETTER_GRADE_ID_NO_ASSIGNED_VALUE);
		}

		return letterGradeOption.AssignedValue;
	}

	getScore() {
		return this.isNumberGrade() ? this.score : this.letterGradeId;
	}

	getScoreOutOf() {
		return this.isNumberGrade() ? this.outOf : this.letterGradeOptions;
	}

	getScoreType() {
		return this.scoreType;
	}

	isLetterGrade() {
		return this.scoreType === GradeType.Letter;
	}

	isNumberGrade() {
		return this.scoreType === GradeType.Number;
	}

	setScore(score) {
		if (this.isNumberGrade()) {
			this._parseNumberGrade(score, this.outOf);
		} else {
			this._parseLetterGrade(score, this.letterGradeOptions);
		}
	}

	_getLetterGradeIdFromLetterGrade(letterGrade, letterGradeOptions) {
		if ((!letterGrade || typeof letterGrade !== 'string') && letterGrade !== null && letterGrade !== '') {
			throw new Error(GradeErrors.INVALID_LETTER_GRADE);
		}
		if (!letterGradeOptions || typeof letterGradeOptions !== 'object' || Object.keys(letterGradeOptions).length === 0) {
			throw new Error(GradeErrors.INVALID_LETTER_GRADE_OPTIONS);
		}

		let letterGradeId;

		// this is the "None" case which has the id 0
		if (letterGrade === '' || letterGrade === null) {
			letterGradeId = '0';
		} else {
			letterGradeId = Object.keys(letterGradeOptions).find(key =>
				letterGradeOptions[key].LetterGrade === letterGrade
			);
		}

		if (letterGradeId === undefined) {
			throw new Error(GradeErrors.LETTER_GRADE_NOT_IN_OPTIONS);
		}

		return letterGradeId;
	}

	_parseLetterGrade(letterGradeId, letterGradeOptions) {
		if (!letterGradeId && letterGradeId !== 0) {
			throw new Error(GradeErrors.INVALID_LETTER_GRADE_ID);
		}

		if (!letterGradeOptions || Object.keys(letterGradeOptions).length === 0) {
			throw new Error(GradeErrors.INVALID_LETTER_GRADE_OPTIONS);
		}

		this.score = null;
		this.outOf = null;
		this.letterGradeId = letterGradeId;
		this.letterGrade = letterGradeOptions[letterGradeId].LetterGrade;
		this.letterGradeOptions = letterGradeOptions;
	}

	_parseNumberGrade(score, outOf) {
		if ((!outOf || isNaN(outOf)) && outOf !== 0) {
			throw new Error(GradeErrors.INVALID_OUT_OF);
		}

		if (score === undefined) {
			score = '';
		} else if (isNaN(score)) {
			throw new Error(GradeErrors.INVALID_SCORE);
		} else if (typeof score === 'string') {
			score = Number(score);
		}

		if (typeof outOf === 'string') {
			outOf = Number(outOf);
		}

		if (this.calculatedScore !== null) {
			this.isManuallyOverridden = score !== this.calculatedScore;
		}

		this.score = score;
		this.outOf = outOf;
		this.letterGradeId = null;
		this.letterGrade = null;
		this.letterGradeOptions = null;
	}

	_parseScoreType(scoreType) {
		const invalidScoreError = new Error(GradeErrors.INVALID_SCORE_TYPE);

		if (!scoreType || typeof scoreType !== 'string') {
			throw invalidScoreError;
		}

		if (scoreType.toLowerCase() === GradeType.Number.toLowerCase()) {
			return GradeType.Number;
		} else if (scoreType.toLowerCase() === GradeType.Letter.toLowerCase()) {
			return GradeType.Letter;
		} else {
			throw invalidScoreError;
		}
	}

}
