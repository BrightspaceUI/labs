# ComputedValues Controller

The `ComputedValues` (plural) controller allows you to define a collection of `ComputedValue` (singular) controllers. Each of these `ComputedValue` controllers holds a value that is dependent on other variables or properties within a component and will automatically update that value whenever the dependencies change.

The main benefit of this controller is that it gives a quick and clean way of definining the update and computation logic of an instance member that is dependent on other members or properties.

Some use cases for this controller include:
* Computing values that you want to show in render, but whose computation is too expensive to perform every render (ex: filtering or sorting a list in the front end based on user input).
* Asynchronously computing values whenever a dependency changes (ex: refetching a value from the API any time a specific property changes).
* Creating a reusable controller that knows how to recompute a value based on dependencies.

## `ComputedValues` vs `ComputedValue`

Internally, the `ComputedValues` (plural) controller uses another controller called `ComputedValue` (singular). The `ComputedValue` controller holds the majority of the functionality that `ComputedValues` uses and the `ComputedValues` controller simply instantiates a collection of `ComputedValue` controllers and assigns them to itself for easy access.

While it's possible to use the `ComputedValue` controller directly, it is recommended that the `ComputedValues` controller be used in most cases, since it makes it easier to create a collection of computed values. Direct use of the `ComputedValue` controller should be reserved for creating reusable controllers.

## Usage

Create an instance of the `ComputedValues` controller and assign it to a member variable. Pass the host and an array of objects to the constructor that each represent one value that will be computed based on dependencies.

```js
import ComputedValues from '@brightspace-ui/labs/controllers/ComputedValues/index.js';

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
				fullName: ${this._computed.fullName.value}<br>
				screamingFullName: ${this._computed.screamingFullName.value}<br>
                shortName: ${this._computed.shortName.value}<br>
				asyncName: ${this._computed.asyncName.pending ? '<loading...>' : this._computed.asyncName.value}<br>
			</p>
		`;
	}

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
		// This computed value implements a custom shouldCompute method
		name: 'shortName',
		initialValue: '',
		isAsync: true,
		getDependencies: () => [this.firstName, this.lastName],
		shouldCompute: (prevDeps, currDeps) => {
			if (prevDeps === null) return true;

			const [prevFirstName, prevLastName] = prevDeps;
			const [currFirstName, currLastName] = currDeps;

			return prevFirstName[0] !== currFirstName[0] || prevLastName !== currLastName;
		},
		compute: (firstName, lastName) => {
			return `${firstName[0]}. ${lastName}`;
		}
    }, {
		// This computed value is asynchronous
		name: 'asyncName',
		initialValue: '',
		isAsync: true,
		getDependencies: () => [this.firstName, this.lastName],
		compute: async(firstName, lastName) => {
			return await asyncApiCall(firstName, lastName);
		}
	}]);
}
```

Check the demo page for additional working examples.

## `ComputedValues` Instance Methods

### Constructor

| Parameter Name | Type | Description | Required |
|---|---|---|---|
| `host` | LitElement | The host for the controller. | Yes |
| `valuesOptions` | Array | The array of objects that each define a computed value. | Yes |
| `valuesOptions[i].name` | String | The name of the computed value. Used to assign the internal `ComputedValue` instance to the `ComputedValues` instance. | Yes |
| `...valuesOptions[i]` | Object | The rest of the attributes for the object are passed to the internal `ComputedValue` instance constructor. See the `ComputedValue` constructor for details. | Yes |

## `ComputedValues` Instance Members

| Member Name | Type | Description |
|---|---|---|
|`this[name]` | `ComputedValue` controller | For each of the objects in the `valuesOptions` array, a `ComputedValue` controller is instantiated and assigned to a memeber on the `ComputedValues` controller instance.<br><br>For example, the following `ComputedValues` instance...<br><br><pre>class MyElement extends LitElement {<br>  _computed = new ComputedValues(this, [{<br>    name: 'myValue',<br>    ...<br>  }]);<br>}</pre><br>...will end up with a `ComputedValue` instance assigned to `this._computed.myValue`.<br><br>For details on what instance members each `ComputedValue` instance has, see the `ComputedValue` Instance Members section below. |

## `ComputedValue` Instance Methods

### Constructor

| Parameter Name | Type | Description | Required |
|---|---|---|---|
| `host` | Lit Element | The host for the controller. | Yes |
| `options` | Object | A collection of options for the controller. | Yes |
| `options.getDependencies` | Function() : Array | The function used to get the array of dependencies for this value. Must return an array and the array should always be the same length. | Yes |
| `options.compute` | Function(...Any) : Any | The function used to calculate the computed value. It's passed the most recent dependencies every time it is called, and the return value is assigned to the controller value member before each render. | Yes |
| `options.initialValue` | Any | The value of the controller value member before the first update occurs. | |
| `options.shouldCompute` | Function(Array, Array) : Bool | The function used to decide whether or not to run the compute function. It's passed an array of the previous dependencies and an array of the current dependencies. It must return a boolean representing whether to call the compute function or not. | |
| `options.isAsync` | Bool | This tells the controller whether the compute function is asynchronous. If this is true, the compute function must return a promise. | |

## `ComputedValue` Instance Members

| Member Name | Type | Description |
|---|---|---|
| `host` | LitElement | The host element of this controller. |
| `value` | Any | This holds the computed value of the controller. |
| `pending` | Bool | Only used when the controller is async. This will be true while an async compute is processing, and false otherwise. |
| `success` | Bool\|Null | Only used when the controller is async. This will be set to true if the previous async compute resolved successfully. This will be set to false if the previous async compute threw an error. This will be set to null if no async compute function has completed yet. |
| `error` | Any | Only used when the controller is async. This will hold error info in the event that previous async compute threw an error. This will be assigned null otherwise. |
| `asyncStatus` | String | Only used when the controller is async. This holds a string representing the current async status of the controller.<br>`"initial"`: Before the first compute function is called.<br>`"pending"`: While an async compute function is in progress.<br>`"success"`: If the last async compute was successful (and another is not currently pending).<br>`"error"`: If the last async compute ended in error (and another is not currently pending). |
| `computeComplete` | Promise | This member is assigned a promise whenever the value starts being computed, and that promise resolves when the value is done being computed. Note that this is intended to be used for testing and should not be relied on for normal use cases. |
