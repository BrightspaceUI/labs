# Checkbox Drawer

The checkbox drawer can be used to get a checkbox with a description. When checked, drawer contents are revealed underneath.

## Checkbox Drawer [d2l-labs-checkbox-drawer]

<!-- docs: demo code align:flex-start autoSize:false size:small -->
```html
<script type="module">
  import '@brightspace-ui/labs/components/checkbox-drawer.js';
</script>
<d2l-labs-checkbox-drawer
  label="Checkbox drawer label."
  description="Checkbox drawer description. Check the box to see the drawer message.">
  Hello there! Uncheck the box to hide me.
</d2l-labs-checkbox-drawer>
```

<!-- docs: start hidden content -->

**Properties:**

| Property | Type | Description |
|--|--|--|
| `checked` | Boolean | True if the checkbox is checked. False if not checked. |
| `description` | String | Extra information that is displayed beneath the `label`. Optionally used when `label` is used. |
| `label` | String | Provides visible information about the component. |
| `read-only` | Boolean | Makes the checkbox non-interactable, replacing it with checkmark if checked is true or an X otherwise |

**Events:**

- `d2l-labs-checkbox-drawer-checked-change`: dispatched when checkbox's state changes.
- `d2l-labs-checkbox-drawer-expand`: dispatched when the drawer starts to expand. As per the [expand collapse component](https://github.com/BrightspaceUI/core/tree/master/components/expand-collapse), the `detail` contains an `expandComplete` promise that can be waited on to determine when the content has finished expanding.
- `d2l-labs-checkbox-drawer-collapse`: dispatched when the drawer starts to collapse. As per the [expand collapse component](https://github.com/BrightspaceUI/core/tree/master/components/expand-collapse), the `detail` contains a `collapseComplete` promise that can be waited on to determine when the content has finished collapsing.

<!-- docs: end hidden content -->
