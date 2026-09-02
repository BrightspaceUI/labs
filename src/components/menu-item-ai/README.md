# AI Menu Item

A menu item that renders the AI icon before its text, used to draw extra attention to a new AI-powered feature within a `<d2l-menu>`; it is not an official design pattern and each usage should be carefully considered.

It behaves like `<d2l-menu-item>` from `@brightspace-ui/core`, except the AI icon is always rendered before the text.

## AI Menu Item [d2l-menu-item-ai]

<!-- docs: demo code -->
```html
<script type="module">
  import '@brightspace-ui/core/components/menu/menu.js';
  import '@brightspace-ui/labs/components/menu-item-ai.js';
</script>
<d2l-menu label="Astronomy">
  <d2l-menu-item-ai text="Summarize with AI"></d2l-menu-item-ai>
</d2l-menu>
```

<!-- docs: start hidden content -->

**Properties:**

| Property | Type | Description |
|--|--|--|
| `text` | String, required | Text displayed by the menu item |
| `description` | String | A description of the menu item that will be used by screen readers for additional context |
| `disabled` | Boolean | Disables the menu item |
| `lines` | Number | The number of lines to display before truncating text with an ellipsis. Defaults to 2 |

**Events:**

* `d2l-menu-item-select`: dispatched when the menu item is selected

<!-- docs: end hidden content -->
