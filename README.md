# d2l-grade-result

[![NPM version](https://img.shields.io/npm/v/@brightspace-ui-labs/grade-result.svg)](https://www.npmjs.org/package/@brightspace-ui-labs/grade-result)

> Note: this is a ["labs" component](https://github.com/BrightspaceUI/guide/wiki/Component-Tiers). While functional, these tasks are prerequisites to promotion to BrightspaceUI "official" status:
>
> - [x] [Design organization buy-in](https://github.com/BrightspaceUI/guide/wiki/Before-you-build#working-with-design) (refer to docs folder)
> - [ ] [design.d2l entry](http://design.d2l/)
> - [x] [Architectural sign-off](https://github.com/BrightspaceUI/guide/wiki/Before-you-build#web-component-architecture) ([Eric Knutson's Notes](https://desire2learn.atlassian.net/wiki/spaces/Nimbus/pages/949223655/Eric+s+thoughts+for+a+slicey+workflow+with+features+along+the+way))
> - [x] [Continuous integration](https://github.com/BrightspaceUI/guide/wiki/Testing#testing-continuously-with-travis-ci)
> - [ ] [Cross-browser testing](https://github.com/BrightspaceUI/guide/wiki/Testing#cross-browser-testing-with-sauce-labs)
> - [x] [Unit tests](https://github.com/BrightspaceUI/guide/wiki/Testing#testing-with-polymer-test) (if applicable)
> - [x] [Accessibility tests](https://github.com/BrightspaceUI/guide/wiki/Testing#automated-accessibility-testing-with-axe)
> - [x] [Visual diff tests](https://github.com/BrightspaceUI/visual-diff)
> - [x] [Localization](https://github.com/BrightspaceUI/guide/wiki/Localization) with Serge (if applicable)
> - [x] Demo page
> - [x] README documentation

A web component used for rendering grades in Brightspace

![demo screenshot](./docs/demo_screenshot.png)

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

#### d2l-labs-d2l-grade-result-presentational

| Property                          | GradeType      | Type                        | Default     | Description                                                  |
| ----------------------------------| -------------- | --------------------------- | ----------- | ------------------------------------------------------------ |
| `gradeType`                       | All            | `'Numeric' | 'LetterGrade'` | `'Numeric'` | Specifies the type of grade that the component is meant to render. |
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
| `isGradeAutoCompleted`            | All            | `boolean`                   | `false`     | Set to `true` if a grade has been automatically provided for the activity. This will show the 'Manually Override Grade' button. |
| `isManualOverrideActive`          | All            | `boolean`                   | `false`     | Set to `true` is the user is currently manually overriding the grade. This will change the text of the manual override button to 'Clear Manual Override'. |
| `hideTitle`                       | All            | `boolean`                   | `false`     | This property will hide the "Overall Grade" title above the component. |
| `customManualOverrideText`        | All            | `string`                    | `undefined` | This property will substitute the stock text on the "Manual Override" button. |
| `customManualOverrideClearText`   | All            | `string`                    | `undefined` | This property will substitute the stock text on the "Clear Manual Override" button. |
| `subtitleText`                    | All            | `string`                    | `undefined` | This property will show the given text under the title. |
| `validationError`                 | Numeric        | `string`                    | `undefined` | This property will force the grade input to display a validation error with the given text |

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
| `@d2l-grade-result-manual-override-click`       | This event is fired when the manual override button is clicked. |
| `@d2l-grade-result-manual-override-clear-click` | This event is fired when the manual override clear is clicked. |

#### d2l-labs-d2l-grade-result-presentational

| Event                                           | Description                                                  |
| ----------------------------------------------- | ------------------------------------------------------------ |
| `@d2l-grade-result-grade-button-click`          | This event is fired when the grades button is clicked.       |
| `@d2l-grade-result-reports-button-click`        | This event is fired when the reports button is clicked.      |
| `@d2l-grade-result-grade-change`                | This event is fired on the change of the grade for a `gradeType="Numeric"` grade. |
| `@d2l-grade-result-letter-score-selected`       | This event is fired on the change of the grade for a `gradeType="LetterGrade"` grade. |
| `@d2l-grade-result-manual-override-click`       | This event is fired when the manual override button is clicked. |
| `@d2l-grade-result-manual-override-clear-click` | This event is fired when the manual override clear is clicked. |

## Installation

To install from NPM:

```shell
npm install @brightspace-ui-labs/d2l-grade-result
```

## Usage

```html
<script type="module">
    import '@brightspace-ui-labs/d2l-grade-result/d2l-grade-result.js';
</script>
<d2l-labs-d2l-grade-result href="href" token="token" disableAutoSave _hideTitle>My element</d2l-labs-d2l-grade-result>
```

## Developing, Testing and Contributing

After cloning the repo, run `npm install` to install dependencies.

### Linting

```shell
# eslint and lit-analyzer
npm run lint

# eslint only
npm run lint:eslint
```

### Testing

```shell
# lint & run headless unit tests
npm test

# unit tests only
npm run test:headless

# debug or run a subset of local unit tests
npm run test:headless:watch
```

### Visual Diff Testing

This repo uses the [@brightspace-ui/visual-diff utility](https://github.com/BrightspaceUI/visual-diff/) to compare current snapshots against a set of golden snapshots stored in source control.

The golden snapshots in source control must be updated by the [visual-diff GitHub Action](https://github.com/BrightspaceUI/actions/tree/main/visual-diff).  If a pull request results in visual differences, a draft pull request with the new goldens will automatically be opened against its branch.

To run the tests locally to help troubleshoot or develop new tests, first install these dependencies:

```shell
npm install @brightspace-ui/visual-diff@X mocha@Y puppeteer@Z  --no-save
```

Replace `X`, `Y` and `Z` with [the current versions](https://github.com/BrightspaceUI/actions/tree/main/visual-diff#current-dependency-versions) the action is using.

Then run the tests:

```shell
# run visual-diff tests
npx mocha './test/**/*.visual-diff.js' -t 10000
# subset of visual-diff tests:
npx mocha './test/**/*.visual-diff.js' -t 10000 -g some-pattern
# update visual-diff goldens
npx mocha './test/**/*.visual-diff.js' -t 10000 --golden
```

### Running the demos

To start a [@web/dev-server](https://modern-web.dev/docs/dev-server/overview/) that hosts the demo page and tests:

```shell
npm start
```

## Versioning & Releasing

> TL;DR: Commits prefixed with `fix:` and `feat:` will trigger patch and minor releases when merged to `main`. Read on for more details...

The [semantic-release GitHub Action](https://github.com/BrightspaceUI/actions/tree/main/semantic-release) is called from the `release.yml` GitHub Action workflow to handle version changes and releasing.

### Version Changes

All version changes should obey [semantic versioning](https://semver.org/) rules:
1. **MAJOR** version when you make incompatible API changes,
2. **MINOR** version when you add functionality in a backwards compatible manner, and
3. **PATCH** version when you make backwards compatible bug fixes.

The next version number will be determined from the commit messages since the previous release. Our semantic-release configuration uses the [Angular convention](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular) when analyzing commits:
* Commits which are prefixed with `fix:` or `perf:` will trigger a `patch` release. Example: `fix: validate input before using`
* Commits which are prefixed with `feat:` will trigger a `minor` release. Example: `feat: add toggle() method`
* To trigger a MAJOR release, include `BREAKING CHANGE:` with a space or two newlines in the footer of the commit message.
* Other suggested prefixes which will **NOT** trigger a release: `build:`, `ci:`, `docs:`, `style:`, `refactor:` and `test:`. Example: `docs: adding README for new component`

To revert a change, add the `revert:` prefix to the original commit message. This will cause the reverted change to be omitted from the release notes. Example: `revert: fix: validate input before using`.

### Releases

When a release is triggered, it will:
* Update the version in `package.json`
* Tag the commit
* Create a GitHub release (including release notes)
* Deploy a new package to NPM

### Releasing from Maintenance Branches

Occasionally you'll want to backport a feature or bug fix to an older release. `semantic-release` refers to these as [maintenance branches](https://semantic-release.gitbook.io/semantic-release/usage/workflow-configuration#maintenance-branches).

Maintenance branch names should be of the form: `+([0-9])?(.{+([0-9]),x}).x`.

Regular expressions are complicated, but this essentially means branch names should look like:
* `1.15.x` for patch releases on top of the `1.15` release (after version `1.16` exists)
* `2.x` for feature releases on top of the `2` release (after version `3` exists)
