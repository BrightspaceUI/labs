import ComputedValues, { ComputedValue } from '../../../src/controllers/computed-values/index.js';
import { html, LitElement } from 'lit';

class DemoComponent extends LitElement {
	static properties = {
		firstName: { type: String },
		lastName: { type: String }
	};

	constructor() {
		super();
		this.firstName = 'John';
		this.lastName = 'Smith';
	}

	render() {
		return html`
			<p>
				firstName:
				<input
					.value="${this.firstName}"
					@change=${this._onFirstNameChange}
				></input>
				<br>

				lastName:
				<input
					.value="${this.lastName}"
					@change=${this._onLastNameChange}
				></input>
				<br>

				fullName: ${this._computed.fullName.value}<br>
				screamingFullName: ${this._computed.screamingFullName.value}<br>
				asyncShortName: ${this._computed.asyncShortName.pending ? '<loading...>' : this._computed.asyncShortName.value}<br>
				altFullName: ${this._altFullName.value}
			</p>
		`;
	}

	// Single computed value. Note the use of the singular ComputedValue.
	_altFullName = new ComputedValue(this, {
		initialValue: '',
		getDependencies: () => [this.firstName, this.lastName],
		compute: (firstName, lastName) => `${lastName}, ${firstName}`
	});

	// Multiple computed values. Note the use of the plural ComputedValues.
	_computed = new ComputedValues(this, [{
		// This computed value is dependent on both firstName and lastName
		name: 'fullName',
		initialValue: '',
		getDependencies: () => [this.firstName, this.lastName],
		compute: (firstName, lastName) => `${firstName} ${lastName}`
	}, {
		// This computed value is dependent on the fullName computed value
		name: 'screamingFullName',
		initialValue: '',
		getDependencies: () => [this._computed.fullName.value],
		compute: (fullName) => fullName.toUpperCase()
	}, {
		// This computed value is asynchronous and implements a custom shouldCompute method
		name: 'asyncShortName',
		initialValue: '',
		isAsync: true,
		getDependencies: () => [this.firstName, this.lastName],
		shouldCompute: (prevDeps, currDeps) => {
			if (prevDeps === null) return true;

			const [prevFirstName, prevLastName] = prevDeps;
			const [currFirstName, currLastName] = currDeps;

			return prevFirstName[0] !== currFirstName[0] || prevLastName !== currLastName;
		},
		compute: async(firstName, lastName) => {
			await new Promise(resolve => setTimeout(resolve, 2000)); // artificial delay for 2 seconds

			return `${firstName[0]}. ${lastName}`;
		}
	}]);

	_onFirstNameChange(event) {
		this.firstName = event.target.value;
	}

	_onLastNameChange(event) {
		this.lastName = event.target.value;
	}
}
customElements.define('demo-component', DemoComponent);
