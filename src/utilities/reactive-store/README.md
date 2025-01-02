# ReactiveStore

A simple data store that will automatically notify subscribers when any of its properties changes.

It's designed to work as a state store for Lit based apps and mimics Lit's component class API.

## Usage Examples

### Basic Usage

First define and create your own Reactive Store:

```js
// my-store.js

import ReactiveStore from '@brightspace-ui/labs/utilites/reactive-store.js';

// Define your store with its reactive properties
class MyStore extends ReactiveStore {
	static get properties() {
		return {
			foo: { type: Number },
		};
	}

	constructor() {
		super();

		this.foo = 0;
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
			<div>Foo: ${this.myStoreConsumer.foo}</div>
			<button @click=${this._click}>Update foo</button>
		`;
	}

	_click() {
		// Updating the values from the consumer will update the store, which will then
		// notify all consumers of the changes and trigger component updates.
		this.myStoreConsumer.foo += 1;
	}
}

customElements.define('my-component', MyComponent);
```

### Context Example

If you want to create a store that's tied to a branch of your DOM tree instead of being shared globally, you can generate a pair of Context Provider/Consumer reactive controllers.

Like the basic usage example, you'll first define and create your own Reactive Store, but instead of instantiating the store and creating a consumer for it, you'll create a Context Provider/Consumer pair for it:

```js
// my-store.js

import ReactiveStore from '@brightspace-ui/labs/utilites/reactive-store.js';

// Define your store with its reactive properties
class MyStore extends ReactiveStore {
	static get properties() {
		return {
			foo: { type: Number },
		};
	}

	constructor() {
		super();

		this.foo = 0;
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
			<div>Foo: ${this.myStoreProvider.foo}</div>
			<button @click=${this._click}>Update foo</button>
			<my-descendant-component></my-descendant-component>
		`;
	}

	_click() {
		// Updating the values from the provider will update the store, which will then
		// notify all consumers of the changes and trigger component updates.
		this.myStoreProvider.foo += 1;
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
			<div>Foo: ${this.myStoreConsumer.foo}</div>
			<button @click=${this._click}>Update foo</button>
		`;
	}

	_click() {
		// Updating the values from the consumer will update the store, which will then
		// notify all consumers of the changes and trigger component updates for all consumers and
		// the provider as well.
		this.myStoreConsumer.foo += 1;
	}
}

customElements.define('my-descendant-component', MyDescendantComponent);
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
| `hasChanged(oldValue, newValue)` | Function | This comparison function is called when the store property is set. It is called with both the previous value and the new value to be set. If the result is `true`, the store will notify all consumers of the value change. | False | `(oldValue, newValue) => oldValue !== newValue` |

### Static Methods

#### `createContextControllers()`

This static method is used to generate a pair of Reactive Controllers that can be used to provide a store to Lit components through the use of [Context](https://lit.dev/docs/data/context/).

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

This method can be used by any store instance (i.e. an instance of a class that extends the `ReactiveStore`). When called, it generates and returns a Reactive Controller consumer class that can be used to connect a Lit component to the store instance.

#### `forceUpdate()`

This method can be used by any store instance (i.e. an instance of a class that extends the `ReactiveStore`). When called, it notifies all subscribers that a value within the store has changed without specifying which one.

This method should not be needed in most scenarios since changes to the reactive properties should be the primary way to send update notifications to subscribers. This can be used in cases where a deeply nested property of one the reactive properties has been changed and you wish to notify subscribers that the store has changed.

#### `subscribe(callback, initialize = false)`

This method can be used by any store instance (i.e. an instance of a class that extends the `ReactiveStore`). This method is used to subscribe a callback function for future store update notifications.

If the callback being subscribed is already subscribed, nothing will change and it will still only be called once when the store updates.

By default, a subscribed callback function won't be called until the store is updated, but if the `initialize` argument is set to `true` and the store instance has been updated at least once, then the callback function will be immediately called after subscription with the last update info.

| Parameter Name | Type | Description | Required | Default Value |
|---|---|---|---|---|
| `callback` | Function | The callback function to be called when the store is updated. | True | |
| `initialize` | Boolean | Whether or not to immedately call the callback function with the last update info. | False | `false` |

`subscribe` returns no values.

#### `unsubscribe(callback)`

This method can be used by any store instance (i.e. an instance of a class that extends the `ReactiveStore`). This method is used to remove a callback function from the collection of subscribers so it no longer receives future store update notifications.

If the callback function passed in does not match a currently subscribed function, nothing happens.

| Parameter Name | Type | Description | Required |
|---|---|---|---|
| `callback` | Function | The callback function to remove from the subscribers. | True |

`unsubscribe` returns no values.

## The store Consumer class

This is the class that is returned by the `createConsumer()` instance method on an instance of the store.

This class is a [Lit Reactive Controller](https://lit.dev/docs/composition/controllers/) that when instantiated can be used by a Lit component to connect to the originating store instance.

Any Consumer class instances will have access to all the same properties that the originating store does and will automatically trigger the update cycle on the host component whenever a property of the store changes.

### Instance Properties

#### The Reactive `properties`

Just like the store has a set of properties dynamically generated, the Consumer class will have the same property accessors generated at construction time. The Consumer's properties will be directly connected to the corresponding properties on the originating store instance, so they can be used as if connecting to the store directly.

Setting any of these properties will call the corresponding setter on the originating store, so the store will notify all consumers of changes and in turn any Consumer instance will trigger the update cycle for its host component.

#### `changedProperties`

Each Consumer instance has a `changedProperties` Map that keeps track of which reactive properties of the store have changed since the end of the host component's last update cycle.

Each key of the map represents a reactive property of the store that has changed since the last update cycle of the host Lit component and the corresponding value will be the previous value of that reactive property.

This map serves a similar function to the `changedProperties` map that [Lit provides](https://lit.dev/docs/components/lifecycle/#changed-properties) as an argument to lifecycle methods like `shouldUpdate` and `willUpdate`.

Note that `changedProperties` is unique for each instance of the Consumer class and is explicitly tied to the hosting component's update cycle.

### Instance Methods

#### `forceUpdate()`

This method can be used to call the originating store's own `forceUpdate()` method. See the store's `forceUpdate()` definition for details.
