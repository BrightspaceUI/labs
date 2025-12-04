# ReactiveStore

A simple data store that will automatically notify subscribers when any of its properties changes.

It's designed to work as a state store for Lit based apps and mimics Lit's component class API.

## Usage Examples

### Basic Usage

First, define and instantiate your own Reactive Store:

```js
// my-store.js

import ReactiveStore from '@brightspace-ui/labs/utilities/reactive-store.js';

// Define your store with its reactive properties
class MyStore extends ReactiveStore {
	static get properties() {
		return {
			count: { type: Number },
		};
	}

	constructor() {
		super();

		this.count = 0;
	}

	increment() {
		this.count++;
	}

	decrement() {
		this.count--;
	}
}

// Create an instance of your store
const myStore = new MyStore();

// Create and export a consumer class
export const MyStoreConsumer = myStore.createConsumer();
```

Then, connect to your store from any Lit component using the consumer:

```js
// my-component.js

import { MyStoreConsumer } from './my-store.js';

class MyComponent extends LitElement {
	constructor() {
		super();

		// Connect to the store by instantiating the consumer.
		// This will automatically notify your component of changes to the store properties.
		this.myStoreConsumer = new MyStoreConsumer(this);
	}

	render() {
		// The consumer will have all the same properties defined in your store.
		return html`
			<div>Count: ${this.myStoreConsumer.count}</div>
			<button @click=${this._increment}>Increment</button>
			<button @click=${this._decrement}>Decrement</button>
			<button @click=${this._reset}>Reset</button>
		`;
	}

	_reset() {
		// Updating the values from the consumer will update the store, which will then
		// notify all consumers of the changes and trigger component updates.
		this.myStoreConsumer.count = 0;
	}

	_increment() {
		// You can access any method or property defined in the store, not just reactive properties.
		this.myStoreConsumer.increment();
	}

	_decrement() {
		// You can access any method or property defined in the store, not just reactive properties.
		this.myStoreConsumer.decrement();
	}
}

customElements.define('my-component', MyComponent);
```

### Context Example

If you want to create a store that's tied to a branch of your DOM tree instead of being shared globally, you can generate a pair of Context Provider/Consumer reactive controllers.

Like the basic usage example, you'll first define and instantiate your own Reactive Store, but instead of instantiating the store and creating a consumer for it, you'll create a Context Provider/Consumer pair for it:

```js
// my-store.js

import ReactiveStore from '@brightspace-ui/labs/utilities/reactive-store.js';

// Define your store with its reactive properties
class MyStore extends ReactiveStore {
	static get properties() {
		return {
			count: { type: Number },
		};
	}

	constructor() {
		super();

		this.count = 0;
	}

	increment() {
		this.count++;
	}

	decrement() {
		this.count--;
	}
}

// Generate and export the Context Provider/Consumer pair for your store
const {
	Provider: MyStoreContextProvider,
	Consumer: MyStoreContextConsumer
} = MyStore.createContextControllers();
export { MyStoreContextProvider, MyStoreContextConsumer };
```

Then, instantiate the provider within the component you want to provide the store from:

```js
// my-component.js

import { MyStoreContextProvider } from './my-store.js';

class MyComponent extends LitElement {
	constructor() {
		super();

		// Instantiate the provider here to provide an instance of your store to all descendants of
		// this component.
		// Note: This creates a new instance of your store by default, but it's possible to pass a
		// pre-existing instance to the constructor instead.
		this.myStoreProvider = new MyStoreContextProvider(this);
	}

	render() {
		// The provider will have all the same properties defined in your store, so you can
		// access your store data from the provider if you wish.
		return html`
			<div>Count: ${this.myStoreProvider.count}</div>
			<button @click=${this._increment}>Increment</button>
			<button @click=${this._decrement}>Decrement</button>
			<button @click=${this._reset}>Reset</button>
			<my-descendant-component></my-descendant-component>
		`;
	}

	_reset() {
		// Updating the values from the provider will update the store, which will then
		// notify all consumers of the changes and trigger component updates.
		this.myStoreProvider.count = 0;
	}

	_increment() {
		// You can access any method or property defined in the store, not just reactive properties.
		this.myStoreProvider.increment();
	}

	_decrement() {
		// You can access any method or property defined in the store, not just reactive properties.
		this.myStoreProvider.decrement();
	}
}

customElements.define('my-component', MyComponent);
```

Finally, any component that is descended from the component with the store provider can connect to the store by using your store's Context Consumer:

