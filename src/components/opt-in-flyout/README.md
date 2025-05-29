# Opt-in/Opt-out Flyouts

The opt-in and opt-out flyouts can be used in applications to enable users to opt-in or out of new experiences and workflows.

## Opt-in Flyout [d2l-labs-opt-in-flyout]

<!-- docs: demo code -->
```html
<script type="module">
  import '@brightspace-ui/labs/components/opt-in-flyout.js';
</script>
<div style="height: 450px; position: relative; width: 100%;">
  <d2l-labs-opt-in-flyout
    opened
    flyout-title="Flyout Demo Opt-in"
    short-description="This is a <b>short</b> description"
    long-description="This is a <b>long</b> description"
    tab-position="right"
    tutorial-link="https://www.example.com#tutorial"
    help-docs-link="https://www.example.com#documentation">
  </d2l-labs-opt-in-flyout>
</div>
```

## Opt-out Flyout [d2l-labs-opt-out-flyout]

<!-- docs: demo code -->
```html
<script type="module">
  import '@brightspace-ui/labs/components/opt-out-flyout.js';
</script>
<div style="height: 450px; position: relative; width: 100%;">
  <d2l-labs-opt-out-flyout
    opened
    flyout-title="Flyout Demo Opt-out"
    short-description="This is a <b>short</b> description"
    long-description="This is a <b>long</b> description"
    tab-position="right"
    tutorial-link="https://www.example.com#tutorial"
    help-docs-link="https://www.example.com#documentation">
  </d2l-labs-opt-out-flyout>
</div>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|---|---|---|
| `opened` | Boolean, default: `false` | Indicates the opened or closed state of the flyout |
| `flyout-title` | String, required | Title to display at the top of the flyout |
| `short-description` | String |Descriptive text shown beneath the `flyout-title` |
| `long-description` | String | Additional text shown beneath `short-description` |
| `tutorial-link` | String | A URL for a tutorial of the new experience or feature |
| `help-docs-link` | String | A URL for help documentation on the new experience or feature |

Additional properties for `<d2l-labs-opt-out-flyout>`:

| Property | Type | Description |
|---|---|---|
| `hide-reason` | Boolean, default: `false` | Hides the reason field from the opt-out dialog |
| `hide-feedback` | Boolean, default: `false` | Hides the feedback textarea field from the opt-out dialog |

If both `hide-reason` _and_ `hide-feedback` are specified, the opt-out dialog will not display.

### Events
* `flyout-opened`: flyout was expanded
* `flyout-closed`: flyout was collapsed
* `opt-in`: *Turn it on* / *Leave it on* button was clicked
* `opt-out`: *Leave it off* / *Turn it off* button was clicked
<!-- docs: end hidden content -->

## Opt-out Reasons [d2l-labs-opt-out-reason]

<!-- docs: demo code -->
```html
<script type="module">
  import '@brightspace-ui/labs/components/opt-out-flyout.js';
  import '@brightspace-ui/labs/components/opt-out-reason.js';
</script>
<div style="height: 450px; position: relative; width: 100%;">
  <d2l-labs-opt-out-flyout
    opened
    flyout-title="Flyout Demo Opt-out - Custom Reasons"
    short-description="This is a <b>short</b> description"
    long-description="This is a <b>long</b> description"
    tab-position="right"
    tutorial-link="https://www.example.com#tutorial"
    help-docs-link="https://www.example.com#documentation">
    <d2l-labs-opt-out-reason key="test-1" text="Test Option 1"></d2l-labs-opt-out-reason>
    <d2l-labs-opt-out-reason key="test-2" text="Test Option 2"></d2l-labs-opt-out-reason>
  </d2l-labs-opt-out-flyout>
</div>
```

By default, `<d2l-labs-opt-out-flyout>` will make the following opt-out reasons available to the user, in addition to "other":

| key | English text |
| ----------------------- | ----------------------------------------------- |
| `NotReadyForSomethingNew` | It's not a good time for me to try this version |
| `MissingFeature` | It's missing a feature that I use |
| `JustCheckingSomething` | Just switching back to check something |
| `PreferOldExperience` | I think the old version is a better experience |

To provide custom reasons, place `<d2l-labs-opt-out-reason>` elements as children of `<d2l-labs-opt-out-flyout>`.

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|---|---|---|
| `key` | String, required | Uniquely identifies the opt-out reason |
| `text` | String, required | Text that will be displayed to the user |

When the `opt-out` event is fired from `<d2l-labs-opt-out-flyout>`, its `detail` will contain:

* `reason`: unique identifier for the opt-out reason
* `feedback`: optional feedback provided by the user

<!-- docs: end hidden content -->
