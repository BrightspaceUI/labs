# d2l-labs-attribute-picker

The `d2l-labs-attribute-picker` component is an autocompleting dropdown to choose one or more new or pre-existing attributes inline.

## Usage

```html
<script type="module">
    import '@brightspace-ui/labs/components/attribute-picker.js';
</script>
<d2l-labs-attribute-picker></d2l-labs-attribute-picker>
```

**Properties:**

| Property | Type | Description |
|--|--|--|
| `allow-freeform` | Boolean | When enabled, the user can manually type any attribute they wish. If false, they must select from the dropdown. |
| `attribute-list` | Array |  An array of string/value pairs representing the attributes currently selected in the picker (eg `[{"name":"shown to user","value":"sent in event"}]`). Only the values are sent in events and the string names are otherwise ignored. |
| `assignable-attributes` | Array | An array of string/value pairs, just like `attribute-list`, available in the dropdown list |
| `invalid-tooltip-text` | String (default: At least one attribute must be set) | The text that will appear in the tooltip that informs a user that the state is invalid |
| `label` | String, Required | The label associated with the attribute picker for screen reader users |
| `limit` | Number | The maximum length of attribute-list permitted |
| `required` | Boolean | When true, an error state will appear if no attributes are set. Error state only appear once the user interacts with the component. |

**Events:**

- `d2l-labs-attribute-picker-attributes-changed`: dispatched when an attribute is added or removed from the list of selected attributes. Event `detail` includes:
  - `attributeList`: an array of the selected attributes, in the order they were selected.
- `d2l-labs-attribute-picker-limit-reached`: dispatched when a user attempts to add attributes once the limit is hit. Event `detail` includes:
  - `limit`: the limit that was hit
- `d2l-labs-attribute-picker-text-changed`: dispatched when text is entered into the text input. Event `detail` include:
  - `text`: the current value of the text input
