export const ASYNC_STATUSES = Object.freeze({
	INITIAL: 'initial',
	PENDING: 'pending',
	SUCCESS: 'success',
	ERROR: 'error'
});

function defaultShouldCompute(prevDependencies, currDependencies) {
	// If no dependencies exist yet, then this is the first update
	if (prevDependencies === null) {
		return true;
	}

	return prevDependencies.some((prev, index) => prev !== currDependencies[index]);
}

export default class ComputedValue {
	computeComplete = Promise.resolve();
	error = null;
	host;
	pending = false;
	success = null;
	value;

	constructor(host, options = {}) {
		const {
			compute,
			shouldCompute = defaultShouldCompute,
			getDependencies,
			isAsync = false,
			shouldRequestUpdate = () => true,
			initialValue
		} = options;

		if (typeof compute !== 'function') {
			throw new TypeError('Failed to initialize ComputedValueController: compute parameter must be a function.');
		}

		if (typeof getDependencies !== 'function') {
			throw new TypeError('Failed to initialize ComputedValueController: getDependencies parameter must be a function.');
		}

		this._compute = compute;
		this._shouldCompute = shouldCompute;
		this._getDependencies = getDependencies;
		this._isAsync = isAsync;
		this._shouldRequestUpdate = shouldRequestUpdate;
		this.value = initialValue;

		(this.host = host).addController(this);
	}

	get asyncStatus() {
		if (this.pending) {
			return ASYNC_STATUSES.PENDING;
		}

		if (this.success === null) {
			return ASYNC_STATUSES.INITIAL;
		}

		if (this.success) {
			return ASYNC_STATUSES.SUCCESS;
		}

		return ASYNC_STATUSES.ERROR;
	}

	hostUpdate() {
		const currDependencies = this._getDependencies();
		const shouldCompute = this._shouldCompute(this._prevDependencies, currDependencies);
		this._prevDependencies = currDependencies;

		if (shouldCompute) {
			this._updateValue(currDependencies);
		}
	}

	_compute;
	_computeCompleteResolve = () => {};
	_getDependencies;
	_isAsync;
	_latestPromise;
	_prevDependencies = null;
	_shouldCompute;
	_shouldRequestUpdate;

	_updateAsyncValue(dependencies) {
		this._latestPromise = null; // Prevent any ongoing compute update from completing as this is the latest now

		// If there's still an ongoing compute update, don't replace the computeComplete promise.
		// Instead, this effectively extends the computeComplete promise resolution until the _latestPromise is done.
		if (this.pending === false) {
			this.computeComplete = new Promise((resolve) => {
				this._computeCompleteResolve = resolve;
			});
		}
		this.pending = true;

		const promise = this._compute(...dependencies);
		this._latestPromise = promise;

		(async() => {
			let newValue;
			let success;
			let error = null;

			try {
				newValue = await promise;
				success = true;
			} catch (err) {
				error = err;
				success = false;
			}

			// Make sure this promise is still the latest so as not to overwrite a more recent async value
			if (this._latestPromise === promise) {
				const prevState = {
					value: this.value,
					success: this.success,
					error: this.error,
					pending: this.pending
				};

				if (success) {
					this.value = newValue;
				}

				this.success = success;
				this.error = error;
				this.pending = false;

				const currState = {
					value: this.value,
					success: this.success,
					error: this.error,
					pending: this.pending
				};

				if (this._shouldRequestUpdate(prevState, currState)) {
					this.host.requestUpdate();
				}

				this._computeCompleteResolve();
			}
		})();
	}

	_updateValue(dependencies) {
		if (this._isAsync) {
			this._updateAsyncValue(dependencies);
		} else {
			this.computeComplete = new Promise((resolve) => {
				this._computeCompleteResolve = resolve;
			});
			this.value = this._compute(...dependencies);
			this._computeCompleteResolve();
		}
	}
}
