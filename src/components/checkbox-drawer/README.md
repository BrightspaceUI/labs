# d2l-labs-checkbox-drawer

The `d2l-labs-checkbox-drawer` element can be used to get a checkbox with a description. When checked, drawer contents are revealed underneath.

## Usage

```html
<script type="module">
    import '@brightspace-ui/labs/components/checkbox-drawer.js';
</script>
<d2l-labs-checkbox-drawer>
  <p>My drawer content.</p>
</d2l-labs-checkbox-drawer>
```

**Properties:**

| Property | Type | Description |
|--|--|--|
| `aria-label` | String | Provides context for the component. Must be used if `label` is not used. Cannot be used with `label`. |
| `checked` | Boolean | True if the checkbox is checked. False if not checked. |
| `description` | String | Extra information that is displayed beneath the `label`. Optionally used when `label` is used. Cannot be used with `aria-label`. |
| `label` | String | Provides visible information about the component. Must be used if `aria-label` is not used. Cannot be used with `aria-label`. |

**Accessibility:**

To make your usage of `d2l-labs-checkbox-drawer` accessible, use the following properties when applicable:

| Attribute | Description |
|--|--|
| `aria-label` | Provides context for the component. Must be used if `label` is not used. Cannot be used with `label`. |

**Events:**

- `d2l-checkbox-drawer-checked-change`: dispatched when checkbox's state changes.
- `d2l-checkbox-drawer-expand`: dispatched when the drawer starts to expand. As per the [expand collapse component](https://github.com/BrightspaceUI/core/tree/master/components/expand-collapse), the `detail` contains an `expandComplete` promise that can be waited on to determine when the content has finished expanding.
- `d2l-checkbox-drawer-collapse`: dispatched when the drawer starts to collapse. As per the [expand collapse component](https://github.com/BrightspaceUI/core/tree/master/components/expand-collapse), the `detail` contains a `collapseComplete` promise that can be waited on to determine when the content has finished collapsing.

> Note: this is a ["labs" component](https://daylight.d2l.dev/developing/getting-started/component-tiers/). While functional, these tasks are prerequisites to promotion to BrightspaceUI "official" status:
>
> - [ ] [Design organization buy-in](https://daylight.d2l.dev/developing/creating-component/before-building/#working-with-design)
> - [ ] [Architectural sign-off](https://daylight.d2l.dev/developing/creating-component/before-building/#web-component-architecture)
> - [x] [Continuous integration](https://daylight.d2l.dev/developing/testing/tools/#continuous-integration)
> - [x] [Cross-browser testing](https://daylight.d2l.dev/developing/testing/cross-browser/)
> - [x] [Unit tests](https://daylight.d2l.dev/developing/testing/tools/) (if applicable)
> - [x] [Accessibility tests](https://daylight.d2l.dev/developing/testing/accessibility/)
> - [x] [Visual diff tests](https://daylight.d2l.dev/developing/testing/visual-difference/)
> - [x] Localization with Serge (if applicable)
> - [x] Demo page
> - [x] README documentation
