# @brightspace-ui/accessible-grid

[![NPM version](https://img.shields.io/npm/v/@brightspace-ui/accessible-grid.svg)](https://www.npmjs.org/package/@brightspace-ui/accessible-grid)

Scannable and Editable grids for Brightspace

## Installation

Install from NPM:

```shell
npm install @brightspace-ui/accessible-grid
```

## Usage

```html
<script type="module">
    import '@brightspace-ui/accessible-grid/accessible-grid.js';
</script>
<d2l-accessible-grid>My element</d2l-accessible-grid>
```

**Properties:**

| Property | Type | Description |
|--|--|--|
| | | |

**Accessibility:**

To make your usage of `d2l-accessible-grid` accessible, use the following properties when applicable:

| Attribute | Description |
|--|--|
| | |

## Developing and Contributing

After cloning the repo, run `npm install` to install dependencies.

### Testing

To run the full suite of tests:

```shell
npm test
```

Alternatively, tests can be selectively run:

```shell
# eslint
npm run lint:eslint

# stylelint
npm run lint:style

# accessibility tests
npm run test:axe

# unit tests
npm run test:unit
```

This repo uses [@brightspace-ui/testing](https://github.com/BrightspaceUI/testing)'s vdiff command to perform visual regression testing:

```shell
# vdiff
npm run test:vdiff

# re-generate goldens
npm run test:vdiff golden
```

### Running the demos

To start a [@web/dev-server](https://modern-web.dev/docs/dev-server/overview/) that hosts the demo page and tests:

```shell
npm start
```

### Versioning and Releasing

This repo is configured to use `semantic-release`. Commits prefixed with `fix:` and `feat:` will trigger patch and minor releases when merged to `main`.

To learn how to create major releases and release from maintenance branches, refer to the [semantic-release GitHub Action](https://github.com/BrightspaceUI/actions/tree/main/semantic-release) documentation.
