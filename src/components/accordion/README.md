# d2l-labs-accordion

A Lit-based widget that displays a list of collapsible components. When a collapsible component is clicked, it expands or collapses the associated content.

## Usage

```html
<script type="module">
    import '@brightspace-ui/labs/components/accordion.js';
	import '@brightspace-ui/labs/components/accordion-collapse.js';
</script>
<d2l-labs-accordion>
	<d2l-labs-accordion-collapse></d2l-labs-accordion-collapse>
</d2l-labs-accordion>
```

## Lit components:
### **d2l-labs-accordion** - accordion panel.
#### Attributes:
* multi - allows multiple collapsibles to be opened at the same time
* selected - used only if `multi` is disabled. sets item index to be opened by default
* selectedValue - used only if `multi` is set. Sets array of indexes for the items to be opened by default
* autoClose - expanding any **d2l-labs-accordion-collapse** child (except those that are disabled) will automatically close other opened children.
### **d2l-labs-accordion-collapse** - accordion component.
#### Attributes:
* flex - adjust component to the parent width
* noIcons - hide the expand/collapse icon
* opened - container is opened by default. Do not use this attribute when inside the **d2l-labs-accordion** as the **d2l-labs-accordion** does not monitor opened state of the items at the start. In this case, use `selected` or `selectedValue` **d2l-labs-accordion** attributes instead.
* disabled - container cannot be expanded or collapsed
* disable-default-trigger-focus - disables the default outline added by browsers on trigger focus so custom styles can be added to the component on focus
* headerBorder - show a border between the header and the summary/content
* icon-has-padding - adds padding on one side of the icon.
  * When used with 'flex' attribute, the padding will be to the right. (Opposite for RTL)
  * Without 'flex' attribute, the padding will be on the left. (Opposite for RTL)
* header-has-interactive-content - adjusts the html to allow interactive (e.g. clickable) elements in the header to function properly
(especially with screen readers)
* screen-reader-header-text - text that is visually hidden and only used for a screen reader to read text
from the header

#### Slots:
* header - content to display under the title
* summary - content that summarizes the data inside the accordion

Example 1:
```html
<d2l-labs-accordion selected="1">
	<d2l-labs-accordion-collapse title="Item 1" flex>
		Text 1
	</d2l-labs-accordion-collapse>
	<d2l-labs-accordion-collapse title="Item 2" flex>
		Item 3
	</d2l-labs-accordion-collapse>
	<d2l-labs-accordion-collapse title="Item 3" flex>
		Text 3
	</d2l-labs-accordion-collapse>
</d2l-labs-accordion>
```

Example 2:
```html
<d2l-labs-accordion multi selectedValue="[1,2]">
	<d2l-labs-accordion-collapse title="Item 1" flex>
		Text 1
	</d2l-labs-accordion-collapse>
	<d2l-labs-accordion-collapse title="Item 2" flex>
		Item 3
	</d2l-labs-accordion-collapse>
	<d2l-labs-accordion-collapse title="Item 3" flex>
		Text 3
	</d2l-labs-accordion-collapse>
</d2l-labs-accordion>
```

Example 3:
```html
<d2l-labs-accordion-collapse title="Opened By Default (Flex)" opened flex>
	Text 1
</d2l-labs-accordion-collapse>
```

Example 4:
```html
<d2l-labs-accordion-collapse title="Opened By Default (Regular)" opened>
	Text 1
</d2l-labs-accordion-collapse>
```

Example 5:
```html
<d2l-labs-accordion-collapse flex header-border>
	<h2 slot="header">Custom header, summary, border and flex 💪</h2>
	<ul slot="summary" style="list-style-type: none; padding-left: 0px;">
		<li>Availability starts 4/13/2020 and ends 4/23/2020</li>
		<li>One release condition</li>
		<li>Special access</li>
	</ul>
	<p>Stuff inside of the accordion goes here</p>
</d2l-labs-accordion-collapse>
```

Example 6:
```html
<d2l-labs-accordion-collapse header-has-interactive-content screen-reader-header-text="Go to D2L">
	<span slot="header">
		Go to
		<a href="https://www.d2l.com/">D2L</a>
	</span>
</d2l-labs-accordion-collapse>
```