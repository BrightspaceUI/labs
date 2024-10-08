import 'd2l-polymer-siren-behaviors/store/entity-store.js';
import { GradesController, GradesControllerErrors } from '../src/controller/GradesController.js';
import { assert } from '@brightspace-ui/testing';
import { Grade } from '../src/controller/Grade.js';
import sinon from 'sinon';

describe('GradesController', () => {
	describe('instantiates properly', () => {
		it('accepts a proper href and token string', () => {
			assert.doesNotThrow(() => {
				new GradesController('href', 'token');
			});
		});

		it('throws an error when empty string given for href', () => {
			assert.throws(() => {
				new GradesController('', 'token');
			}, GradesControllerErrors.INVALID_BASE_HREF);
		});

		it('throws an error when empty string given for token', () => {
			assert.throws(() => {
				new GradesController('href', '');
			}, GradesControllerErrors.INVALID_TOKEN);
		});

		it('throws an error for null href', () => {
			assert.throws(() => {
				new GradesController(null, 'token');
			}, GradesControllerErrors.INVALID_BASE_HREF);
		});

		it('throws an error for null token', () => {
			assert.throws(() => {
				new GradesController('href', null);
			}, GradesControllerErrors.INVALID_TOKEN);
		});

		it('throws an error for non string href', () => {
			assert.throws(() => {
				new GradesController(20, 'token');
			}, GradesControllerErrors.INVALID_TYPE_BASE_HREF);
		});

		it('throws an error for non string token', () => {
			assert.throws(() => {
				new GradesController('href', 20);
			}, GradesControllerErrors.INVALID_TYPE_TOKEN);
		});
	});

	describe('requestGrade', () => {

		describe('can properly get a grade', () => {
			before(() => {
				sinon.stub(window.D2L.Siren.EntityStore, 'fetch').returns({
					entity: {
						properties: {
							outOf: 100,
							scoreType: 'Numeric',
							score: 60,
							letterGrade: null,
							letterGradeOptions: null
						}
					}
				});
			});

			after(() => {
				window.D2L.Siren.EntityStore.fetch.restore();
			});

			it('can retrieve a grade and parse it properly', () => {
				assert.doesNotThrow(async() => {
					const controller = new GradesController('href', 'token');
					const grade = await controller.requestGrade(false);
					assert.equal(grade.getScoreType(), 'Numeric');
					assert.equal(grade.getScore(), 60);
					assert.equal(grade.getOutOf(), 100);
					assert.deepEqual(grade.getEntity(), {
						properties: {
							outOf: 100,
							scoreType: 'Numeric',
							score: 60,
							letterGrade: null,
							letterGradeOptions: null
						}
					});
				});
			});
		});

		describe('will throw an error if entity not present', () => {
			before(() => {
				sinon.stub(window.D2L.Siren.EntityStore, 'fetch').returns({});
			});

			after(() => {
				window.D2L.Siren.EntityStore.fetch.restore();
			});

			it('throws an error when entity is not found', async() => {
				try {
					const controller = new GradesController('href', 'token');
					await controller.requestGrade(true);
					assert.fail();
				} catch (e) {
					assert.equal(e.message, GradesControllerErrors.ENTITY_NOT_FOUND_REQUEST_GRADE);
				}
			});
		});

		describe('will throw an error for bad response', () => {
			before(() => {
				sinon.stub(window.D2L.Siren.EntityStore, 'fetch').returns(undefined);
			});

			after(() => {
				window.D2L.Siren.EntityStore.fetch.restore();
			});

			it('throws an error for no response', async() => {
				try {
					const controller = new GradesController('href', 'token');
					await controller.requestGrade(true);
					assert.fail();
				} catch (e) {
					assert.equal(e.message, GradesControllerErrors.REQUEST_FAILED);
				}
			});
		});

		describe('will throw an error if properties are not present', () => {
			before(() => {
				sinon.stub(window.D2L.Siren.EntityStore, 'fetch').returns({
					entity: { getSubEntityByRel: () => { return false; } }
				});
			});

			after(() => {
				window.D2L.Siren.EntityStore.fetch.restore();
			});

			it('throws an error for no properties', async() => {
				try {
					const controller = new GradesController('href', 'token');
					await controller.requestGrade(true);
					assert.fail();
				} catch (e) {
					assert.equal(e.message, GradesControllerErrors.NO_PROPERTIES_FOR_ENTITY);
				}
			});
		});
	});

	describe('updateGrade', () => {
		describe('proper grade object should save properly', () => {
			const fakeEntity = {
				entity: {
					properties: {
						outOf: 100,
						scoreType: 'Numeric',
						score: 60,
						letterGrade: null,
						letterGradeOptions: null
					},
					hasActionByName: (name) => name === 'SaveGrade',
					getActionByName: () => ({
						hasFieldByName: (name) => name === 'score',
						getFieldByName: () => ({ value: undefined })
					})
				}
			};

			before(() => {
				sinon.stub(window.D2L.Siren.EntityStore, 'fetch').returns(fakeEntity);
			});

			after(() => {
				window.D2L.Siren.EntityStore.fetch.restore();
			});

			it('can retrieve a grade and parse it properly', () => {
				assert.doesNotThrow(async() => {
					const controller = new GradesController('href', 'token');
					const grade = await controller.requestGrade(false);
					sinon.stub(controller, '_performAction').returns(fakeEntity.entity);
					const updatedGrade = await controller.updateGrade(grade);
					controller._performAction.restore();
					assert.deepEqual(updatedGrade, grade);
				});
			});
		});

		describe('bad grade object should throw errors', () => {

			it('throws an error for null grade', async() => {
				try {
					const controller = new GradesController('href', 'token');
					await controller.updateGrade(null);
					assert.fail();
				} catch (e) {
					assert.equal(e.message, GradesControllerErrors.INVALID_GRADE);
				}
			});

			it('throws an error for undefined grade', async() => {
				try {
					const controller = new GradesController('href', 'token');
					await controller.updateGrade();
					assert.fail();
				} catch (e) {
					assert.equal(e.message, GradesControllerErrors.INVALID_GRADE);
				}
			});

			it('throws an error for grade with no entity', async() => {
				try {
					const controller = new GradesController('href', 'token');
					await controller.updateGrade(new Grade('numeric', 10, 50));
					assert.fail();
				} catch (e) {
					assert.equal(e.message, GradesControllerErrors.GRADE_MUST_HAVE_ENTITY);
				}
			});

			it('throws an error when grade does not have proper action', async() => {
				try {
					const controller = new GradesController('href', 'token');
					await controller.updateGrade(new Grade('numeric', 10, 50, null, null, {
						properties: {
							outOf: 100,
							scoreType: 'Numeric',
							score: 60,
							letterGrade: null,
							letterGradeOptions: null
						},
						hasActionByName: () => false,
					}
					));
					assert.fail();
				} catch (e) {
					assert.equal(e.message, GradesControllerErrors.NO_SAVE_GRADE_ACTION);
				}
			});

			it('throws an error when grade does not have action with expected field', async() => {
				try {
					const controller = new GradesController('href', 'token');
					await controller.updateGrade(new Grade('numeric', 10, 50, null, null,
						{
							properties: {
								outOf: 100,
								scoreType: 'Numeric',
								score: 60,
								letterGrade: null,
								letterGradeOptions: null
							},
							hasActionByName: (name) => name === 'SaveGrade',
							getActionByName: () => ({
								name: 'SaveGrade',
								hasFieldByName: () => false,
							})
						}
					));
					assert.fail();
				} catch (e) {
					assert.equal(e.message, GradesControllerErrors.FIELD_IN_ACTION_NOT_FOUND('SaveGrade', 'value'));
				}
			});

		});
	});
});
