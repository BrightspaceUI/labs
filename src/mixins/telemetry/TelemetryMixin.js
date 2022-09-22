// Generic of https://github.com/Brightspace/discovery-fra/blob/master/src/mixins/telemetry-mixin.js

export const TelemetryMixin = options => superClass => class TelemetryMixinClass extends superClass {
	get actions() {
		return options.actions;
	}

	get properties() {
		return options.properties;
	}

	get fireOnClose() {
		return options.fireOnClose;
	}

	get debounce() {
		return options.debounce;
	}

	constructor() {
		super();
		const requiredKeys = [
			"sourceId",
			"actions",
			"properties",
			"endpoint"
		];

		if(!requiredKeys.every(key => Object.keys(options).includes(key))){
			const foundMissing = requiredKeys.find(key => !Object.keys(options).includes(key));
			throw new Error(`Telemetry options must have all required keys. Missing ${foundMissing}`);
		}
		if(!options.actions.every(action => typeof action === 'symbol') ) {
			throw new Error(`Telemetry actions must be symbols`);
		}
		if(!options.properties.every(prop => typeof prop === 'symbol') ) {
			throw new Error(`Telemetry properties must be symbols`);
		}

		this.client = new d2lTelemetryBrowserClient.Client({
			endpoint: options.endpoint
		});

		if(this.fireOnClose === true) {
			this.eventQueue = [];
		}
	}

	_handleTelemetryEvent(e) {
		const {action, property, value} = e.detail;
		if (action === undefined || property === undefined) {
			throw new Error('Telemetry events require an action and a property')
		}
		if(this.actions.includes(action) && this.properties.includes(property)) {

			const eventBody = d2lTelemetryBrowserClient.EventBody()
				.setAction(action)
				.setObject(encodeURIComponent(value), property, window.location.href, value);

			const event = new d2lTelemetryBrowserClient.TelemetryEvent()
				.setDate(new Date())
				.setType("TelemetryEvent")
				.setSourceId(options.sourceId)
				.setBody(eventBody);

			if(options.middleware) {
				options.middleware(event);
			}

			if(!this.fireOnClose || !this.debounce || this.debounce === 0) {
				this.client.logUserEvent(event);
			} else {
				this._storeEventAndDebounce(event)
			}

		} else {
			throw new Error("Telemetry event actions and properties must be from the defined symbol list");
		}
	}

	_storeEventAndDebounce(event) {
		this.eventQueue.push(event);
		if(this.debounce && this.debounce !== 0) {
			if(this.debounceTimeout) clearTimeout(this.debounceTimeout);
			this.debounceTimeout = setTimeout(
				() => this.eventQueue.forEach(storedEvent => this.client.logUserEvent(storedEvent)),
				this.debounce
			);
		}
	}

	_handleVisibilityChange(e) {
		if(e.visibilityState === "hidden"){
			this.eventQueue.forEach(event =>
				this.client.logUserEvent(event)
			);
		}
	}

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener('d2l-telemetry-event', this._handleTelemetryEvent);
		if(options.fireOnClose || (options.debounce && options.debounce !== 0)) {
			this.addEventListener('visibilitychange', this._handleVisibilityChange);
		}
	}
}
