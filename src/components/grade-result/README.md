# @d2l/labs-grade-result

A web component used for rendering grades in Brightspace

## Properties

#### d2l-labs-d2l-grade-result

| Property                          | Type      | Default     | Description                                                  |
| ----------------------------------| --------- | -------     | ------------------------------------------------------------ |
| `href`                            | `string`  | `''`        | The Hypermedia route to power the component. This component runs off of the /grade route or an activity. |
| `token`                           | `string`  | `''`        | For authentication                                           |
| `disableAutoSave`                 | `boolean` | `false`     | Prevent the component from automatically saving the grade to the API when the grade is changed. |
| `_hideTitle`                      | `boolean` | `false`     | This property will hide the "Overall Grade" title above the component. |
| `customManualOverrideText`        | `string`  | `undefined` | This properly will substitute the stock text on the "Manual Override" button. |
| `customManualOverrideClearText`   | `string`  | `undefined` | This properly will substitute the stock text on the "Clear Manual Override" button. |

##### Public Methods

| Method                         | Description                                                  |
| ------------------------------ | ------------------------------------------------------------ |
| `saveGrade(): void`            | This is the method used to manually save the grade to the server when `disableAutoSave = true`. This method will emit `@d2l-grade-result-grade-saved-success` or `@d2l-grade-result-grade-saved-error`. |
| `hasUnsavedChanges(): boolean` | Determines whether the grade has been changed by the user and has not been saved to the server yet. |

If you are only interested in rendering the presentational layer of the component, you can simply use the `d2l-grade-result-presentational` component.

#### d2l-labs-grade-result-presentational

| Property                          | GradeType      | Type                        | Default     | Description                                                  |
| ----------------------------------| -------------- | --------------------------- | ----------- | ------------------------------------------------------------ |
| `gradeType`                       | All            | `string ('Numeric' or 'LetterGrade')` | `'Numeric'` | Specifies the type of grade that the component is meant to render. |
| `labelText`                       | All            | `string`                    | `''`        | The text that appears above the component.                   |
| `scoreNumerator`                  | Numeric        | `number`                    | `0`         | The numerator of the numeric score that is given.            |
| `scoreDenominator`                | Numeric        | `number`                    | `0`         | The denominator of the numeric score that is given.          |
| `selectedLetterGrade`             | LetterGrade    | `string`                    | `''`        | The current selected letter grade of the options given.      |
| `letterGradeOptions`              | LetterGrade    | `Object`                    | `null`      | A dictionary where the key is a unique id and the value is an object containing the LetterGrade text and the PercentStart. |
| `includeGradeButton`              | All            | `boolean`                   | `false`     | Determines whether the grades icon button is rendered.       |
| `includeReportsButton`            | All            | `boolean`                   | `false`     | Determines whether the reports icon button is rendered.      |
| `gradeButtonTooltip`              | All            | `string`                    | `''`        | The text that is inside of the tooltip when hovering over the grades button. |
| `reportsButtonTooltip`            | All            | `string`                    | `''`        | The text that is inside of the tooltip when hovering over the reports button. |
| `readOnly`                        | All            | `boolean`                   | `false`     | Set to `true` if the user does not have permissions to edit the grade. |
| `isManualOverrideActive`          | All            | `boolean`                   | `false`     | Set to `true` if the user is currently manually overriding the grade. This will display the button to 'Clear Manual Override'. |
| `hideTitle`                       | All            | `boolean`                   | `false`     | This property will hide the "Overall Grade" title above the component. |
| `customManualOverrideClearText`   | All            | `string`                    | `undefined` | This property will substitute the stock text on the "Clear Manual Override" button. |
| `subtitleText`                    | All            | `string`                    | `undefined` | This property will show the given text under the title. |
| `required`                 | Numeric        | `Boolean`                    | `false` | Set to `true` if an undefined/blank grade is not considered valid |
| `inputLabelText`                 | Numeric        | `string`                    | `''` |  This property sets the label that will be used inside the aria-label and validation error tool-tips |
| `allowNegativeScore`             | Numeric        | `boolean`                    | `'false'`   | Set to `true` if negative scores can be entered                         |
| `showFlooredScoreWarning`        | Numeric        | `boolean`                    | `'false'`   | Set to `true` if displaying a negative grade that has been floored at 0 |

## Events

#### d2l-labs-d2l-grade-result

| Event                                           | Description                                                  |
| ----------------------------------------------- | ------------------------------------------------------------ |
| `@d2l-grade-result-initialized-success`         | This event is fired when the component is successfully initialized and a grade is loaded from the API. |
| `@d2l-grade-result-initialized-error`           | This event is fired when there is an error initializing the component. This is usually caused by an invalid `href` or `token`. |
| `@d2l-grade-result-grade-updated-success`       | This event is fired when the grade is successfully updated on the frontend. |
| `@d2l-grade-result-grade-updated-error`         | This event is fired when there is an error updating the grade on the frontend. |
| `@d2l-grade-result-grade-saved-success`         | This event is fired when the grade is successfully saved to the server. |
| `@d2l-grade-result-grade-saved-error`           | This event is fired when there is an error while saving the grade to the server. |
| `@d2l-grade-result-grade-button-click`          | This event is fired when the grades button is clicked.       |
| `@d2l-grade-result-reports-button-click`        | This event is fired when the reports button is clicked.      |
| `@d2l-grade-result-manual-override-clear-click` | This event is fired when the manual override clear is clicked. |

#### d2l-labs-grade-result-presentational

| Event                                           | Description                                                  |
| ----------------------------------------------- | ------------------------------------------------------------ |
| `@d2l-grade-result-grade-button-click`          | This event is fired when the grades button is clicked.       |
| `@d2l-grade-result-reports-button-click`        | This event is fired when the reports button is clicked.      |
| `@d2l-grade-result-grade-change`                | This event is fired on the change of the grade for a `gradeType="Numeric"` grade. |
| `@d2l-grade-result-letter-score-selected`       | This event is fired on the change of the grade for a `gradeType="LetterGrade"` grade. |
| `@d2l-grade-result-manual-override-clear-click` | This event is fired when the manual override clear is clicked. |


## Usage

```html
<script type="module">
    import '@d2l/labs-grade-result/d2l-grade-result.js';
</script>
<d2l-labs-d2l-grade-result href="href" token="token" disableAutoSave _hideTitle>My element</d2l-labs-d2l-grade-result>
```