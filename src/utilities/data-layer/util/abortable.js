export class Abortable {
	constructor(cleanup = () => {}) {
		this._abortPromise = new Promise((_, reject) => { this.abort = () => reject('Abortable_aborted'); });
		this._cleanup = cleanup;
	}

	run(fn, onFulfilled, onRejected = () => {}) {
		Promise.race([this._abortPromise, fn()]).finally(this._cleanup).then(onFulfilled).catch(err => {
			if (err !== 'Abortable_aborted') onRejected(err);
		});
	}
}

export class AbortableGroup {
	constructor() {
		this._abortables = new Set();
	}

	abort() {
		this._abortables.forEach(abortable => abortable.abort());
	}

	add() {
		const abortable = new Abortable(() => this._abortables.delete(abortable));
		this._abortables.add(abortable);
		return abortable;
	}
}
