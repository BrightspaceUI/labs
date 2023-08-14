# Opt-in/Opt-out Flyouts

The `<d2l-labs-opt-in-flyout>` and `<d2l-labs-opt-out-flyout>` can be used in applications to enable users to opt-in or out of new experiences.

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|---|---|---|
| `open` | Boolean, default: `false` | Indicates the opened or closed state of the flyout |
| `title` | String, required | Title to display at the top of the flyout |
| `short-description` | String |Descriptive text shown beneath the `title` |
| `long-description` | String | Additional text shown beneath `short-description` |
| `tab-position` | String, default: `'right'` | Position to display the expand/collapse tab. Can either be an integer percentage (including the `%` character) or the string `left`, `right`, or `center`/`centre`. |
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

## Opt-out Reasons

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
<!-- docs: end hidden content -->

When the `opt-out` event is fired from `<d2l-labs-opt-out-flyout>`, its `detail` will contain:

* `reason`: unique identifier for the opt-out reason
* `feedback`: optional feedback provided by the user
