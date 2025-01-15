# navigation

> Note: this is a ["labs" component](https://daylight.d2l.dev/developing/getting-started/component-tiers/). While functional, these tasks are prerequisites to promotion to BrightspaceUI "official" status:
>
> - [ ] [Design organization buy-in](https://daylight.d2l.dev/developing/creating-component/before-building/#working-with-design)
> - [ ] [Architectural sign-off](https://daylight.d2l.dev/developing/creating-component/before-building/#web-component-architecture)
> - [x] [Continuous integration](https://daylight.d2l.dev/developing/testing/tools/#continuous-integration)
> - [x] [Cross-browser testing](https://daylight.d2l.dev/developing/testing/cross-browser/)
> - [x] [Unit tests](https://daylight.d2l.dev/developing/testing/tools/) (if applicable)
> - [x] [Accessibility tests](https://daylight.d2l.dev/developing/testing/accessibility/)
> - [x] [Visual diff tests](https://daylight.d2l.dev/developing/testing/visual-difference/)
> - [ ] Localization with Serge (if applicable)
> - [x] Demo page
> - [x] README documentation

A series of web components for top level navigation use in D2L applications.

## Installation

```shell
npm install @brightspace-ui-labs/navigation
```

![screenshot of sample usage](/screenshots/navigation.png?raw=true)

## Usage: Primary Components

> These are the components that should be used in the **VAST MAJORITY** of use cases

### d2l-navigation

Add the `d2l-navigation` component, and provide sub elements `d2l-navigation-main-header` & `d2l-navigation-main-footer` (along with their respective slot contents).

```html
<script type="module">
  import '@brightspace-ui-labs/navigation/d2l-navigation.js';
  import '@brightspace-ui-labs/navigation/d2l-navigation-main-header.js';
  import '@brightspace-ui-labs/navigation/d2l-navigation-main-footer.js';
</script>

<d2l-navigation>
	<d2l-navigation-main-header>
		<div slot="left" class="d2l-navigation-header-left">This should be on the left.  As the width changes it shrinks as needed.</div>

		<div slot="right" class="d2l-navigation-header-right">This should be on the right.  It doesn't shrink.</div>
	</d2l-navigation-main-header>
	<d2l-navigation-main-footer>
		<div slot="main" class="d2l-navigation-s-main-wrapper">Stuff goes in here (small border above and below)</div>
	</d2l-navigation-main-footer>
</d2l-navigation>
```

***Relevant CSS class name:***
* `--d2l-navigation-shadow-drop-border-display`: The default value is `block`, but this property can be used to hide the shadow by setting it to `none`.

### d2l-navigation-immersive

Add the `d2l-navigation-immersive` component, providing values for the `backLinkHref` & `backLinkText`. Additionally, you may override any of the 3 slots (`left`, `middle`, `right`).
Please note that overridding the `left` slot will prevent the Back link from displaying. This should only be done in very specialized cases.

```html
<script type="module">
  import '@brightspace-ui-labs/navigation/d2l-navigation-immersive.js';
</script>

<d2l-navigation-immersive back-link-href="https://www.d2l.com" back-link-text="Back to D2L">
	<div class="d2l-typography d2l-body-standard" slot="middle">
		<p>Economics 101</p>
	</div>
	<div slot="right">
		...
	</div>
</d2l-navigation-immersive>
```

Optionally:

- The max-width can be configured to match the max-width used by the LE by setting `widthType` to `normal`
- Overflow can be enabled to facilitate components like dropdowns by including the `allow-overflow` boolean attribute
- A shorter version of the back text can be provided by setting the `back-link-text-short` attribute

## Secondary Components

> These are the components that make up the Primary Components. There might be an edge case or two where it makes sense to use one of these in isolation,
> but **PLEASE STRONGLY CONSIDER** using a Primary Component instead.

### d2l-navigation-band

![screenshot of navigation band](/screenshots/navigation-band.png?raw=true)

```html
<script type="module">
  import '@brightspace-ui-labs/navigation/d2l-navigation-band.js';
</script>

<d2l-navigation-band></d2l-navigation-band>
```

The `d2l-navigation-band` also includes a `slot` with a custom scrollbar and fading effects, but this has only been designed for the `d2l-organization-consortium-tabs` and should not be used for anything else right now.

***Relevant CSS class name:***
* `--d2l-branding-primary-color`: Used to customize the colour of the top navigation band.
* `--d2l-navigation-band-slot-height`: When using the slot, this is needed to setup the proper scrollbar and fading effects.

---

### d2l-navigation-main-header

Add the `d2l-navigation-main-header` component, and provide elements for the `left` and `right` slots.

![screenshot of navigation main header](/screenshots/navigation-main-header.png?raw=true)

```html
<script type="module">
  import '@brightspace-ui-labs/navigation/d2l-navigation-main-header.js';
</script>

<d2l-navigation-main-header>
	<div slot="left"></div>
	<div slot="right"></div>
</d2l-navigation-main-header>
```

***Slots:***

* `left` (required): Secondary content (that will shrink with page size) oriented on the left side of the centre gutter (whitespace)
* `right` (required): Primary content (that will not shrink with page size) oriented on the right side of the centre gutter (whitespace)

---

### d2l-navigation-main-footer

Add the `d2l-navigation-main-footer` component, and provide elements for the `main` slot.

![screenshot of navigation main footer](/screenshots/navigation-main-footer.png?raw=true)

```html
<script type="module">
  import '@brightspace-ui-labs/navigation/d2l-navigation-main-footer.js';
</script>

<d2l-navigation-main-footer>
	<div slot="main"></div>
</d2l-navigation-main-footer>
```

***Slots:***

* `main` (required): Primary content of the footer. The footer will change in size to accommodate its contents

---

### d2l-navigation-link

(Placeholder for now)

***Relevant CSS class name:***
* `--d2l-navigation-primary-color`: Used to customize the hover colour of the highlight links and buttons

---

### d2l-navigation-button-icon

`<d2l-navigation-button-icon>` provides a button with an icon and optional text.

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

### d2l-navigation-link-icon

Similar to `<d2l-navigation-button-icon>`, a link that comes with an icon and optional text.

![screenshot of navigation link icon](/screenshots/navigation-link-button-icon.png?raw=true)

### Properties

| Property | Type | Description |
|--|--|--|
| `href` | String, required | URL or URL fragment of the link |
| `text` | String, required | Text for the button |
| `icon` | String | Preset icon key (e.g. `tier1:gear`) |
| `text-hidden` | Boolean | Visually hides the text |

---

### d2l-navigation-iterator

![screenshot of default navigation iterator](/screenshots/d2l-navigation-iterator.png?raw=true)

```html
<script type="module">
  import '@brightspace-ui-labs/navigation/components/d2l-navigation-iterator/d2l-navigation-iterator.js';
</script>

<d2l-navigation-iterator></d2l-navigation-iterator>
```

There is only one slot, and the default button text can be hidden with `hide-text`.

![screenshot of navigation iterator with hidden iterator button text and custom content](/screenshots/d2l-navigation-iterator-hide-text-custom.png?raw=true)

```html
<d2l-navigation-iterator hide-text>
	<span>User 1 of 17</span>
</d2l-navigation-iterator>
```

The iterator button labels can be customized with `previous-text` and `next-text`.

![screenshot of navigation iterator with hidden iterator button text and custom content](/screenshots/d2l-navigation-iterator-custom-buttons.png?raw=true)

```html
<d2l-navigation-iterator previous-text="Back" next-text="Forward"></d2l-navigation-iterator>
```

The iterator buttons can be hidden completely with `no-next` or `no-previous`.

![screenshot of navigation iterator with no next button](/screenshots/d2l-navigation-iterator-no-next.png?raw=true)
![screenshot of navigation iterator with no previous button](/screenshots/d2l-navigation-iterator-no-prev.png?raw=true)

```html
<d2l-navigation-iterator no-next></d2l-navigation-iterator>
<d2l-navigation-iterator no-previous></d2l-navigation-iterator>
```

## Developing and Contributing

After cloning the repo, run `npm install` to install dependencies.

### Testing

To run the full suite of tests:

```shell
npm test
```

Alternatively, tests can be selectively run:

```shell
# unit tests
npm run test:unit

# vdiff tests
npm run test:vdiff
```

### Running the demos

To start a [@web/dev-server](https://modern-web.dev/docs/dev-server/overview/) that hosts the demo page and tests:

```shell
npm start
```

### Versioning and Releasing

This repo is configured to use `semantic-release`. Commits prefixed with `fix:` and `feat:` will trigger patch and minor releases when merged to `main`.

To learn how to create major releases and release from maintenance branches, refer to the [semantic-release GitHub Action](https://github.com/BrightspaceUI/actions/tree/main/semantic-release) documentation.
