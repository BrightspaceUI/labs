let __activeComputedValue = null;

export class DataLayerItem {
	constructor(value, { defaultValue = null, callingContext = this } = {}) {
		this.evaluating = false;

		this._isComputed = typeof value === 'function';
		this._subscribers = new Set();

		if (this._isComputed) {
			this._defaultValue = defaultValue;
			this._dependenciesEvaluating = new Set();
			this._getter = value.bind(callingContext);
			this._needsFirstCompute = true;
			this._value = defaultValue;
		} else {
			this._value = value;
		}
	}

	get value() {
		__activeComputedValue?.addDependency(this);
		if (this._needsFirstCompute) this._firstCompute();
		return this._value;
	}

	set value(value) {
		if (this._isComputed) throw new Error('Cannot set value of computed property');
		this._setValue(value);
	}

	addDependency(dependency) {
		if (dependency === this) return;
		if (dependency.evaluating) this._dependenciesEvaluating.add(dependency);
		dependency.subscribe(this._onDependencyChange.bind(this));
	}

	subscribe(callback, immediate = false) {
		this._subscribers.add(callback);
		if (immediate) callback(this);
	}

	async _compute() {
		if (!this.evaluating) this._setValue(this._defaultValue, true);
		// TODO cancel if already evaluating, but leave in evaluating state
		if (this._dependenciesEvaluating.size) return;

		this._setValue(await this._getter(), false);
	}

	_firstCompute() {
		this._needsFirstCompute = false;
		__activeComputedValue = this;
		this._compute();
		__activeComputedValue = null;
	}

	_notify() {
		this._subscribers.forEach(callback => callback(this));
	}

	_onDependencyChange(dependency) {
		if (dependency.evaluating) this._dependenciesEvaluating.add(dependency);
		else this._dependenciesEvaluating.delete(dependency);
		this._compute();
	}

	_setValue(value, evaluating) {
		this._value = value;
		this.evaluating = evaluating || this._dependenciesEvaluating?.size > 0;
		this._notify();
	}
}
