# d2l-labs-pagination

A component to indicate the existence of and provide navigation for multiple pages of content.

## Usage

```html
<script type="module">
    import '@brightspace-ui/labs/components/pagination/pagination.js';
</script>
<d2l-labs-pagination></d2l-labs-pagination>
```

## Properties

| Property | Type | Description |
|--|--|--|
| `page-number` | Number, default: 1 | The current page number
| `max-page-number` | Number, default: 1 | The highest page number the user can navigate to
| `show-item-count-select` | Boolean, default: `false` | Determines whether or not to show the `Results Per Page` select component.
| `item-count-options` | Array, default:`[10,20,30,40]` | The options available in the `Results Per Page` select component.
| `selected-count-option` | Number | The starting `item-count-options` value to display in the `Results Per Page` select component. If no value is given, it will default to whatever the first value in the `item-count-options` array.

## Events

* `d2l-labs-pagination-page-change`: dispatched when either the navigation buttons are pressed, or the page number is modified. Event `detail` includes:
  * `page`: the new page number value
* `d2l-labs-pagination-item-counter-change`: dispatched when the item count selector's value is changed. Event `detail` includes:
  * `itemCount`: the value the item count selector was just set to
