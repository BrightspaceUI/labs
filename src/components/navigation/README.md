# Navigation

A series of web components for top level navigation used on D2L pages. The existing components are completed but there is additional functionality for these components on the backlog.

<!-- docs: start hidden content -->
> **Primary Components**
>
> These are the components that should be used in the **VAST MAJORITY** of use cases
<!-- docs: end hidden content -->

## Navigation [d2l-labs-navigation]

Add the `d2l-labs-navigation` component, and provide sub elements `d2l-labs-navigation-main-header` & `d2l-labs-navigation-main-footer` (along with their respective slot contents).

<!-- docs: demo code display:block -->
```html
<script type="module">
  import '@brightspace-ui/labs/components/navigation/navigation.js';
  import '@brightspace-ui/labs/components/navigation/navigation-main-header.js';
  import '@brightspace-ui/labs/components/navigation/navigation-main-footer.js';
</script>

<d2l-labs-navigation has-skip-nav>
	<d2l-labs-navigation-main-header>
		<div slot="left" class="d2l-labs-navigation-header-left" style="background-color: pink;">This should be on the left.  As the width changes it shrinks as needed.</div>
		<div slot="right" class="d2l-labs-navigation-header-right" style="background-color: lightblue;">This should be on the right.  It doesn't shrink.</div>
	</d2l-labs-navigation-main-header>
	<d2l-labs-navigation-main-footer>
		<div slot="main" class="d2l-labs-navigation-s-main-wrapper">Stuff goes in here (small border above and below)</div>
	</d2l-labs-navigation-main-footer>
</d2l-labs-navigation>
```

***Relevant CSS class name:***
* `--d2l-labs-navigation-shadow-drop-border-display`: The default value is `block`, but this property can be used to hide the shadow by setting it to `none`.

## Immersive Navigation [d2l-labs-navigation-immersive]

Add the `d2l-labs-navigation-immersive` component, providing values for the `backLinkHref` & `backLinkText`. Additionally, you may override any of the 3 slots (`left`, `middle`, `right`).
Please note that overridding the `left` slot will prevent the Back link from displaying. This should only be done in very specialized cases.

<!-- docs: demo code -->
```html
<script type="module">
  import '@brightspace-ui/labs/components/navigation/navigation-immersive.js';
  import '@brightspace-ui/labs/components/navigation/navigation-iterator.js';
</script>

<d2l-labs-navigation-immersive back-link-href="https://www.example.org" back-link-text="Back to D2L">
	<div class="d2l-typography d2l-body-standard" slot="middle">
		<p>Economics 101</p>
	</div>
	<div slot="right">
		<d2l-labs-navigation-iterator></d2l-labs-navigation-iterator>
	</div>
</d2l-labs-navigation-immersive>
```

Optionally:

- The max-width can be configured to match the max-width used by the LE by setting `widthType` to `normal`
- Overflow can be enabled to facilitate components like dropdowns by including the `allow-overflow` boolean attribute
- A shorter version of the back text can be provided by setting the `back-link-text-short` attribute

---

<!-- docs: start hidden content -->
> **Secondary Components**
>
> These are the components that make up the Primary Components. There might be an edge case or two where it makes sense to use one of these in isolation,
> but **PLEASE STRONGLY CONSIDER** using a Primary Component instead.

## Navigation Band [d2l-labs-navigation-band]

```html
<script type="module">
  import '@brightspace-ui/labs/components/navigation/navigation-band.js';
</script>

<d2l-labs-navigation-band></d2l-labs-navigation-band>
```

The `d2l-labs-navigation-band` also includes a `slot` with a custom scrollbar and fading effects, but this has only been designed for the `d2l-organization-consortium-tabs` and should not be used for anything else right now.

***Relevant CSS class name:***
* `--d2l-branding-primary-color`: Used to customize the colour of the top navigation band.
* `--d2l-labs-navigation-band-slot-height`: When using the slot, this is needed to setup the proper scrollbar and fading effects.

## Main Header [d2l-labs-navigation-main-header]

Add the `d2l-labs-navigation-main-header` component, and provide elements for the `left` and `right` slots.

```html
<script type="module">
  import '@brightspace-ui/labs/components/navigation/navigation-main-header.js';
</script>

<d2l-labs-navigation-main-header>
	<div slot="left"></div>
	<div slot="right"></div>
</d2l-labs-navigation-main-header>
```

***Slots:***

* `left` (required): Secondary content (that will shrink with page size) oriented on the left side of the centre gutter (whitespace)
* `right` (required): Primary content (that will not shrink with page size) oriented on the right side of the centre gutter (whitespace)

## Main Footer [d2l-labs-navigation-main-footer]

Add the `d2l-labs-navigation-main-footer` component, and provide elements for the `main` slot.

```html
<script type="module">
  import '@brightspace-ui/labs/components/navigation/navigation-main-footer.js';
</script>

<d2l-labs-navigation-main-footer>
	<div slot="main"></div>
</d2l-labs-navigation-main-footer>
```

