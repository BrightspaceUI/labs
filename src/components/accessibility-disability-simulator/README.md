# d2l-labs-accessibility-disability-simulator

A wrapper component that can be used to simulated different forms of disabilities to the content it's wrapped around.

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
| `disability-type` | String | The type of disability you want to simulate, see [here](#disability-type-values) for the options
| `hide-alert` | Boolean, default: `false` | Whether or not the alert should be shown or not
| `hide-controls` | Boolean, default: `false` | Whether you want to show the controls or not.


### Disability Type Values
- `no-vision`, Simulates not being able to see anything by hiding the wrapped content off of the screen
- `low-vision`, Simulates having a limited amount of vision by blurring out the wrapped content
- `motor-impairment`, Simulates the inability to use a mouse, forcing the wrapped content to only be navigable using keyboard inputs
- `colourblind-achromatopsia`, Simulates achromatopsia (grayscale) colourblindness
- `colourblind-deuteranopia`, Simulates deuteranopia (green-light deficient) colourblindness
- `colourblind-protanopia`, Simulates protanopia (red-light deficient) colourblindness
- `colourblind-tritanopia`, Simulates tritanopia (blue-light deficient) colourblindness
