import ComputedValue, { ASYNC_STATUSES } from '../../../src/controllers/computed-values/computed-value.js';
import ComputedValues from '../../../src/controllers/computed-values/computed-values.js';
import { expect } from '@brightspace-ui/testing';

class ControllerHostHelper {
	requestUpdateCallCount = 0;

	constructor() {
		this.controllersMap = new Map();
	}

	update() {
		for (const controller of this.controllersMap.keys()) {
			controller.hostUpdate();
		}
	}

	addController(controller) {
		this.controllersMap.set(controller, true);
	}

	removeController(controller) {
		this.controllersMap.delete(controller);
	}

	requestUpdate() {
		this.requestUpdateCallCount++;

		setTimeout(() => {
			this.update();
		}, 0);
	}
}

describe('ComputedValue', () => {

	describe('Basic', () => {
		let host, properties, computeCount, controller;

		const initialValue = 'initial value';

		beforeEach(() => {
			host = new ControllerHostHelper();
			properties = {
				firstName: 'John',
				lastName: 'Smith'
			};
			computeCount = 0;

			// Initialize controller
			controller = new ComputedValue(host, {
				initialValue,
				getDependencies: () => [properties.firstName, properties.lastName],
				compute: (firstName, lastName) => {
					computeCount++;
					return `${firstName} ${lastName}`;
				}
			});
		});

		it('controller value is set to the initialValue', () => {
			expect(controller.value).to.equal(initialValue);
		});

		it('controller doesn\'t recompute before the first update', () => {
			expect(computeCount).to.equal(0);
		});

		it('controller recomputes value based on property updates', () => {
			host.update();
			expect(computeCount).to.equal(1);
			expect(controller.value).to.equal(`${properties.firstName} ${properties.lastName}`);

			properties = {
				firstName: 'Jill',
				lastName: 'Valentine'
			};
			host.update();
			expect(computeCount).to.equal(2);
			expect(controller.value).to.equal(`${properties.firstName} ${properties.lastName}`);
		});

		it('controller doesn\'t recompute if its dependencies don\'t change', () => {
			host.update();
			expect(computeCount).to.equal(1);
			expect(controller.value).to.equal(`${properties.firstName} ${properties.lastName}`);

			host.update();
			expect(computeCount).to.equal(1);

			properties.otherProperty = 'Test 1';
			host.update();
			expect(computeCount).to.equal(1);

			properties.otherProperty = 'Test 2';
			host.update();
			expect(computeCount).to.equal(1);
		});
	});

	describe('Empty Dependencies Array', () => {
		let host, properties, computeCount, controller;

		const initialValue = 'initial value';

		beforeEach(() => {
			host = new ControllerHostHelper();
			properties = {
				firstName: 'John',
				lastName: 'Smith'
			};
			computeCount = 0;

			// Initialize controller
			controller = new ComputedValue(host, {
				initialValue,
				getDependencies: () => [],
				compute: () => {
					computeCount++;
					return `${properties.firstName} ${properties.lastName}`;
				}
			});
		});

		it('controller value is set to the initialValue', () => {
			expect(controller.value).to.equal(initialValue);
		});

		it('controller doesn\'t recompute before the first update', () => {
			expect(computeCount).to.equal(0);
		});

		it('controller only computes on first update', () => {
			const firstComputeValue = `${properties.firstName} ${properties.lastName}`;

			host.update();
			expect(computeCount).to.equal(1);
			expect(controller.value).to.equal(firstComputeValue);

			properties = {
				firstName: 'Jill',
				lastName: 'Valentine'
			};
			host.update();
			expect(computeCount).to.equal(1);
			expect(controller.value).to.equal(firstComputeValue);
		});
	});

	describe('Basic with custom shouldCompute', () => {
		let host, properties, computeCount, controller;

		const initialValue = 'initial value';

		beforeEach(() => {
			host = new ControllerHostHelper();
			properties = {
				firstName: 'John',
				lastName: 'Smith'
			};
			computeCount = 0;

			// Initialize controller
			controller = new ComputedValue(host, {
				initialValue,
				getDependencies: () => [properties.firstName, properties.lastName],
				shouldCompute: (prevDeps, currDeps) => {
					if (prevDeps === null) return true;

					const [prevFirstName, prevLastName] = prevDeps;
					const [currFirstName, currLastName] = currDeps;

					// Only update if the first leter of the first name changes, or the last name changes
					return prevFirstName[0] !== currFirstName[0] || prevLastName !== currLastName;
				},
				compute: (firstName, lastName) => {
					computeCount++;
					return `${firstName[0]}. ${lastName}`;
				}
			});
		});

		it('controller value is set to the initialValue', () => {
			expect(controller.value).to.equal(initialValue);
		});

		it('controller doesn\'t recompute before the first update', () => {
			expect(computeCount).to.equal(0);
		});

		it('controller recomputes value when shouldCompute returns true', () => {
			host.update();
			expect(computeCount).to.equal(1);
			expect(controller.value).to.equal(`${properties.firstName[0]}. ${properties.lastName}`);

			properties.firstName = 'Chris';
			host.update();
			expect(computeCount).to.equal(2);
			expect(controller.value).to.equal(`${properties.firstName[0]}. ${properties.lastName}`);

			properties.lastName = 'Redfield';
			host.update();
			expect(computeCount).to.equal(3);
			expect(controller.value).to.equal(`${properties.firstName[0]}. ${properties.lastName}`);

			properties = {
				firstName: 'Jill',
				lastName: 'Valentine'
			};
			host.update();
			expect(computeCount).to.equal(4);
			expect(controller.value).to.equal(`${properties.firstName[0]}. ${properties.lastName}`);
		});

		it('controller doesn\'t recompute value when shouldCompute returns false', () => {
			host.update();
			expect(computeCount).to.equal(1);
			expect(controller.value).to.equal(`${properties.firstName[0]}. ${properties.lastName}`);

			host.update();
			expect(computeCount).to.equal(1);

			properties.otherProperty = 'Test 1';
			host.update();
			expect(computeCount).to.equal(1);

			properties.firstName = 'Jill';
			host.update();
			expect(computeCount).to.equal(1);
		});
	});

	describe('Async compute', () => {
		let host, properties, computeCount, controller, promise, resolveCall, rejectCall, computePromise;

		const initialValue = 'initial value';
		const users = {
			1: 'Leon Kennedy',
			2: 'Jill Valentine',
			3: 'Chris Redfield',
			4: 'Ada Wong'
		};
		function getUserName(userId) {
			promise = new Promise((resolve, reject) => {
				resolveCall = () => resolve(users[userId]);
				rejectCall = reject;
			});

			return promise;
		}

		beforeEach(() => {
			host = new ControllerHostHelper();
			properties = {
				userId: 1
			};
			computeCount = 0;

			// Initialize controller
			controller = new ComputedValue(host, {
				initialValue,
				isAsync: true,
				getDependencies: () => [properties.userId],
				compute: (userId) => {
					computeCount++;
					computePromise = (async() => await getUserName(userId))();
					return computePromise;
				}
			});
		});

		it('controller value is set to the initialValue', () => {
			expect(controller.value).to.equal(initialValue);
		});

		it('controller doesn\'t recompute before the first update', () => {
			expect(computeCount).to.equal(0);
			expect(controller.pending).to.be.false;
			expect(controller.success).to.be.null;
			expect(controller.error).to.be.null;
			expect(controller.asyncStatus).to.equal(ASYNC_STATUSES.INITIAL);
		});

		it('controller recomputes value based on property updates', async() => {
			host.update();
			expect(computeCount).to.equal(1);
			resolveCall();
			await controller.computeComplete;
			expect(controller.value).to.equal(users[1]);

			properties.userId = 2;
			host.update();
			expect(computeCount).to.equal(2);
			resolveCall();
			await controller.computeComplete;
			expect(controller.value).to.equal(users[2]);
		});

		it('controller doesn\'t recompute if its dependencies don\'t change', async() => {
			host.update();
			expect(computeCount).to.equal(1);
			resolveCall();
			await controller.computeComplete;
			expect(controller.value).to.equal(users[1]);

			host.update();
			expect(computeCount).to.equal(1);

			properties.otherProperty = 'Test 1';
			host.update();
			expect(computeCount).to.equal(1);

			properties.otherProperty = 'Test 2';
			host.update();
			expect(computeCount).to.equal(1);
		});

		it('controller updates async statuses accordingly', async() => {
			// First successful call
			host.update();
			expect(controller.pending).to.be.true;
			expect(controller.success).to.be.null;
			expect(controller.error).to.be.null;
			expect(controller.asyncStatus).to.equal(ASYNC_STATUSES.PENDING);
			resolveCall();
			await controller.computeComplete;
			expect(controller.pending).to.be.false;
			expect(controller.success).to.be.true;
			expect(controller.error).to.be.null;
			expect(controller.asyncStatus).to.equal(ASYNC_STATUSES.SUCCESS);

			// First error call
			properties.userId = 2;
			const errorMessage = 'error message';
			host.update();
			expect(controller.pending).to.be.true;
			expect(controller.success).to.be.true;
			expect(controller.error).to.be.null;
			expect(controller.asyncStatus).to.equal(ASYNC_STATUSES.PENDING);
			rejectCall(errorMessage);
			await controller.computeComplete;
			expect(controller.pending).to.be.false;
			expect(controller.success).to.be.false;
			expect(controller.error).to.equal(errorMessage);
			expect(controller.asyncStatus).to.equal(ASYNC_STATUSES.ERROR);

			// Second successful call
			properties.userId = 3;
			host.update();
			expect(controller.pending).to.be.true;
			expect(controller.success).to.be.false;
			expect(controller.error).to.equal(errorMessage);
			expect(controller.asyncStatus).to.equal(ASYNC_STATUSES.PENDING);
			resolveCall();
			await controller.computeComplete;
			expect(controller.pending).to.be.false;
			expect(controller.success).to.be.true;
			expect(controller.error).to.be.null;
			expect(controller.asyncStatus).to.equal(ASYNC_STATUSES.SUCCESS);
		});
	});

	describe('Async compute with custom shouldRequestUpdate', () => {
		let host, controller, promise, resolveCall, rejectCall, computePromise;

		const initialValue = 'initial value';
		function genTestPromise() {
			promise = new Promise((resolve, reject) => {
				resolveCall = resolve;
				rejectCall = reject;
			});

			return promise;
		}

		beforeEach(() => {
			host = new ControllerHostHelper();

			// Initialize controller
			controller = new ComputedValue(host, {
				initialValue,
				isAsync: true,
				getDependencies: () => [],
				compute: () => {
					computePromise = genTestPromise();
					return computePromise;
				},
				shouldCompute: () => true,
				shouldRequestUpdate: (prevState, currState) => {
					return currState.success && prevState.value !== currState.value;
				}
			});
		});

		it('requestUpdate should be called when expected', async() => {
			expect(host.requestUpdateCallCount).to.equal(0);
			host.update();
			resolveCall('Test 1');
			await controller.computeComplete;
			expect(host.requestUpdateCallCount).to.equal(1);

			host.update();
			resolveCall('Test 2');
			await controller.computeComplete;
			expect(host.requestUpdateCallCount).to.equal(2);
		});

		it('requestUpdate shouldn\'t be called when expected', async() => {
			expect(host.requestUpdateCallCount).to.equal(0);
			host.update();
			resolveCall(initialValue);
			await controller.computeComplete;
			expect(host.requestUpdateCallCount).to.equal(0);

			host.update();
			rejectCall('Error 1');
			await controller.computeComplete;
			expect(host.requestUpdateCallCount).to.equal(0);
		});
	});
});

