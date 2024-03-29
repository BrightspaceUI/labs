# d2l-labs-accessibility-disability-simulator

A wrapper component that can be used to simulate how users with different forms of disabilities would experience the content within its slot.

## Usage

```html
<script type="module">
    import '@brightspace-ui/labs/components/accessibility-disability-simulator.js';
</script>
<d2l-labs-accessibility-disability-simulator>
	...
</d2l-labs-accessibility-disability-simulator>
```

## Properties

| Property | Type | Description |
|--|--|--|
| `blur-level` | Number, default: 50 | The level of blurriness when the `low-vision` filter is being used, should range between 1 and 100
| `disability-type` | String | The type of disability to simulate, see [here](#disability-type-values) for the options
| `hide-alert` | Boolean, default: `false` | Whether or not the alert should be shown
| `hide-controls` | Boolean, default: `false` | Whether or not to show the disability type selection and blur level controls


### Disability Type Values
- `no-vision`, Simulates not being able to see anything by hiding the slotted content off of the screen
- `low-vision`, Simulates having a limited amount of vision by blurring out the slotted content
- `keyboard-only`, Simulates the inability to use a mouse, forcing the slotted content to only be navigable using keyboard inputs
- `colorblind-achromatopsia`, Simulates achromatopsia (grayscale) colorblindness
- `colorblind-deuteranopia`, Simulates deuteranopia (green-light deficient) colorblindness
- `colorblind-protanopia`, Simulates protanopia (red-light deficient) colorblindness
- `colorblind-tritanopia`, Simulates tritanopia (blue-light deficient) colorblindness
