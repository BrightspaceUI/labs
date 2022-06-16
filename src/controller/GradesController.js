import 'd2l-polymer-siren-behaviors/store/entity-store.js';
import { Grade } from './Grade.js';
import { performSirenAction } from '@brightspace-hmc/siren-sdk/src/es6/SirenAction.js';

export const GradesControllerErrors = {
	INVALID_BASE_HREF: 'baseHref was not defined when initializing GradesController',
	INVALID_TYPE_BASE_HREF: 'baseHref must be a string when initializing GradesController',
	INVALID_TOKEN: 'token was not defined when initializing GradesController',
	INVALID_TYPE_TOKEN: 'token must be a string when initializing GradesController',
	REQUEST_FAILED: 'request for grade failed',
	ENTITY_NOT_FOUND_REQUEST_GRADE: 'entity not found for requestGrade',
	NO_PROPERTIES_FOR_ENTITY: 'Entity does not have properties attached to it.',
	INVALID_GRADE: 'an instance of Grade must be provided to update a grade.',
	GRADE_MUST_HAVE_ENTITY: 'entity must be provided with the grade to update a grade.',
	NO_SAVE_GRADE_ACTION: 'Could not find the SaveGrade action from entity.',
	FIELD_IN_ACTION_NOT_FOUND: (actionName, fieldName) => `Expected the ${actionName} action to have a ${fieldName} field.`
};

export class GradesController {

	constructor(baseHref, token) {
		if (!baseHref) {
			throw new Error(GradesControllerErrors.INVALID_BASE_HREF);
		}

		if (typeof baseHref !== 'string') {
			throw new Error(GradesControllerErrors.INVALID_TYPE_BASE_HREF);
		}

		if (!token) {
			throw new Error(GradesControllerErrors.INVALID_TOKEN);
		}

		if (typeof token !== 'string') {
			throw new Error(GradesControllerErrors.INVALID_TYPE_TOKEN);
		}

		this.baseHref = baseHref;
		this.token = token;
	}

	async requestGrade(bypassCache = false) {
		const response = await window.D2L.Siren.EntityStore.fetch(this.baseHref, this.token, bypassCache);
		if (!response) {
			throw new Error(GradesControllerErrors.REQUEST_FAILED);
		}
		if (!response.entity) {
			throw new Error(GradesControllerErrors.ENTITY_NOT_FOUND_REQUEST_GRADE);
		}
		const entity = response.entity;
		const gradeSubEntity = entity.getSubEntityByRel('grade');
		const grade = this._parseGrade(gradeSubEntity);
		return grade;
	}

	async updateGrade(grade) {
		if (!grade) {
			throw new Error(GradesControllerErrors.INVALID_GRADE);
		}
		const entity = grade.getEntity();
		if (!entity) {
			throw new Error(GradesControllerErrors.GRADE_MUST_HAVE_ENTITY);
		}

		const actionName = 'SaveGrade';
		const fieldName = 'value';

		if (!entity.hasActionByName(actionName)) {
			throw new Error(GradesControllerErrors.NO_SAVE_GRADE_ACTION);
		}

		const saveGradeAction = entity.getActionByName(actionName);

		if (!saveGradeAction.hasFieldByName(fieldName)) {
			throw new Error(GradesControllerErrors.FIELD_IN_ACTION_NOT_FOUND(saveGradeAction.name, fieldName));
		}

		const field = saveGradeAction.getFieldByName(fieldName);
		field.value = grade.getScore();

		const newGradeEntity = await this._performAction(saveGradeAction, [field]);
		return this._parseGrade(newGradeEntity);
	}

	_parseGrade(entity) {
		if (!entity.properties) {
			throw new Error(GradesControllerErrors.NO_PROPERTIES_FOR_ENTITY);
		}

		return new Grade(
			entity.properties.scoreType,
			entity.properties.score,
			entity.properties.outOf,
			entity.properties.letterGrade,
			entity.properties.letterGradeOptions,
			entity
		);
	}

	// this is in a seperate function so that it is easily mocked
	async _performAction(saveGradeAction, fields) {
		await performSirenAction(this.token, saveGradeAction, fields, true);
	}

}
