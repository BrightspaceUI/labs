export class DataLayerController {
	constructor(host, dataLayerGroup, props = []) {
		(this.host = host).addController(this);
		this.loading = false;
		this._loadingProps = new Set();

		props.forEach(prop => {
			dataLayerGroup.getItem(prop).subscribe(v => {
				this._updateProp(prop, v.value);
				this._updateLoading(prop, v.evaluating);
				this[prop] = v.value;

				this.host.requestUpdate();
			}, true);
		});
	}

	getLoading(prop) {
		if (!prop) return this.loading;
		return this._loadingProps.has(prop);
	}

	_updateLoading(prop, loading) {
		if (loading && !this._loadingProps.has(prop)) this._loadingProps.add(prop);
		else if (!loading && this._loadingProps.has(prop)) this._loadingProps.delete(prop);
		else return;

		this.loading = !!this._loadingProps.size;
		this.host.requestUpdate();
	}

	_updateProp(prop, value) {
		if (this[prop] === value) return;

		this[prop] = value;
		this.host.requestUpdate();
	}
}