```js
// my-descendant-component.js

import { MyStoreContextConsumer } from './my-store.js';

class MyDescendantComponent extends LitElement {
	constructor() {
		super();

		// Connect to the store by instantiating the context consumer.
		// This will automatically notify your component of changes to the store properties.
		this.myStoreConsumer = new MyStoreContextConsumer(this);
	}

	render() {
		// The consumer will have all the same properties defined in your store.
		return html`
			<div>Count: ${this.myStoreConsumer.count}</div>
			<button @click=${this._increment}>Increment</button>
			<button @click=${this._decrement}>Decrement</button>
			<button @click=${this._reset}>Reset</button>
		`;
	}

	_reset() {
		// Updating the values from the consumer will update the store, which will then
		// notify all consumers of the changes and trigger component updates for all consumers and
		// the provider as well.
		this.myStoreConsumer.count = 0;
	}

	_increment() {
		// You can access any method or property defined in the store, not just reactive properties.
		this.myStoreConsumer.increment();
	}

	_decrement() {
		// You can access any method or property defined in the store, not just reactive properties.
		this.myStoreConsumer.decrement();
	}
}

customElements.define('my-descendant-component', MyDescendantComponent);
```

### Non-Lit Example

While the `ReactiveStore` was designed with Lit components in mind, there may be situations where you want to connect something other than a Lit component to a store. For such scenarios, the `ReactiveStore` provides a pair of `subscribe`/`unsubscribe` methods.

Similar to other uses, you'll first define and instantiate your own Reactive Store:

```js
// my-store.js

import ReactiveStore from '@brightspace-ui/labs/utilities/reactive-store.js';

// Define your store with its reactive properties
class MyStore extends ReactiveStore {
	static get properties() {
		return {
			count: { type: Number },
		};
	}

	constructor() {
		super();

		this.count = 0;
	}
}

// Create and export an instance of your store
export const myStore = new MyStore();
```

Then, you can subscribe a callback directly to the store from anywhere and that callback will be called whenever a store property changes, just don't forget to unsubscribe your callback when you no longer need it:

```js
import { myStore } from './my-store.js';

// Define and subscribe a callback function
function handlePropertyChange({ property, value, prevValue }) {
	console.log(`The "${property}" property changed from ${prevValue} to ${value}`);
}
myStore.subscribe(handlePropertyChange);

// When a store property is changed, any subscribed callback functions will be invoked synchronously
myStore.count += 1; // console: The "count" property changed from 0 to 1

// Unsubscribe your callback function when you no longer want to receive store updates
myStore.unsubscribe(handlePropertyChange);
```

# API

## The `ReactiveStore` class

The `ReactiveStore` class is an abstract class that can be extended to define your own store.

### Static Properties

#### `properties`

This static propery must be created by the extending class. This property must be an object where each key represents a reactive property to be added to the extending store. The value for each of the property keys must be an object representing the property options.

The available property options are as follows:

| Option | Type | Description | Required | Default Value |
|---|---|---|---|---|
| `hasChanged(oldValue, newValue)` | Function | This comparison function is called when the store property is set. It is called with both the previous value and the new value to be set. If the function returns `true`, the store will notify all consumers of the value change. | False | `(oldValue, newValue) => oldValue !== newValue` |

### Static Methods

#### `createContextControllers()`

