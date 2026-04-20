import { css, html, LitElement, nothing } from 'lit';
import { getFocusRingStyles } from '@brightspace-ui/core/helpers/focus.js';
import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize/localize-mixin.js';
import { PropertyRequiredMixin } from '@brightspace-ui/core/mixins/property-required/property-required-mixin.js';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin.js';

/**
 * A 2-D accessible grid with author-defined spanning cells.
 *
 * Architecture: authored <d2l-accessible-grid-cell> elements are pure data
 * carriers. This host reads their geometry from the light DOM, computes
 * reading order, and renders ALL chrome (role="row" wrappers, role="gridcell"
 * boxes, ARIA, drag handles, move-menu buttons) in its own shadow DOM.
 * Cell content is projected into its rendered position via named slots.
 *
 * @fires d2l-accessible-grid-move - Fired when a cell is moved (cancelable).
 */
class AccessibleGrid extends LocalizeMixin(SkeletonMixin(PropertyRequiredMixin(LitElement))) {

	static get properties() {
		return {
			/** Number of columns in the grid. */
			cols: { type: Number, reflect: true },
			/** When present, enables drag/drop, keyboard reorder, and Move menu. */
			editable: { type: Boolean, reflect: true },
			/** Accessible label for the grid (required). */
			label: { type: String, required: true },
			/** Number of rows in the grid. */
			rows: { type: Number, reflect: true },
			/** Internal array of cell descriptors built from slotted children. */
			_cells: { state: true },
		};
	}

	static get styles() {
		return [
			css`
:host {
	display: block;
}
:host([hidden]) {
	display: none;
}
.grid {
	box-sizing: border-box;
	display: grid;
	gap: var(--d2l-accessible-grid-gap, 0.6rem);
	width: 100%;
}
[role="row"] {
	display: contents;
}
.cell {
	background: var(--d2l-accessible-grid-cell-background, var(--d2l-color-sylvite));
	border-radius: var(--d2l-accessible-grid-cell-border-radius, 0.3rem);
	box-sizing: border-box;
	min-height: 0;
	min-width: 0;
	overflow: hidden;
	padding: var(--d2l-accessible-grid-cell-padding, 0.75rem);
}
.slot-observer {
	display: none;
}
`,
			getFocusRingStyles('.cell:focus-visible'),
		];
	}

	constructor() {
		super();
		this.cols = 0;
		this.editable = false;
		this.rows = 0;
		this._cells = [];
		/** @type {string|null} Key of the cell that owns roving tabindex focus. */
		this._activeCellKey = null;
		/** @type {{key:string,originX:number,originY:number}|null} Active keyboard-grab state. */
		this._grabbed = null;
		/** @type {Object|null} Snapshot for single-level undo. */
		this._lastMove = null;
		this._mutationObservers = new Map();
	}

	static get localizeConfig() {
		return {
			importFunc: async lang => (await import(`../../lang/${lang}.js`)).default,
		};
	}

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener('d2l-accessible-grid-cell-connected', this.#handleCellLifecycle);
		this.addEventListener('d2l-accessible-grid-cell-disconnected', this.#handleCellLifecycle);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.removeEventListener('d2l-accessible-grid-cell-connected', this.#handleCellLifecycle);
		this.removeEventListener('d2l-accessible-grid-cell-disconnected', this.#handleCellLifecycle);
		this.#disconnectMutationObservers();
	}

	render() {
		// Group cells by anchor-y for role="row" wrappers (simple sort for Phase 1;
		// full reading-order computation is added in Phase 3).
		const rowMap = new Map();
		for (const cell of this._cells) {
			if (!rowMap.has(cell.y)) rowMap.set(cell.y, []);
			rowMap.get(cell.y).push(cell);
		}
		const sortedYs = [...rowMap.keys()].sort((a, b) => a - b);

		return html`
<div
aria-colcount="${this.cols > 0 ? this.cols : nothing}"
aria-label="${this.label}"
aria-rowcount="${this.rows > 0 ? this.rows : nothing}"
class="grid"
part="grid"
role="grid"
style="grid-template-columns:repeat(${this.cols},minmax(0,1fr));grid-template-rows:repeat(${this.rows},minmax(var(--d2l-accessible-grid-min-row-height,4rem),auto));"
>
${sortedYs.map(y => {
	const rowCells = rowMap.get(y).sort((a, b) => a.x - b.x);
	return html`
<div role="row">
${rowCells.map(cell => html`
<div
aria-colindex="${cell.x + 1}"
aria-colspan="${cell.width > 1 ? cell.width : nothing}"
aria-rowindex="${cell.y + 1}"
aria-rowspan="${cell.height > 1 ? cell.height : nothing}"
class="cell"
part="cell"
role="gridcell"
style="grid-column:${cell.x + 1} / span ${cell.width};grid-row:${cell.y + 1} / span ${cell.height};"
tabindex="${this._activeCellKey === cell.key ? '0' : '-1'}"
>
<slot name="cell-${cell.key}"></slot>
</div>
`)}
</div>
`;
})}
</div>
<div class="slot-observer">
<slot @slotchange="${this.#handleSlotChange}"></slot>
</div>
`;
	}

	#describeCellElement(el) {
		return {
			key: this.#getCellKey(el),
			x: Number(el.getAttribute('x') ?? el.x ?? 0),
			y: Number(el.getAttribute('y') ?? el.y ?? 0),
			width: Number(el.getAttribute('width') ?? el.width ?? 1),
			height: Number(el.getAttribute('height') ?? el.height ?? 1),
			label: el.getAttribute('label') ?? el.label ?? '',
			element: el,
		};
	}

	#disconnectMutationObservers() {
		for (const obs of this._mutationObservers.values()) {
			obs.disconnect();
		}
		this._mutationObservers.clear();
	}

