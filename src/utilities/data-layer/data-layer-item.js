import { AbortableGroup } from './util/abortable.js';

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
			this._inProgressCompute = new AbortableGroup();
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

		dependency.subscribe(this._onDependencyChange.bind(this));
		if (dependency.evaluating) this._onDependencyChange(dependency);
	}

	flush() {
		this._compute();
	}

	subscribe(callback, immediate = false) {
		this._subscribers.add(callback);
		if (immediate) callback(this);
	}

	_compute() {
		this._inProgressCompute.abort();
		this._setValue(this._defaultValue, true);
		if (this._dependenciesEvaluating.size) return;

		this._inProgressCompute.add().run(this._getter, value => this._setValue(value, false), err => this._onError(err));
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

	_onError(err) {
		console.error(err);
		this._setValue(this._defaultValue, false);
	}

	_setValue(value, evaluating = false) {
		evaluating = evaluating || this._dependenciesEvaluating?.size > 0;
		if (this._value === value && this.evaluating === evaluating) return;

		this._value = value;
		this.evaluating = evaluating;
		this._notify();
	}
}