This static method is used to generate a Provider/Consumer pair of Reactive Controllers. These controllers can be used to provide a store to Lit components through the use of [Context](https://lit.dev/docs/data/context/).

This method should never be called on the `ReactiveStore` class directly, instead it should be called on the extending class.

Calling this method on the extending class returns an object with the following properties:

| Property | Type | Description |
|---|---|---|
| `Provider` | class | A Reactive Controller responsible for providing the store instance to any descendant components that instantiate the Consumer class. |
| `Consumer` | class | A Reactive Controller that connects the hosting component to the store provided by the ancestor component that instantiated the Provider class. |

### Instance Properties

#### The Reactive `properties`

Each of the reactive properties defined in the static `properties` object will have a getter and setter generated at object construction time.

Any time the property value is updated, the generated setter will check if the property has changed from its previous value. If the property has changed, it will update it and call all subscriber callback functions that have been registered with the store.

Note that since this is a setter, the value of the property itself must be changed for subscribers to be notified of the change. If you change a nested value of the property, the store will not detect that change. If you wish to manually trigger an update notification after changing a nested property, you can call the `forceUpdate()` instance method.

### Instance Methods

#### `constructor()`

The store constructor. Make sure to call `super()` when overriding.

The reactive property accessors are dynamically generated in the constructor.

#### `createConsumer()`

This method can be used on any store instance (i.e. an instance of a class that extends the `ReactiveStore`). When called, it generates and returns a Reactive Controller consumer class that can be used to connect a Lit component to the store instance.

#### `forceUpdate()`

This method can be used on any store instance (i.e. an instance of a class that extends the `ReactiveStore`). When called, it notifies all subscribers that a value within the store has changed without specifying which one.

This method should not be needed in most scenarios since changes to the reactive properties should be the primary way to send update notifications to subscribers. However, this method can be used in cases where a deeply nested property of one the reactive properties has been changed and you wish to notify subscribers that the store has changed.

#### `subscribe(callback)`

This method can be used on any store instance (i.e. an instance of a class that extends the `ReactiveStore`). This method is used to subscribe a callback function for future store update notifications.

If the callback being subscribed is already subscribed, nothing will change and it will still only be called once when the store updates.

| Parameter Name | Type | Description | Required |
|---|---|---|---|
| `callback` | Function | The callback function to be called when the store is updated. | True |

The callback function itself is called with an object as it's first and only parameter. The object contains the following properties:

| Property Name | Type | Description |
|---|---|---|
| `property` | String | The name of the property that was changed. Will be `undefined` if this update was triggered by a `forceUpdate()` call. |
| `value` | Any | The new value of the changed property. Will be `undefined` if this update was triggered by a `forceUpdate()` call. |
| `prevValue` | Any | The previous value of the changed property. Will be `undefined` if this update was triggered by a `forceUpdate()` call. |
| `forceUpdate` | Boolean | Is `true` if this update was triggered by a `forceUpdate()` call. It will be `false` otherwise |

`subscribe` returns no values.

#### `unsubscribe(callback)`

This method can be used on any store instance (i.e. an instance of a class that extends the `ReactiveStore`). This method is used to remove a callback function from the collection of subscribers so it no longer receives future store update notifications.

If the callback function passed in does not match a currently subscribed function, nothing happens.

| Parameter Name | Type | Description | Required |
|---|---|---|---|
| `callback` | Function | The callback function to remove from the subscribers. | True |

`unsubscribe` returns no values.

## The store Consumer class

This is the class that is returned by the `createConsumer()` instance method on an instance of the store.

This class is a [Lit Reactive Controller](https://lit.dev/docs/composition/controllers/) that when instantiated acts as a proxy for the originating store itself.

Any Consumer class instances will have access to all the same properties and methods that the originating store does and will automatically trigger the update cycle on the host component whenever a reactive property of the store changes.

### Instance Properties

#### Proxied Properties and Methods

Since the Consumer acts as a proxy for the originating store, all properties and methods from the original store will also be accessible from the Consumer. The Consumer's properties will be directly connected to the corresponding properties on the originating store instance, so they can be used as if interacting with the store directly.

The proxied properties and methods includes methods on the `ReactiveStore` base class like `forceUpdate`, `subscribe`, `unsubscribe`, etc. However, any properties/methods that conflict with the properties/methods defined by the Consumer class itself (`changedProperties`, `hostDisconnected`, etc.) will be ignored.

Since updating a reactive property on the Consumer is the same as setting it on the store, updating a reactive property will notify all consumers of changes and, in turn, all consumers will then trigger the update cycle for their respective host components.

#### `changedProperties`

Each Consumer instance has a `changedProperties` Map that keeps track of which reactive properties of the store have changed since the end of the host component's last update cycle.

Each key of the map represents a reactive property of the store that has changed since the last update cycle of the host Lit component and the corresponding value will be the previous value of that reactive property.

This map serves a similar function to the `changedProperties` map that [Lit provides](https://lit.dev/docs/components/lifecycle/#changed-properties) as an argument to lifecycle methods like `shouldUpdate` and `willUpdate`.

Note that `changedProperties` is unique for each instance of the Consumer class and is explicitly tied to the hosting component's update cycle.

### Instance Methods

#### `constructor(host)`

The constructor for the Consumer class accepts the following parameters:

| Parameter Name | Type | Description | Required |
|---|---|---|---|
| `host` | LitElement | The host Lit element that the Consumer is to be connected to. | True |

## The context `Provider` class

The context `Provider` class is one of the two [Lit Reactive Controllers](https://lit.dev/docs/composition/controllers/) returned by the `createContextControllers()` static method. The context `Consumer` class is the other controller returned and both of these act as a pair. Both of these controllers also have ther functionality tied to the specific store class you used to generate them.

The context `Provider` controller can be used to provide an instance of your store to a portion of your DOM tree. This is done by instantiating it and connecting it to a host Lit component. Once connected, all descendants of the host component will be able to connect to the provided store by using the corresponding `Consumer` controller.

This class is based on (and internally uses) the `ContextProvider` class from Lit's [Context](https://lit.dev/docs/data/context/) library.

### Instance Properties

#### Proxied Properties and Methods

The context `Provider` acts as a proxy for the originating store, which means that all properties and methods from the original store will also be accessible from the `Provider`. The `Provider`'s properties will be directly connected to the corresponding properties on the originating store instance, so they can be used as if interacting with the store directly.

The proxied properties and methods includes methods on the `ReactiveStore` base class like `forceUpdate`, `subscribe`, `unsubscribe`, etc. However, any properties/methods that conflict with the properties/methods defined by the `Provider` class itself (`changedProperties`, `hostDisconnected`, etc.) will be ignored.

Since updating a reactive property on the `Provider` is the same as setting it on the store, updating a reactive property will notify the `Provider` and all descendant `Consumer` instances of changes and, in turn, the `Provider` and `Consumer` instances will then trigger the update cycle for their respective host components.

#### `changedProperties`

Each context `Provider` instance has a `changedProperties` Map that keeps track of which reactive properties of the provided store have changed since the end of the host component's last update cycle.

Each key of the map represents a reactive property of the provided store that has changed since the last update cycle of the host Lit component and the corresponding value will be the previous value of that reactive property.

This map serves a similar function to the `changedProperties` map that [Lit provides](https://lit.dev/docs/components/lifecycle/#changed-properties) as an argument to lifecycle methods like `shouldUpdate` and `willUpdate`.

Note that `changedProperties` is unique for each instance of the `Provider` class and is explicitly tied to the hosting component's update cycle.

### Instance Methods

#### `constructor(host, store = new StoreClass())`

The constructor for the context `Provider` class accepts the following parameters:

| Parameter Name | Type | Description | Required | Default Value |
|---|---|---|---|---|
| `host` | LitElement instance | The host Lit element that the `Provider` is to be connected to. | True | |
| `store` | ReactiveStore instance | The instance of your store that you wish to provide to descendant context `Consumer` classes. Note that if no store instance is passed to this parameter, an instance of your store will be instantiated to be used. | True | `new StoreClass()` |

## The context `Consumer` class

The context `Consumer` class is one of the two [Lit Reactive Controllers](https://lit.dev/docs/composition/controllers/) returned by the `createContextControllers()` static method. The context `Provider` class is the other controller returned and both of these act as a pair. Both of these controllers also have ther functionality tied to the specific store class you used to generate them.

> Note: This class is separate from the store Consumer class provided by calling a store instance's `createConsumer()`.

The context `Consumer` controller can be used to connect to a context `Provider` class that has been instantiated and connected to an ancestor in the DOM tree. This is done by instantiating it and connecting it to a host Lit component.

This class is based on (and internally uses) the `ContextConsumer` class from Lit's [Context](https://lit.dev/docs/data/context/) library.

### Instance Properties

#### Proxied Properties and Methods

The context `Consumer` acts as a proxy for the originating store (which it receives from the `Provider` ancestor), which means that all properties and methods from the original store will also be accessible from the `Consumer`. The `Consumer`'s properties will be directly connected to the corresponding properties on the originating store instance, so they can be used as if interacting with the store directly.

The proxied properties and methods includes methods on the `ReactiveStore` base class like `forceUpdate`, `subscribe`, `unsubscribe`, etc. However, any properties/methods that conflict with the properties/methods defined by the `Consumer` class itself (`changedProperties`, `hostDisconnected`, etc.) will be ignored.

Since updating a reactive property on the `Consumer` is the same as setting it on the store, updating a reactive property will notify the `Provider` and all descendant `Consumer` instances of changes and, in turn, the `Provider` and `Consumer` instances will then trigger the update cycle for their respective host components.

#### `changedProperties`

Each context `Consumer` instance has a `changedProperties` Map that keeps track of which reactive properties of the provided store have changed since the end of the host component's last update cycle.

Each key of the map represents a reactive property of the provided store that has changed since the last update cycle of the host Lit component and the corresponding value will be the previous value of that reactive property.

This map serves a similar function to the `changedProperties` map that [Lit provides](https://lit.dev/docs/components/lifecycle/#changed-properties) as an argument to lifecycle methods like `shouldUpdate` and `willUpdate`.

Note that `changedProperties` is unique for each instance of the context `Consumer` class and is explicitly tied to the hosting component's update cycle.

### Instance Methods

#### `constructor(host)`

The constructor for the context `Consumer` class accepts the following parameters:

| Parameter Name | Type | Description | Required |
|---|---|---|---|
| `host` | LitElement instance | The host Lit element that the `Consumer` is to be connected to. | True |