	#getCellKey(el) {
		return el.getAttribute('cell-key') || el.cellKey || el._autoKey || (el._autoKey = `cell-${Math.random().toString(36).slice(2)}`);
	}

	#handleCellLifecycle() {
		this.#rebuildCells();
	}

	#handleSlotChange() {
		this.#rebuildCells();
	}

	/**
 * Reads authored cells directly from this.children (not slot.assignedElements)
 * so that repeated slotchange firings after slot reassignment are idempotent.
 */
	#rebuildCells() {
		const cells = [...this.children].filter(el => el.tagName === 'D2L-ACCESSIBLE-GRID-CELL');

		// Disconnect observers for removed cells
		const newKeys = new Set(cells.map(c => this.#getCellKey(c)));
		for (const [key, obs] of this._mutationObservers) {
			if (!newKeys.has(key)) {
				obs.disconnect();
				this._mutationObservers.delete(key);
			}
		}

		// Assign named slots and attach observers for new cells
		for (const cell of cells) {
			const key = this.#getCellKey(cell);
			const slotName = `cell-${key}`;
			if (cell.slot !== slotName) cell.slot = slotName;

			if (!this._mutationObservers.has(key)) {
				const obs = new MutationObserver(() => this.#rebuildCells());
				obs.observe(cell, { attributeFilter: ['x', 'y', 'width', 'height', 'label', 'cell-key'] });
				this._mutationObservers.set(key, obs);
			}
		}

		this._cells = cells.map(el => this.#describeCellElement(el));
		this.#validateLayout();
	}

	#validateLayout() {
		if (!this._cells.length) return;

		// Overflow check
		if (this.cols > 0 || this.rows > 0) {
			for (const cell of this._cells) {
				if (this.cols > 0 && (cell.x + cell.width) > this.cols) {
					console.warn(`d2l-accessible-grid: cell "${cell.label || cell.key}" overflows cols (x=${cell.x}, width=${cell.width}, cols=${this.cols})`);
				}
				if (this.rows > 0 && (cell.y + cell.height) > this.rows) {
					console.warn(`d2l-accessible-grid: cell "${cell.label || cell.key}" overflows rows (y=${cell.y}, height=${cell.height}, rows=${this.rows})`);
				}
			}
		}

		// Collision check -- DOM source order wins
		const occupancy = new Map();
		for (const cell of this._cells) {
			let hasCollision = false;
			for (let r = cell.y; r < cell.y + cell.height; r++) {
				for (let c = cell.x; c < cell.x + cell.width; c++) {
					const gridSlot = `${r},${c}`;
					if (occupancy.has(gridSlot)) {
						const winner = occupancy.get(gridSlot);
						if (!hasCollision) {
							console.warn(`d2l-accessible-grid: cell "${cell.label || cell.key}" collides with "${winner}" at row ${r}, col ${c}. The later cell will be hidden.`);
							hasCollision = true;
						}
						cell.element.setAttribute('aria-hidden', 'true');
						cell.element.style.visibility = 'hidden';
					} else {
						occupancy.set(gridSlot, cell.label || cell.key);
					}
				}
			}
		}
	}

}

customElements.define('d2l-accessible-grid', AccessibleGrid);
