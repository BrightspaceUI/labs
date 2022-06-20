import CLASSES_DATA from './classes-data.js';

async function asyncPause(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export default class ClassesApi {
	static async getClasses() {
		await asyncPause(100);

		return CLASSES_DATA.map(({ id, name }) => ({ id, name }));
	}

	static async getStudents(classId) {
		await asyncPause(500);

		return CLASSES_DATA.find((c) => c.id === classId)?.students;
	}
}
