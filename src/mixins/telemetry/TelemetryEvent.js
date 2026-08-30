
export class TelemetryEvent {
	static dispatch(elm, action, property, value) {
		elm.dispatchEvent(
			new CustomEvent('d2l-telemetry-event', {
				detail: {
					action,
					property,
					value
				}
			})
		)
	}
}
