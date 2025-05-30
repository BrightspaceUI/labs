# Wizard

The wizard component can be used to display a stepped workflow.

## Wizard [d2l-labs-wizard]

<!-- docs: demo code -->
```html
<script type="module">
  import '@brightspace-ui/labs/components/wizard.js';
  import '@brightspace-ui/labs/components/wizard-step.js';
  // <!-- docs: start hidden content -->
  requestAnimationFrame(() => {
    const wizard = document.getElementById('wizard');
    wizard.addEventListener('stepper-next', function() {
      wizard.next();
    });
    wizard.addEventListener('stepper-restart', function() {
      wizard.restart();
    });
  })
  // <!-- docs: end hidden content -->
</script>
<d2l-labs-wizard
  id="wizard"
  selected-step="1">
  <d2l-labs-wizard-step
    next-button-aria-label="Go to step 2"
    step-title="Get Started"
    hide-restart-button="true">
    <p>First Step</p>
  </d2l-labs-wizard-step>

  <d2l-labs-wizard-step
    aria-title="This is the second step"
    restart-button-tooltip="Restart this wizard">
    <p>Second Step</p>
  </d2l-labs-wizard-step>

  <d2l-labs-wizard-step
    step-title="Almost Done"
    next-button-title="Done"
    next-button-tooltip="Save this wizard">
    <p>Last Step</p>
  </d2l-labs-wizard-step>
</d2l-labs-wizard>
```

<!-- docs: start hidden content -->

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

<!-- docs: end hidden content -->
