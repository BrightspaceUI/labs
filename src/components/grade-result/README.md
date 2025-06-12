# Grade Result

Components used for rendering grades in Brightspace.

## Presentation View [d2l-labs-grade-result-presentational]

<!-- docs: demo code -->
```html
<script type="module">
  import '@brightspace-ui/labs/components/grade-result/grade-result-presentational.js';
</script>
<d2l-labs-grade-result-presentational
  grade-type="Numeric"
  label-text="Overall Grade"
  label-heading-level="3"
  score-numerator="5"
  score-denominator="20"
  display-student-grade-preview
  student-grade-preview='{"score": 5, "symbol": "Fine", "colour": "#FFCC00"}'
></d2l-labs-grade-result-presentational>
```

<!-- docs: demo code -->
```html
<script type="module">
  import '@brightspace-ui/labs/components/grade-result/grade-result-presentational.js';
</script>
<d2l-labs-grade-result-presentational
  grade-type="LetterGrade"
  label-text="Overall Grade"
  letter-grade-options='{ "0": { "LetterGrade": "None", "PercentStart": null}, "1": { "LetterGrade": "A", "PercentStart": "75"}, "2": { "LetterGrade": "B", "PercentStart": "50"}}'
  selected-letter-grade="2"
  score-denominator="20"
  is-manual-override-active
  include-grade-button
  grade-button-tooltip="Assignment 1 Grade Item Attached"
  include-reports-button
  reports-button-tooltip="Class and user statistics"
  display-student-grade-preview
  student-grade-preview='{"score": 10, "symbol": "Very Good", "colour": "#00FFFF"}'
></d2l-labs-grade-result-presentational>
```

<!-- docs: start hidden content -->

### Properties

| Property                          | GradeType      | Type                        | Default     | Description                                                  |
| ----------------------------------| -------------- | --------------------------- | ----------- | ------------------------------------------------------------ |
| `grade-type`                       | All            | `string ('Numeric' or 'LetterGrade')` | `'Numeric'` | Specifies the type of grade that the component is meant to render. |
| `label-text`                       | All            | `string`                    | `''`        | The text that appears above the component.                   |
| `score-numerator`                  | Numeric        | `number`                    | `0`         | The numerator of the numeric score that is given.            |
| `score-denominator`                | Numeric        | `number`                    | `0`         | The denominator of the numeric score that is given.          |
| `selected-letter-grade`             | LetterGrade    | `string`                    | `''`        | The current selected letter grade of the options given.      |
| `letter-grade-options`              | LetterGrade    | `Object`                    | `null`      | A dictionary where the key is a unique id and the value is an object containing the LetterGrade text and the PercentStart. |
| `include-grade-button`              | All            | `boolean`                   | `false`     | Determines whether the grades icon button is rendered.       |
| `include-reports-button`            | All            | `boolean`                   | `false`     | Determines whether the reports icon button is rendered.      |
| `grade-button-tooltip`              | All            | `string`                    | `''`        | The text that is inside of the tooltip when hovering over the grades button. |
| `reports-button-tooltip`            | All            | `string`                    | `''`        | The text that is inside of the tooltip when hovering over the reports button. |
| `readonly`                        | All            | `boolean`                   | `false`     | Set to `true` if the user does not have permissions to edit the grade. |
| `is-manual-override-active`          | All            | `boolean`                   | `false`     | Set to `true` if the user is currently manually overriding the grade. This will display the button to 'Clear Manual Override'. |
| `hide-title`                       | All            | `boolean`                   | `false`     | This property will hide the "Overall Grade" title above the component. |
| `custom-manual-override-clear-text`   | All            | `string`                    | `undefined` | This property will substitute the stock text on the "Clear Manual Override" button. |
| `subtitle-text`                    | All            | `string`                    | `undefined` | This property will show the given text under the title. |
| `required`                 | Numeric        | `Boolean`                    | `false` | Set to `true` if an undefined/blank grade is not considered valid |
| `input-label-text`                 | Numeric        | `string`                    | `''` |  This property sets the label that will be used inside the aria-label and validation error tool-tips |
| `allow-negative-score`             | Numeric        | `boolean`                    | `'false'`   | Set to `true` if negative scores can be entered                         |
| `show-floored-score-warning`        | Numeric        | `boolean`                    | `'false'`   | Set to `true` if displaying a negative grade that has been floored at 0 |

### Events

| Event                                           | Description                                                  |
| ----------------------------------------------- | ------------------------------------------------------------ |
| `@d2l-grade-result-grade-button-click`          | This event is fired when the grades button is clicked.       |
| `@d2l-grade-result-reports-button-click`        | This event is fired when the reports button is clicked.      |
| `@d2l-grade-result-grade-change`                | This event is fired on the change of the grade for a `gradeType="Numeric"` grade. |
| `@d2l-grade-result-letter-score-selected`       | This event is fired on the change of the grade for a `gradeType="LetterGrade"` grade. |
| `@d2l-grade-result-manual-override-clear-click` | This event is fired when the manual override clear is clicked. |

<!-- docs: end hidden content -->

## Student Grade Preview [d2l-labs-grade-result-student-grade-preview]

<!-- docs: demo code -->
```html
<script type="module">
  import '@brightspace-ui/labs/components/grade-result/grade-result-student-grade-preview.js';
</script>
  <d2l-labs-grade-result-student-grade-preview
    out-of="10"
    student-grade-preview='{"score":10, "symbol":"Very Good", "colour":"#00FFFF"}'
  ></d2l-labs-grade-result-student-grade-preview>
```
