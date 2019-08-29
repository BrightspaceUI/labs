# d2l-accordion

Polymer-based widget that displays a list of collapsible components. When collapsible component is clicked - it expands or collapses the associated content.

Polymer components:
1. **d2l-accordion** - accordion panel. Attributes:
* multi - allows multiple collapsibles to be opened at the same time
* selected - used only if `multi` is disabled. sets item index to be opened by default
* selectedValue - used only if `multi` is set. Sets array of indexes for the items to be opened by default
* autoClose - expanding any **d2l-accordion-collapse** child (except those that are disabled) will automatically close other opened children.
2. **d2l-accordion-collapse** - accordion component. Attributes:
* flex - adjust component to the parent width
* noIcons - hide the expand/collapse icon
* opened - container is opened by default. Do not use this attribute when inside the **d2l-accordion** as the **d2l-accordion** does not monitor opened state of the items at the start. In this case, use `selected` or `selectedValue` **d2l-accordion** attributes instead.
* disabled - container cannot be expanded or collapsed

Example 1:
```html
<d2l-accordion selected="1">
	<d2l-accordion-collapse title="Item 1" flex>
		Text 1
	</d2l-accordion-collapse>
	<d2l-accordion-collapse title="Item 2" flex>
		Item 3
	</d2l-accordion-collapse>
	<d2l-accordion-collapse title="Item 3" flex>
		Text 3
	</d2l-accordion-collapse>
</d2l-accordion>
```

Example 2:
```html
<d2l-accordion multi selectedValue="[1,2]">
	<d2l-accordion-collapse title="Item 1" flex>
		Text 1
	</d2l-accordion-collapse>
	<d2l-accordion-collapse title="Item 2" flex>
		Item 3
	</d2l-accordion-collapse>
	<d2l-accordion-collapse title="Item 3" flex>
		Text 3
	</d2l-accordion-collapse>
</d2l-accordion>
```

Example 3:
```html
<d2l-accordion-collapse title="Opened By Default (Flex)" opened flex>
	Text 1
</d2l-accordion-collapse>
```

Example 4:
```html
<d2l-accordion-collapse title="Opened By Default (Regular)" opened>
	Text 1
</d2l-accordion-collapse>
```

## Versioning & Releasing

All version changes should obey [semantic versioning](https://semver.org/) rules.

Include either `[increment major]`, `[increment minor]` or `[increment patch]` in your merge commit message to automatically increment the `package.json` version and create a tag during the next build.