***Slots:***

* `main` (required): Primary content of the footer. The footer will change in size to accommodate its contents

---

> **Actions**
>
> Use these components inside of the navigation component slots.

<!-- docs: end hidden content -->

## Navigation Link [d2l-labs-navigation-link]

`<d2l-labs-navigation-link>` provides a link with the navigation focus effect.

<!-- docs: demo code -->
```html
<script type="module">
	import '@brightspace-ui/labs/components/navigation/navigation-link.js';
</script>
<div style="border: 1px solid #999999; border-top: 4px solid slateblue; height: 90px; padding: 0 18px; width: 100%;">
	<d2l-labs-navigation-link href="https://www.example.org">Settings</d2l-labs-navigation-link>
</div>
```

<!-- docs: start hidden content -->
***Relevant CSS class name:***
* `--d2l-labs-navigation-primary-color`: Used to customize the hover colour of the highlight links and buttons
<!-- docs: end hidden content -->

## Navigation Button Icon [d2l-labs-navigation-button-icon]

`<d2l-labs-navigation-button-icon>` provides a button with an icon and optional text.

<!-- docs: demo code -->
```html
<script type="module">
	import '@brightspace-ui/labs/components/navigation/navigation-button-icon.js';
</script>
<div style="border: 1px solid #999999; border-top: 4px solid slateblue; height: 90px; padding: 0 18px; width: 100%;">
	<d2l-labs-navigation-button-icon icon="tier3:gear" text="Settings"></d2l-labs-navigation-button-icon>
</div>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|--|--|--|
| `disabled` | Boolean | Disables the button |
| `text` | String, required | Text for the button |
| `icon` | String | Preset icon key (e.g. `tier1:gear`) |
| `no-highlight-border` | Boolean | Visually hides the highlight border when hovered/focused |
| `text-hidden` | Boolean | Visually hides the text |
| `tooltip-position` | String | Position of the tooltip ( top\|bottom\|left\|right ); default is bottom |
<!-- docs: end hidden content -->

## Navigation Link Icon [d2l-labs-navigation-link-icon]

Similar to `<d2l-labs-navigation-button-icon>`, a link that comes with an icon and optional text.

<!-- docs: demo code -->
```html
<script type="module">
	import '@brightspace-ui/labs/components/navigation/navigation-link-icon.js';
</script>
<div style="border: 1px solid #999999; border-top: 4px solid slateblue; height: 90px; padding: 0 18px; width: 100%;">
	<d2l-labs-navigation-link-icon href="https://www.example.org" icon="tier3:gear" text="Settings"></d2l-labs-navigation-link-icon>
</div>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|--|--|--|
| `href` | String, required | URL or URL fragment of the link |
| `text` | String, required | Text for the button |
| `icon` | String | Preset icon key (e.g. `tier1:gear`) |
| `text-hidden` | Boolean | Visually hides the text |
<!-- docs: end hidden content -->

## Navigation Dropdown Button Icon [d2l-labs-navigation-dropdown-button-icon]

<!-- docs: demo -->
```html
<script type="module">
	import '@brightspace-ui/labs/components/navigation/navigation-dropdown-button-icon.js';
</script>
<div style="border: 1px solid #999999; border-top: 4px solid slateblue; height: 90px; padding: 0 18px; width: 100%;">
	<d2l-labs-navigation-dropdown-button-icon icon="tier3:discussions" text="Subscription alerts" has-notification notification-text="You have new subscription alerts"></d2l-labs-navigation-dropdown-button-icon>
</div>
```

## Navigation Dropdown Button Custom [d2l-labs-navigation-dropdown-button-custom]

<!-- docs: demo -->
```html
<script type="module">
	import '@brightspace-ui/labs/components/navigation/navigation-dropdown-button-custom.js';
</script>
<div style="border: 1px solid #999999; border-top: 4px solid slateblue; height: 90px; padding: 0 18px; width: 100%;">
  <d2l-labs-navigation-dropdown-button-custom opener-label="User Name, avatar">
    <span slot="opener" style="align-items: center; display: flex; font-size: 0.7rem; gap: 10px;">
      <span style="background-color: #ab578a; border-radius: 6px; height: 42px; width: 42px;"></span>
      User Name
    </span>
  </d2l-labs-navigation-dropdown-button-custom>
</div>
```

## Navigation Iterator [d2l-labs-navigation-iterator]

<!-- docs: demo code -->
```html
<script type="module">
  import '@brightspace-ui/labs/components/navigation/navigation-iterator.js';
</script>
<div style="border: 1px solid #999999; border-top: 4px solid slateblue; padding: 0 18px; width: 100%;">
	<d2l-labs-navigation-iterator>User 1 of 17</d2l-labs-navigation-iterator>
</div>
```
<!-- docs: start hidden content -->
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
<!-- docs: end hidden content -->
