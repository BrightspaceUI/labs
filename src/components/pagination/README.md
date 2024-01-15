# d2l-labs-pager-numeric

A component to indicate the existence of and provide navigation for multiple pages of content.

## Usage

```html
<script type="module">
    import '@brightspace-ui/labs/components/pager-numeric.js';
</script>
<d2l-labs-pager-numeric></d2l-labs-pager-numeric>
```

## Properties

| Property | Type | Description |
|--|--|--|
| `page-number` | Number, default: 1 | The current page number
| `max-page-number` | Number, default: 1 | The highest page number the user can navigate to
| `show-page-size-selector` | Boolean, default: `false` | Determines whether or not to show the `Results Per Page` select component.
| `page-sizes` | Array, default:`[10,20,30,40]` | The options available in the `Results Per Page` select component.
| `page-size` | Number | The starting `page-sizes` value to display in the `Results Per Page` select component. If no value is given, it will default to whatever the first value in the `page-sizes` array.

## Events

* `d2l-labs-pager-numeric-page-change`: dispatched when either the navigation buttons are pressed, or the page number is modified. Event `detail` includes:
  * `page`: the new page number value
* `d2l-labs-pager-numeric-page-size-change`: dispatched when the item count selector's value is changed. Event `detail` includes:
  * `itemCount`: the value the item count selector was just set to