describe('ComputedValues', () => {

	describe('Multiple ComputedValue controllers', () => {
		let host, properties, controller;

		const name1 = 'name 1';
		const name2 = 'name 2';
		const name3 = 'name 3';

		const initialValue1 = 'initial value 1';
		const initialValue2 = 'initial value 2';
		const initialValue3 = 'initial value 3';

		beforeEach(() => {
			host = new ControllerHostHelper();
			properties = {
				userId: 1,
				firstName: 'John',
				lastName: 'Smith'
			};

			// Initialize controller
			controller = new ComputedValues(host, [
				{
					name: name1,
					initialValue: initialValue1,
					getDependencies: () => [properties.firstName, properties.lastName],
					compute: (firstName, lastName) => `${firstName} ${lastName}`
				},
				{
					name: name2,
					initialValue: initialValue2,
					getDependencies: () => [properties.firstName, properties.lastName],
					shouldCompute: (prevDeps, currDeps) => {
						if (prevDeps === null) return true;

						const [prevFirstName, prevLastName] = prevDeps;
						const [currFirstName, currLastName] = currDeps;

						// Only update if the first leter of the first name changes, or the last name changes
						return prevFirstName[0] !== currFirstName[0] || prevLastName !== currLastName;
					},
					compute: (firstName, lastName) => `${firstName[0]}. ${lastName}`
				},
				{
					name: name3,
					initialValue: initialValue3,
					isAsync: true,
					getDependencies: () => [properties.userId],
					compute: async(userId) => {
						await new Promise(resolve => setTimeout(resolve, 100)); // artificial delay for 100 milliseconds

						return `userId: ${userId}`;
					}
				}
			]);
		});

		it('controller values are set to their initial values', () => {
			expect(controller[name1].value).to.equal(initialValue1);
			expect(controller[name2].value).to.equal(initialValue2);
			expect(controller[name3].value).to.equal(initialValue3);
		});

		it('controller computes first update for all values', async() => {
			host.update();
			await controller[name1].computeComplete;
			await controller[name2].computeComplete;
			await controller[name3].computeComplete;

			expect(controller[name1].value).to.equal(`${properties.firstName} ${properties.lastName}`);
			expect(controller[name2].value).to.equal(`${properties.firstName[0]}. ${properties.lastName}`);
			expect(controller[name3].value).to.equal(`userId: ${properties.userId}`);
		});
	});
});
