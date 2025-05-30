# Org Unit Filter

A Lit component that renders an org unit structure tree. It supports load more and searching functionality.

## Org Unit Filter [d2l-labs-ou-filter]

<!-- docs: demo align:flex-start autoSize:false size:xlarge -->
```html
<script type="module">
  import '@brightspace-ui/labs/demo/components/ou-filter/ouFilterDemoPage.js';
</script> 
<d2l-labs-oufilter-demo-page></d2l-labs-oufilter-demo-page>
```

### General Usage

```js
import { action, decorate, observable } from 'mobx';
import { MobxLitElement } from '@adobe/lit-mobx';
import { OuFilterDataManager } from '@brightspace-ui-labs/ou-filter/ou-filter.js';

class FooDataManager extends OuFilterDataManager {

	constructor() {
		super();
		this._orgUnitTree = new Tree({});
	}

	async loadData() {
		this._orgUnitTree = new Tree({ nodes: ..., ... });
	}
}

decorate(FooDataManager, {
	_orgUnitTree: observable,
	loadData: action
});

class FooPage extends MobxLitElement {
  constructor() {
    this.dataManager = new FooDataManager();
  }

  firstUpdated() {
    this.dataManager.loadData();
  }

  render () {
    return html`
      <d2l-labs-ou-filter
        .dataManager=${this.dataManager}
        select-all-ui
        @d2l-labs-ou-filter-change="${this._orgUnitFilterChange}"
      ></d2l-labs-ou-filter>`;
  }

  _orgUnitFilterChange() {
    console.log(event.target.selected);
  }
}
```

<!-- docs: start hidden content -->

**Properties:**

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| dataManager | Object | {empty} | Object that extends OuFilterDataManager. It provides and manages data for d2l-labs-ou-filter |
| select-all-ui | Boolean | {empty} | Shows Select all button |
| d2l-labs-ou-filter-change | Function | {empty} | Event handler that is fired when selection is changed |
| disabled | Boolean | {empty} | Render the filter in a disabled state |

<!-- docs: end hidden content -->
