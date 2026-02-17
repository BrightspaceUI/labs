This builds off of https://github.com/Brightspace/discovery-fra/blob/master/src/mixins/telemetry-mixin.js and uses https://github.com/Brightspace/d2l-telemetry-browser-client

# Telemetry Mixin

Developers can use the telemetry mixin by defining their actions, properties and sourceId in an object and passing that object to the telemetry mixin. This mixin will add a custom event listener to the element which will listen for events with the 'd2l-telementry-event' type. The TelemetryEvent is a helper object to dispatch the event which will bubble up to the Mixin and get fired.

## Design Choices

A bubbling event design is used to allow developers to define multiple telemetry mixins for SPA's which may have different source id's per page. For example an application where each tool is a different page may want to track different events but keep a top level telemetry mixin for navigation events.

## Example

#### telemetryConfig.js
```js
// symbols are used to verify that events use the same actions and properties defined in the options.
const telemetryOptions = {
  sourceId: "insightsAdoption",
  actions: {
    filtered: Symbol('Filtered'),
    focused:  Symbol('Focused'),
    zoomed:   Symbol('Zoomed'),
    drilled:  Symbol('Drilled')
  },
  properties: {
    numRoles: Symbol('NumRoles'),
    numTools: Symbol('NumTools'),
    numOrgs:  Symbol('NumOrgs'),
    chart:    Symbol('Chart')
  },
  // potential optional configurations
  debounce: 5000, // milliseconds
  fireOnClose: false, // onUnload event dispatch instead of sending request per event
  middleware: telemetryEvent => {}, // modify the final event object before it is sent to the telemetry service.
}
```
### app.js
top level component, could be a SPA router or the application container
```js
import {telemetryConfig} from '../telemetryConfig.js'
import {TelemetryMixin} from '@d2l/telemetry'

class AdoptionDashboard extends TelemetryMixin(telemetryOptions)(LitElement) {
  render() {
    return html`<my-component></my-component>`
  }
}
customElement.define('d2l-adoption-dashboard', AdoptionDashboard)
```

#### myComponent.js
```js

import {TelemetryEvent} from '@d2l/telemetry'
import {telemetryOptions} from '../telemetryConfig.js'

class MyComponent extends LitElement() {

   handleClick(e) {
     // telemetry mixin will handle verifying that these actions match the symbols defined
     // during initialization
     TelemetryEvent.dispatch(this, {
       action: telemetryOptions.actions.filtered,
       property: telemetryOptions.properties.numRoles,
       value: e.target.value
     }
   }

   render() {
      return html`<button @click=${handleClick}>Fire Event</button>`
   }
}
customElement.define('my-component', MyComponent);
```
