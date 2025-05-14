# @brightspace-ui/labs

[![NPM version](https://img.shields.io/npm/v/@brightspace-ui/labs.svg)](https://www.npmjs.org/package/@brightspace-ui/labs)

A collection of experimental web components and tools for building Brightspace applications.

## Installation

Install from NPM:

```shell
npm install @brightspace-ui/labs
```

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

# translations
npm run test:translations

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

To start a [@web/dev-server](https://modern-web.dev/docs/dev-server/overview/) that hosts the demo pages and tests:

```shell
npm start
```

D2L employees can also view the latest main-branch demos at https://live.d2l.dev/BrightspaceUI/labs/.

### Versioning and Releasing

This repo is configured to use `semantic-release`. Commits prefixed with `fix:` and `feat:` will trigger patch and minor releases when merged to `main`.

To learn how to create major releases and release from maintenance branches, refer to the [semantic-release GitHub Action](https://github.com/BrightspaceUI/actions/tree/main/semantic-release) documentation.
