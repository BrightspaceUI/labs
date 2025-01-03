# Wizard

The `<d2l-labs-wizard>` can be used to be display a stepped workflow.

## Usage

```html
<script type="module">
    import '@brightspace-ui/labs/components/wizard.js';
	import '@brightspace-ui/labs/components/wizard-step.js';
</script>
<d2l-labs-wizard id="wizard">
	<d2l-labs-wizard-step step-title="Step 1">
		<p> First step </p>
	</d2l-labs-wizard-step>

	<d2l-labs-wizard-step step-title="Step 2">
		<p> Second step </p>
	</d2l-labs-wizard-step>
</d2l-labs-wizard>
<script>
	var wizard = document.getElementById('wizard');
	wizard.addEventListener('stepper-next', function() {
		wizard.next();
	});
	wizard.addEventListener('stepper-restart', function() {
		wizard.restart();
	});
</script>
```


### Properties:

| Properties | Type | Description |
|--|--|--|
| `step-title` | String | Text displayed in the wizard step |
| `restart-button-title` | String | Text that is displayed within the button |
| `restart-button-tooltip` | String | Text that is displayed within the button tooltip |
| `hide-restart-button` | Boolean | Hide the Restart button |
| `next-button-title` | String | Text that is displayed within the button |
| `next-button-tooltip` | String | Text that is displayed within the button tooltip |
| `disable-next-button` | Boolean | Disable the Next button |
| `hide-next-button` | Boolean | Hide the Next button |

### Events:
- `stepper-next`: dispatched when the Next button is clicked
- `stepper-restart`: dispatched when the Restart button is clicked

