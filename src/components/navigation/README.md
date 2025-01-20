## Usage: Primary Components

> These are the components that should be used in the **VAST MAJORITY** of use cases

### d2l-labs-navigation

Add the `d2l-labs-navigation` component, and provide sub elements `d2l-labs-navigation-main-header` & `d2l-labs-navigation-main-footer` (along with their respective slot contents).

```html
<script type="module">
  import '@brightspace-ui/labs/navigation/navigation.js';
  import '@brightspace-ui/labs/navigation/navigation-main-header.js';
  import '@brightspace-ui/labs/navigation/navigation-main-footer.js';
</script>

<d2l-labs-navigation>
	<d2l-labs-navigation-main-header>
		<div slot="left" class="d2l-labs-navigation-header-left">This should be on the left.  As the width changes it shrinks as needed.</div>

		<div slot="right" class="d2l-labs-navigation-header-right">This should be on the right.  It doesn't shrink.</div>
	</d2l-labs-navigation-main-header>
	<d2l-labs-navigation-main-footer>
		<div slot="main" class="d2l-labs-navigation-s-main-wrapper">Stuff goes in here (small border above and below)</div>
	</d2l-labs-navigation-main-footer>
</d2l-labs-navigation>
```

***Relevant CSS class name:***
* `--d2l-labs-navigation-shadow-drop-border-display`: The default value is `block`, but this property can be used to hide the shadow by setting it to `none`.

### d2l-labs-navigation-immersive

Add the `d2l-labs-navigation-immersive` component, providing values for the `backLinkHref` & `backLinkText`. Additionally, you may override any of the 3 slots (`left`, `middle`, `right`).
Please note that overridding the `left` slot will prevent the Back link from displaying. This should only be done in very specialized cases.

```html
<script type="module">
  import '@brightspace-ui/labs/navigation/navigation-immersive.js';
</script>

<d2l-labs-navigation-immersive back-link-href="https://www.d2l.com" back-link-text="Back to D2L">
	<div class="d2l-typography d2l-body-standard" slot="middle">
		<p>Economics 101</p>
	</div>
	<div slot="right">
		...
	</div>
</d2l-labs-navigation-immersive>
```

Optionally:

- The max-width can be configured to match the max-width used by the LE by setting `widthType` to `normal`
- Overflow can be enabled to facilitate components like dropdowns by including the `allow-overflow` boolean attribute
- A shorter version of the back text can be provided by setting the `back-link-text-short` attribute

## Secondary Components

> These are the components that make up the Primary Components. There might be an edge case or two where it makes sense to use one of these in isolation,
> but **PLEASE STRONGLY CONSIDER** using a Primary Component instead.

### d2l-labs-navigation-band

```html
<script type="module">
  import '@brightspace-ui/labs/navigation/navigation-band.js';
</script>

<d2l-labs-navigation-band></d2l-labs-navigation-band>
```

The `d2l-labs-navigation-band` also includes a `slot` with a custom scrollbar and fading effects, but this has only been designed for the `d2l-organization-consortium-tabs` and should not be used for anything else right now.

***Relevant CSS class name:***
* `--d2l-branding-primary-color`: Used to customize the colour of the top navigation band.
* `--d2l-labs-navigation-band-slot-height`: When using the slot, this is needed to setup the proper scrollbar and fading effects.

---

### d2l-labs-navigation-main-header

Add the `d2l-labs-navigation-main-header` component, and provide elements for the `left` and `right` slots.

```html
<script type="module">
  import '@brightspace-ui/labs/navigation/navigation-main-header.js';
</script>

<d2l-labs-navigation-main-header>
	<div slot="left"></div>
	<div slot="right"></div>
</d2l-labs-navigation-main-header>
```

***Slots:***

* `left` (required): Secondary content (that will shrink with page size) oriented on the left side of the centre gutter (whitespace)
* `right` (required): Primary content (that will not shrink with page size) oriented on the right side of the centre gutter (whitespace)

---

### d2l-labs-navigation-main-footer

Add the `d2l-labs-navigation-main-footer` component, and provide elements for the `main` slot.

```html
<script type="module">
  import '@brightspace-ui/labs/navigation/navigation-main-footer.js';
</script>

<d2l-labs-navigation-main-footer>
	<div slot="main"></div>
</d2l-labs-navigation-main-footer>
```

***Slots:***

* `main` (required): Primary content of the footer. The footer will change in size to accommodate its contents

---

### d2l-labs-navigation-link

(Placeholder for now)

***Relevant CSS class name:***
* `--d2l-labs-navigation-primary-color`: Used to customize the hover colour of the highlight links and buttons

---

### d2l-labs-navigation-button-icon

`<d2l-labs-navigation-button-icon>` provides a button with an icon and optional text.

### Properties

| Property | Type | Description |
|--|--|--|
| `disabled` | Boolean | Disables the button |
| `text` | String, required | Text for the button |
| `icon` | String | Preset icon key (e.g. `tier1:gear`) |
| `no-highlight-border` | Boolean | Visually hides the highlight border when hovered/focused |
| `text-hidden` | Boolean | Visually hides the text |
| `tooltip-position` | String | Position of the tooltip ( top\|bottom\|left\|right ); default is bottom |

---

### d2l-labs-navigation-link-icon

Similar to `<d2l-labs-navigation-button-icon>`, a link that comes with an icon and optional text.

### Properties

| Property | Type | Description |
|--|--|--|
| `href` | String, required | URL or URL fragment of the link |
| `text` | String, required | Text for the button |
| `icon` | String | Preset icon key (e.g. `tier1:gear`) |
| `text-hidden` | Boolean | Visually hides the text |

---

### d2l-labs-navigation-iterator

```html
<script type="module">
  import '@brightspace-ui/labs/navigation/navigation-iterator.js';
</script>

<d2l-labs-navigation-iterator></d2l-labs-navigation-iterator>
```

There is only one slot, and the default button text can be hidden with `hide-text`.

```html
<d2l-labs-navigation-iterator hide-text>
	<span>User 1 of 17</span>
</d2l-labs-navigation-iterator>
```

The iterator button labels can be customized with `previous-text` and `next-text`.

```html
<d2l-labs-navigation-iterator previous-text="Back" next-text="Forward"></d2l-labs-navigation-iterator>
```

The iterator buttons can be hidden completely with `no-next` or `no-previous`.

```html
<d2l-labs-navigation-iterator no-next></d2l-labs-navigation-iterator>
<d2l-labs-navigation-iterator no-previous></d2l-labs-navigation-iterator>
```
