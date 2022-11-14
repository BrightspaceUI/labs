# @brightspaceui-labs/drawer

> - [ ] [Design organization buy-in](https://daylight.d2l.dev/developing/creating-component/before-building/#working-with-design)
> - [ ] [Architectural sign-off](https://daylight.d2l.dev/developing/creating-component/before-building/#web-component-architecture)
> - [ ] [Continuous integration](https://daylight.d2l.dev/developing/testing/tools/#continuous-integration)
> - [ ] [Cross-browser testing](https://daylight.d2l.dev/developing/testing/cross-browser/)
> - [ ] [Unit tests](https://daylight.d2l.dev/developing/testing/tools/) (if applicable)
> - [ ] [Accessibility tests](https://daylight.d2l.dev/developing/testing/accessibility/)
> - [ ] [Visual diff tests](https://daylight.d2l.dev/developing/testing/visual-difference/)
> - [ ] Localization with Serge (if applicable)
> - [ ] Demo page
> - [ ] README documentation

Modal that is anchored to the edge of the viewport or parent container.

## Usage

```html
<script type="module">
  import '@brightspace-ui/core/components/button/button.js';
  import '@brightspace-ui-labs/drawer/drawer.js';

  document.querySelector('#open-demo').addEventListener('click', () => {
    document.querySelector('#drawer-demo').show();
  });
</script>
<d2l-labs-drawer id="drawer-demo" title-text="Drawer Title">
  <div>Some drawer content</div>
  <d2l-button slot="footer" primary data-dialog-action="done">Done</d2l-button>
  <d2l-button slot="footer" data-dialog-action>Cancel</d2l-button>
</d2l-labs-drawer>
<d2l-button id="open-demo">Show Drawer</d2l-button>
```

**Notes & TODOs:**

- Child drawers are non functional unless `position='right'`
- Scroll height/component height does not respect default slot when footer slot content is present
- `resize` mechanics require proper implementation
  - ex: % based custom sizes do not resize on window resize
- `lock-scroll` requires implementation
- `trap-focus` requires implementation
- `contained` requires implimentation
- abort close animation requires attention
  - event interception/preventDefault currently fires BOTH the pulse and the 'opening' animations
  - need to integrate `prefers-reduced-motion`
  - may want to have it be optional?
- Swipe away to exit on mobile/touch

**Properties:**

| Attribute | Description | Type | Default |
| --------- | ----------- | ---- | ------- |
| `contained` | **NOT IMPLIMENTED YET** By default, drawer will slide out from side of viewport. In order to slide out and be contained within parent element, must be set to true. (Parent element will also require `position: relative`) | `boolean` | `false` |
| `lock-scroll`| **NOT IMPLIMENTED YET** Enables scroll lock if true  | `boolean`     | `false` |
| `open`      | Reflects whether the drawer is open or closed (True when open)   | `boolean`     | `false` |
| `position`  | Drawer body positioning, dictates which edge of the viewport or container the drawer will come out from  | `top` \| `bottom` \| `left` \| `right` \|  | `right` |
| `size` | Controls drawer size. Can use predefined values or custom px/% inputs | `String` | `'md'` |
| `trap-focus` | **NOT IMPLIMENTED YET** Trap client focus if true  | `boolean`     | `false` |
| `hide-close-button` | Hides close button if false - can still be closed via escape key, a data-dialog-action, clicking outside the element - or using event hook | `boolean` | `true` |
| `hide-header` | Hides header if false | `boolean` | `true` |

**Accessibility:**

To make your usage of `d2l-labs-drawer` accessible, use the following properties when applicable:

| Attribute | Description | Type | Default |
| --------- | ----------- | ---- | ------- |
| `closeButtonLabel` | Close button aria-label | `string` | `'Close'` |
| `label` | Drawer's label as displayed via aria/screenreader & title of header | `string` | `'Drawer'` |

**Events:**

| Name | Description |
| --- | ---- |
| `d2l-drawer-closed` | Emitted when drawer has closed and animations are complete |
| `d2l-drawer-opened` | Emitted when drawer has opened and animations are complete |
| `d2l-drawer-request-close` | Emitted when drawer close is requested - provides opportunity to prevent closure |

**Slots:**
| Name | Description |
| ---- | ----------- |
| `default` | Default slot for content within drawer |
| `footer` | Slot for footer content such as workflow buttons, located at the bottom of drawer. Apply attribute `drawer-close` to workflow buttons to have them automatically close the drawer with the action's bound `value`. |

**Methods:**
| Name | Description |
| ---- | ----------- |
| `close()` | Closes the drawer |
| `show()` | Shows the drawer |
| `resize()` | Resize the drawer to custom size (preset term, px or %) |
