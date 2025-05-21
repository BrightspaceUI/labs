# Grade Result

Components used for rendering grades in Brightspace.

## Presentation View [d2l-labs-grade-result-presentational]

<!-- docs: demo code -->
```html
<script type="module">
  import '@brightspace-ui/labs/components/grade-result/grade-result-presentational.js';
</script>
<d2l-labs-grade-result-presentational
  gradeType="Numeric"
  labelText="Overall Grade"
  labelHeadingLevel="3"
  scoreNumerator="5"
  scoreDenominator="20"
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
  gradeType="LetterGrade"
  labelText="Overall Grade"
  letterGradeOptions='{ "0": { "LetterGrade": "None", "PercentStart": null}, "1": { "LetterGrade": "A", "PercentStart": "75"}, "2": { "LetterGrade": "B", "PercentStart": "50"}}'
  selectedLetterGrade="2"
  scoreDenominator="20"
  isManualOverrideActive
  includeGradeButton
  gradeButtonTooltip="Assignment 1 Grade Item Attached"
  includeReportsButton
  reportsButtonTooltip="Class and user statistics"
  display-student-grade-preview
  student-grade-preview='{"score": 10, "symbol": "Very Good", "colour": "#00FFFF"}'
></d2l-labs-grade-result-presentational>
```

<!-- docs: start hidden content -->

### Properties

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
