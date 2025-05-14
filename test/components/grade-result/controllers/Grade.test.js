import { Grade, GradeErrors, GradeType } from '../../../../src/components/grade-result/controllers/Grade.js';
import { assert } from '@brightspace-ui/testing';

const letterGradeOptions = {
	0: { 'LetterGrade': 'None', 'PercentStart': null, 'AssignedValue': null },
	1: { 'LetterGrade': 'A', 'PercentStart': 80, 'AssignedValue': 80 },
	2: { 'LetterGrade': 'B', 'PercentStart': 65, 'AssignedValue': 65 },
	3: { 'LetterGrade': 'C', 'PercentStart': 50, 'AssignedValue': 50 },
};

describe('Grade tests', () => {
	describe('properly calling constructor', () => {
		it('initializes properly for a numeric score', () => {
			const grade = new Grade(GradeType.Number, 10, 50, null, null);
			assert.equal(grade.isLetterGrade(), false);
			assert.equal(grade.isNumberGrade(), true);
			assert.equal(grade.getScoreType(), GradeType.Number);
			assert.equal(grade.getScore(), 10);
			assert.equal(grade.getOutOf(), 50);
		});

		it('initializes properly for a numeric score (not overridden)', () => {
			const grade = new Grade(GradeType.Number, 10, 50, null, null, null, 10);
			assert.equal(grade.isLetterGrade(), false);
			assert.equal(grade.isNumberGrade(), true);
			assert.equal(grade.getScoreType(), GradeType.Number);
			assert.equal(grade.getScore(), 10);
			assert.equal(grade.getOutOf(), 50);
			assert.equal(grade.getLetterGradeOptions(), undefined);
			assert.equal(grade.isManuallyOverridden, false);
		});

		it('initializes properly for a numeric score (overridden)', () => {
			const grade = new Grade(GradeType.Number, 10, 50, null, null, null, 15);
			assert.equal(grade.isLetterGrade(), false);
			assert.equal(grade.isNumberGrade(), true);
			assert.equal(grade.getScoreType(), GradeType.Number);
			assert.equal(grade.getScore(), 10);
			assert.equal(grade.getOutOf(), 50);
			assert.equal(grade.getLetterGradeOptions(), undefined);
			assert.equal(grade.isManuallyOverridden, true);
		});

		it('initializes properly for a letter score', () => {
			const grade = new Grade(GradeType.Letter, null, null, 'A', letterGradeOptions);
			assert.equal(grade.isLetterGrade(), true);
			assert.equal(grade.isNumberGrade(), false);
			assert.equal(grade.getScoreType(), GradeType.Letter);
			assert.equal(grade.getScore(), '1');
			assert.equal(grade.getOutOf(), null);
			assert.deepEqual(grade.getLetterGradeOptions(), letterGradeOptions);
		});

		it('initializes properly for a letter score with null grade', () => {
			const grade = new Grade(GradeType.Letter, null, null, null, letterGradeOptions);
			assert.equal(grade.isLetterGrade(), true);
			assert.equal(grade.isNumberGrade(), false);
			assert.equal(grade.getScoreType(), GradeType.Letter);
			assert.equal(grade.getScore(), '0');
			assert.equal(grade.getOutOf(), null);
			assert.deepEqual(grade.getLetterGradeOptions(), letterGradeOptions);
		});

		it('initializes properly for a letter score with an out of', () => {
			const grade = new Grade(GradeType.Letter, null, 50, 'A', letterGradeOptions);
			assert.equal(grade.isLetterGrade(), true);
			assert.equal(grade.isNumberGrade(), false);
			assert.equal(grade.getScoreType(), GradeType.Letter);
			assert.equal(grade.getScore(), '1');
			assert.equal(grade.getOutOf(), 50);
			assert.deepEqual(grade.getLetterGradeOptions(), letterGradeOptions);
		});
	});

	describe('throws an error if improper scoreType given in constructor', () => {
		it('given invalid string', () => {
			assert.throws(() => {
				new Grade('not valid', 10, 50, null, null);
			}, GradeErrors.INVALID_SCORE_TYPE);
		});

		it('given undefined', () => {
			assert.throws(() => {
				new Grade(undefined, 10, 50, null, null);
			}, GradeErrors.INVALID_SCORE_TYPE);
		});

		it('given number', () => {
			assert.throws(() => {
				new Grade(5, 10, 50, null, null);
			}, GradeErrors.INVALID_SCORE_TYPE);
		});

		it('given array', () => {
			assert.throws(() => {
				new Grade([], 10, 50, null, null);
			}, GradeErrors.INVALID_SCORE_TYPE);
		});
	});

	describe('ensures that the gradeType is case insensitive and isLetterGrade and isNumberGrade still work', () => {
		it('can handle numeric', () => {
			assert.doesNotThrow(() => {
				const grade = new Grade('numeric', 10, 50, null, null);
				assert.isFalse(grade.isLetterGrade());
				assert.isTrue(grade.isNumberGrade());
			});
		});

		it('can handle lettergrade', () => {
			assert.doesNotThrow(() => {
				const grade = new Grade('lettergrade', null, null, 'A', letterGradeOptions);
				assert.isTrue(grade.isLetterGrade());
				assert.isFalse(grade.isNumberGrade());
			});
		});
	});

	describe('throws an error if improper score are provided for numeric scores', () => {
		it('score as null', () => {
			assert.doesNotThrow(() => {
				new Grade(GradeType.Number, null, 10, null, null);
			});
		});

		it('score as string', () => {
			assert.throws(() => {
				new Grade(GradeType.Number, 'A', 10, null, null);
			}, GradeErrors.INVALID_SCORE);
		});

		it('score as array of strings', () => {
			assert.throws(() => {
				new Grade(GradeType.Number, ['A'], 10, null, null);
			}, GradeErrors.INVALID_SCORE);
		});
	});

	describe('throws an error if improper score/outOf are provided for letter scores', () => {
		it('lettergrade as null', () => {
			assert.doesNotThrow(() => {
				new Grade(GradeType.Letter, null, null, null, letterGradeOptions);
			});
		});

		it('lettergrade as number', () => {
			assert.throws(() => {
				new Grade(GradeType.Letter, null, null, 10, letterGradeOptions);
			}, GradeErrors.INVALID_LETTER_GRADE);
		});

		it('lettergrade as array of strings', () => {
			assert.throws(() => {
				new Grade(GradeType.Letter, null, null, ['A', 'B'], letterGradeOptions);
			}, GradeErrors.INVALID_LETTER_GRADE);
		});

		it('lettergradeOptions as null', () => {
			assert.throws(() => {
				new Grade(GradeType.Letter, null, null, 'A', null);
			}, GradeErrors.INVALID_LETTER_GRADE_OPTIONS);
		});

		it('lettergradeOptions as number', () => {
			assert.throws(() => {
				new Grade(GradeType.Letter, null, null, 'A', 50);
			}, GradeErrors.INVALID_LETTER_GRADE_OPTIONS);
		});

		it('lettergradeOptions as string', () => {
			assert.throws(() => {
				new Grade(GradeType.Letter, null, null, 'A', '50');
			}, GradeErrors.INVALID_LETTER_GRADE_OPTIONS);
		});

		it('lettergradeOptions as empty array', () => {
			assert.throws(() => {
				new Grade(GradeType.Letter, null, null, 'A', []);
			}, GradeErrors.INVALID_LETTER_GRADE_OPTIONS);
		});

	});

	describe('getScore, getOutOf, and getLetterGradeOptions work properly', () => {
		it('getScore works properly for numeric scores', () => {
			const grade = new Grade(GradeType.Number, 5, 10, null, null);
			assert.equal(grade.getScore(), 5);
		});

		it('getScore works properly for letter scores', () => {
			const grade = new Grade(GradeType.Letter, null, null, 'A', letterGradeOptions);
			assert.equal(grade.getScore(), 1);
		});

		it('getOutOf works properly for numeric scores', () => {
			const grade = new Grade(GradeType.Number, 5, 10, null, null);
			assert.equal(grade.getOutOf(), 10);
		});

		it('getLetterGradeOptions works properly for letter scores', () => {
			const grade = new Grade(GradeType.Letter, null, null, 'A', letterGradeOptions);
			assert.deepEqual(grade.getLetterGradeOptions(), letterGradeOptions);
		});
	});

	describe('getLetterGrade works properly', () => {
		it('getLetterGrade throws an error if the grade is numeric', () => {
			const grade = new Grade(GradeType.Number, 5, 10, null, null);
			assert.throws(() => {
				grade.getLetterGrade();
			}, GradeErrors.GET_LETTER_GRADE_FROM_NUMERIC_SCORE);
		});

		it('getLetterGrade returns the letter grade properly', () => {
			const letterGrade = 'A';
			const grade = new Grade(GradeType.Letter, null, null, letterGrade, letterGradeOptions);
			assert.equal(grade.getLetterGrade(), letterGrade);
		});
	});

	it('ensures that the letterGrade is one of the LetterGradeOptions', () => {
		assert.throws(() => {
			new Grade(GradeType.Letter, null, null, 'D', letterGradeOptions);
		}, GradeErrors.LETTER_GRADE_NOT_IN_OPTIONS);
	});

	it('allows score and outOf to be 0', () => {
		assert.doesNotThrow(() => {
			new Grade(GradeType.Number, 0, 0, null, null);
		});
	});

	describe('getLetterGradeAssignedValue works properly', () => {
		it('getLetterGradeAssignedValue throws an error if the grade is numeric', () => {
			const grade = new Grade(GradeType.Number, 5, 10, null, null);
			assert.throws(() => {
				grade.getLetterGradeAssignedValue();
			}, GradeErrors.GET_LETTER_GRADE_FROM_NUMERIC_SCORE);
		});

		it('getLetterGradeAssignedValue throws an error if the letterGradeId has no corresponding assigned value', () => {
			const letterGrade = 'A';
			const badLetterGradeOptions = {
				0: { 'LetterGrade': 'None', 'PercentStart': null, 'AssignedValue': null },
				1: { 'LetterGrade': 'A', 'PercentStart': '80' },
				2: { 'LetterGrade': 'B', 'PercentStart': '65', 'AssignedValue': '65' },
				3: { 'LetterGrade': 'C', 'PercentStart': '50', 'AssignedValue': '50' },
			};
			const grade = new Grade(GradeType.Letter, null, null, letterGrade, badLetterGradeOptions);
			assert.throws(() => {
				grade.getLetterGradeAssignedValue();
			}, GradeErrors.LETTER_GRADE_ID_NO_ASSIGNED_VALUE);
		});

		it('getLetterGradeAssignedValue throws an error if the letterGradeId has an assigned value that is not a number', () => {
			const letterGrade = 'A';
			const badLetterGradeOptions = {
				0: { 'LetterGrade': 'None', 'PercentStart': null, 'AssignedValue': null },
				1: { 'LetterGrade': 'A', 'PercentStart': '80', 'AssignedValue': 'A' },
				2: { 'LetterGrade': 'B', 'PercentStart': '65', 'AssignedValue': '65' },
				3: { 'LetterGrade': 'C', 'PercentStart': '50', 'AssignedValue': '50' },
			};
			const grade = new Grade(GradeType.Letter, null, null, letterGrade, badLetterGradeOptions);
			assert.throws(() => {
				grade.getLetterGradeAssignedValue();
			}, GradeErrors.LETTER_GRADE_ID_NO_ASSIGNED_VALUE);
		});

		it('getLetterGradeAssignedValue returns assigned value', () => {
			const letterGrade = 'A';
			const grade = new Grade(GradeType.Letter, null, null, letterGrade, letterGradeOptions);
			assert.equal(grade.getLetterGradeAssignedValue(), 80);
		});
	});

	describe('properly updates a score of a number grade', () => {
		const grade = new Grade(GradeType.Number, 0, 0, null, null);

		it('sets number grade score properly', () => {
			assert.doesNotThrow(() => {
				grade.setScore(10);
				assert.equal(grade.getScore(), 10);
			});
		});

		it('returns empty string for undefined score', () => {
			assert.doesNotThrow(() => {
				grade.setScore(undefined);
				assert.equal(grade.getScore(), '');
			});
		});

		it('does not throw for null score', () => {
			assert.doesNotThrow(() => {
				grade.setScore(null);
			});
		});

		it('throws error for string score', () => {
			assert.throws(() => {
				grade.setScore('A');
			}, GradeErrors.INVALID_SCORE);
		});

		it('throws error for array of strings score', () => {
			assert.throws(() => {
				grade.setScore(['A']);
			}, GradeErrors.INVALID_SCORE);
		});
	});

	describe('properly updates a letter grade', () => {
		const grade = new Grade(GradeType.Letter, null, null, 'A', letterGradeOptions);

		it('sets the letter grade properly', () => {
			assert.doesNotThrow(() => {
				const letterGradeId = grade._getLetterGradeIdFromLetterGrade('B', letterGradeOptions);
				grade.setScore(letterGradeId);
				assert.equal(grade.getScore(), 2);
			});
		});

		it('throws error for null score', () => {
			assert.throws(() => {
				grade.setScore(null);
			}, GradeErrors.INVALID_LETTER_GRADE_ID);
		});

		it('throws error for undefined score', () => {
			assert.throws(() => {
				grade.setScore();
			}, GradeErrors.INVALID_LETTER_GRADE_ID);
		});

		it('throws error for new score not in letter grade options', () => {
			assert.throws(() => {
				grade._getLetterGradeIdFromLetterGrade('D', letterGradeOptions);
			}, GradeErrors.LETTER_GRADE_NOT_IN_OPTIONS);
		});

	});

	it('is able to store and retrieve an entity associated with the grade', () => {
		const entity = { some: 'entity' };
		const grade = new Grade(GradeType.Number, 10, 11, null, null, entity);
		assert.equal(grade.getEntity(), entity);
	});

	describe('can handle when scores have not yet been set', () => {
		it('can handle score as null', () => {
			assert.doesNotThrow(() => {
				new Grade(GradeType.Number, null, 10, null, null);
			});
		});

		it('can handle letterGrade as null', () => {
			assert.doesNotThrow(() => {
				new Grade(GradeType.Letter, null, null, null, letterGradeOptions);
			});
		});
	});

	it('getDisplay works properly', () => {
		const display = { some: 'display property' };
		const grade = new Grade(GradeType.Number, 10, 11, null, null, null, null, null, display);
		assert.equal(grade.getDisplay(), display);
	});
});
