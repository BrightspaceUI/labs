# PubSub

A simple class implementation of the publish-subscribe model.

## Simple Example

```js
import PubSub from '@brightspace-ui/labs/utilites/pub-sub.js';

// Instantiate the PubSub class
const myPubSub = new PubSub();

// Register subscribers
const subscriber1 = (message) => console.log('Subscriber 1 received: ', message);
const subscriber2 = (message) => console.log('Subscriber 2 received: ', message);
myPubSub.subscribe(subscriber1);
myPubSub.subscribe(subscriber2);

// Publish messages to subscribers
myPubSub.publish('Hello!');
// Console: Subscriber 1 received: Hello!
// Console: Subscriber 2 received: Hello!

// Unsubscribe
myPubSub.unsubscribe(subscriber1);
myPubSub.unsubscribe(subscriber2);
```

## Instance Methods

### Constructor

The constructor takes no arguments.

### `clear()`

The `clear` method unsubscribes all subscribed callback functions. Subscriber callback functions are not called at this time, just removed.

This method accepts no arguments and returns no values.

### `publish(...args)`

The `publish` method is used to publish messages/data to all subscribed callbacks. All subscribed callback functions are called in subscription order with the same arguments passed to `publish`.

| Parameter Name | Type | Description | Required |
|---|---|---|---|
| `...args` | Any | The arguments to be passed to subscriber callback functions when called. | No |

`publish` returns no values.

### `subscribe(callback, initialize = false)`

The `subscribe` method is used to subscribe a callback function for future published messages.

If the callback being subscribed is already subscribed, nothing will change and it will still only be called once when messages are published.

By default, a subscribed callback function won't be called until a message is published, but if the `initialize` argument is set to `true` and the `PubSub` instance has published at least once, then callback function will be immediately called after subscription with the last published arguments.

| Parameter Name | Type | Description | Required | Default Value |
|---|---|---|---|---|
| `callback` | Function | The callback function to be called when messages are published. | True | |
| `initialize` | Boolean | Whether or not to immedately call the callback function with the last published values. | False | `false` |

`subscribe` returns no values.

### `unsubscribe(callback)`

The `unsubscribe` method is used to remove a callback function from the collection of subscribers so it no longer receives future published messages.

If the callback function passed in does not match a currently subscribed function, nothing happens.

| Parameter Name | Type | Description | Required |
|---|---|---|---|
| `callback` | Function | The callback function to remove from the subscribers. | True |

`unsubscribe` returns no values.
