# AI Button

This is a special button style used to draw extra attention to a new AI-powered feature; it is not an official design pattern and each usage should be carefully considered.

It has a default image, but it is also compatible with the `<d2l-icon-custom>` component via the `icon` slot.

## AI Button [d2l-labs-button-ai]

<!-- docs: demo code -->
```html
<script type="module">
  import '@brightspace-ui/labs/components/button-ai.js';
</script>
<d2l-labs-button-ai text="New AI Feature"></d2l-labs-button-ai>
```

<!-- docs: start hidden content -->

**Properties:**

| Property | Type | Description |
|--|--|--|
| `text` | String, required | Text for the button |
| `disabled` | Boolean | Disables the button |
| `disabled-tooltip` | String | Tooltip text when disabled |

<!-- docs: end hidden content -->
