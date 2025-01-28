export default class ControllerHostStub {
	requestUpdateCallCount = 0;
	onRequestUpdate;

	constructor() {
		this.controllersMap = new Map();
		this.preUpdate();
	}

	update() {
		for (const controller of this.controllersMap.keys()) {
			controller.hostUpdate?.();
		}
		this.postUpdate();
	}

	addController(controller) {
		this.controllersMap.set(controller, true);
	}

	postUpdate() {
		this._resolveUpdateComplete();
	}

	preUpdate() {
		this.updateComplete = new Promise((resolve) => {
			this._resolveUpdateComplete = resolve;
		});
	}

	removeController(controller) {
		this.controllersMap.delete(controller);
	}

	requestUpdate() {
		this.requestUpdateCallCount++;
		this.preUpdate();
		this.onRequestUpdate?.();
	}
}
