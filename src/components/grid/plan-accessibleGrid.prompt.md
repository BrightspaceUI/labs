# Plan: Accessible Grid Component (`d2l-accessible-grid`)

Build a Brightspace Daylight LitElement component that exposes a 2-D grid with author-defined spanning cells (`<d2l-accessible-grid-cell x y width height>`), a screen-reader-legible DOM reading order derived from cell positions, and an optional editing mode with three coordinated affordances: pointer drag/drop, keyboard-driven reorder, and a per-cell "Move" menu (the WCAG 2.5.7 single-pointer alternative). Rendering and announcements follow BrightspaceUI/core conventions (`LocalizeCoreElement`, `helpers/announce.js`, `helpers/focus.js`, `list-item-drag-handle` state machine, typography + semantic color tokens). Collisions are resolved with row-major re-packing using the computed reading order, and one level of undo is exposed via toast + `Ctrl+Z`.

**This is a real visual grid.** "Accessible" modifies "grid" — it doesn't replace it. The component must render a working **CSS Grid layout** where cells visually occupy the positions declared by their `x`, `y`, `width`, `height` properties. A cell with `x=2 y=1 width=2 height=1` must visually appear anchored at column 3, row 2, spanning two columns. The accessibility work (reading-order reordering of rendered DOM, ARIA, keyboard/DnD/move-menu editing) sits **on top of** that visual layout; it does not substitute for it. Implementations that render cells without CSS Grid positioning (e.g. just a vertical stack in reading order) are incorrect. See Phase 3.5 for the specific CSS contract.

**Architecture — model/view split (mirrors `d2l-filter` / `d2l-filter-dimension-set` / `d2l-filter-dimension-set-value`):** authored `<d2l-accessible-grid-cell>` elements are **pure data carriers** — they expose properties (`x`, `y`, `width`, `height`, `label`, `key`) and lifecycle events but render no visible chrome. The host `<d2l-accessible-grid>` reads slotted cells as a model, computes reading order, and renders **all chrome itself** in a single Lit template: `role="row"` wrappers, `role="gridcell"` boxes, ARIA attributes, roving tabindex, drag handles, and move-menu buttons. The only thing projected from the authored cell into its rendered position is its **content**, via a named slot (`<slot name="cell-${key}">`) — unavoidable because cells hold arbitrary user DOM (unlike filter values, which are text-only). This keeps rendered DOM in one place, lets authors declare cells in any source order, and avoids coordinating state between parent and per-cell shadow DOMs.

---

## Phase 0 — Demo environment setup (QA harness)

Set up a working demo environment so that Nick Hallman can QA each phase incrementally using the local dev server.

1. Verify `npm install` has been run and all dependencies are resolved.
2. Ensure `npm start` launches the `@web/dev-server` at `demo/index.html` with `--node-resolve --open --watch` (already configured in `package.json`).
3. Expand `demo/index.html` with clearly labelled placeholder sections for each planned demo variant. Each section should have a heading and a `<d2l-demo-snippet>` ready to be filled in by later phases:
   - **Static grid (Z layout)** — scannable, no editing; uniform 1×1 cells read left→right, top→bottom.
   - **Static grid (N layout)** — scannable, no editing; includes a multi-row spanning cell that creates column groups, demonstrating the N reading order.
   - **Editable grid** — dashboard-style with spanning cells and `editable` attribute.
   - **RTL grid** — `dir="rtl"` to exercise mirrored horizontal reading direction (orthogonal to Z/N).
   - **Collision demo** — intentional overlap to verify warning behaviour and hidden-cell styling.
4. Add a short "QA checklist" HTML comment at the top of `demo/index.html` listing the manual checks to perform per phase (keyboard navigation, screen-reader announcements, visual layout, move menu, undo).
5. Confirm `npm start` serves the page without errors and hot-reloads on file changes so agents' work is immediately visible in the browser.

**QA workflow:** After each subsequent phase, run `npm start`, open the demo in a browser, and verify the new functionality against the corresponding demo section. Use NVDA+Firefox and/or VoiceOver+Safari for accessibility spot-checks.

## Phase 1 — Scaffolding & host element

1. Replace the placeholder `accessible-grid.js` with two modules: `accessible-grid.js` (re-exports) and `components/accessible-grid/accessible-grid.js` + `components/accessible-grid/accessible-grid-cell.js`. Keep the root entry so `import '@brightspace-ui/accessible-grid/accessible-grid.js'` still works.
2. `AccessibleGrid extends LocalizeCoreElement(SkeletonMixin(LitElement))` (adding `ArrowKeysMixin` is ruled out — grid-specific 2D navigation is simpler to roll inline, mirroring `d2l-list` `_handleKeyDown`).
3. Properties:
   - `rows:Number`, `cols:Number` (attributes, reflected). `rows`/`cols` default `0`; surface a dev-console warning if any cell overflows.
   - `editable:Boolean`, reflected — gates DnD, keyboard reorder mode, move menu.
   - `dir` attribute (inherited or explicit) controls horizontal direction (`ltr` vs `rtl`). Z-vs-N reading order is always computed automatically from cell geometry — no author override needed.
   - Private `_cells:Array` (`state:true`) — computed from slot.
   - Private `_activeCellKey:String` — for roving tabindex & focus restoration.
   - Private `_grabbed:Object|null` — `{ key, originX, originY }` during keyboard drag.
   - Private `_lastMove:Object|null` — single-level undo snapshot.
4. ARIA: host renders `role="grid"`, `aria-rowcount`, `aria-colcount`, `aria-label` (required prop via `PropertyRequiredMixin`). Internally, template groups cells into `<div role="row">` wrappers for semantic rowness even though rendering uses CSS grid positioning.
5. **Visual layout contract:** the host's shadow DOM uses **CSS Grid** as its layout primitive. The outer container (or an inner wrapper containing all rendered rows/cells) must declare `display: grid; grid-template-columns: repeat(var(--_cols, attr(cols)), 1fr); grid-template-rows: repeat(var(--_rows), minmax(0, auto));` (or equivalent). `role="row"` wrappers use `display: contents` so that gridcell children participate directly in the host's grid (ARIA rowness is preserved, but the CSS grid is flat so `grid-column`/`grid-row` on cells works as authored). Exposed customization tokens: `--d2l-accessible-grid-gap` (default `0.6rem`, maps to `gap`), `--d2l-accessible-grid-min-row-height` (default `auto`), `--d2l-accessible-grid-cell-background`, `--d2l-accessible-grid-cell-border-radius`, `--d2l-accessible-grid-cell-padding`.
6. Demo page (`demo/index.html`) gets snippets per Phase 0: Z layout, N layout, editable, RTL, collision.

## Phase 2 — Cell element (data-only model carrier)

The cell is a near-empty custom element whose sole job is to expose author-facing properties and notify the host on lifecycle/change. It owns no ARIA, no focus, no drag-handle markup, and no visible styling — all of that is rendered by the host (Phase 3).

1. `AccessibleGridCell extends LocalizeCoreElement(LitElement)`. **No `FocusMixin`** — focus lives on host-rendered nodes.
2. Properties: `x:Number`, `y:Number`, `width:Number` (default 1), `height:Number` (default 1), `label:String` (required via `PropertyRequiredMixin` — announced at pickup), `key:String` (optional stable identifier; defaults to an autogenerated id — used for focus restoration and for the content-slot name).
3. Styles: `:host { display: contents; }`. The host renders the positioned gridcell box; the authored element itself contributes no layout. (`display:contents` lets the authored element be picked up by `assignedElements` without itself taking up grid space.)
4. Render: `render() { return html`<slot></slot>`; }` — a plain default slot so authored child content is visible in the light DOM tree for `assignedElements` traversal. The host's template will project that content into the rendered gridcell via a named slot (see Phase 3.4).
5. No ARIA attributes on the cell element itself — role/rowindex/colindex/rowspan/colspan live on the host-rendered `role="gridcell"` div.
6. Dispatches internal `d2l-accessible-grid-cell-connected` / `-disconnected` events on `connectedCallback`/`disconnectedCallback`, and `d2l-accessible-grid-cell-changed` via `updated()` when any observed property changes. The host listens for these to rebuild `_cells`. (MutationObserver from Phase 3 is a belt-and-braces fallback for attribute mutations that bypass Lit's reactivity.)

## Phase 3 — Slot observation, validation, layout

1. Host's single `<slot @slotchange>` invokes `_rebuildCells()`:
   - Filter via `tagName === 'D2L-ACCESSIBLE-GRID-CELL'` using `assignedElements({ flatten:true })` (mirrors `list.js`).
   - Attach a `MutationObserver` to each cell (filter: `x`,`y`,`width`,`height`,`label`,`key`) so geometry edits propagate — same pattern as `overflow-group-mixin`.
2. `_validateLayout()` runs after every rebuild:
   - Flag overflow (`x+width > cols || y+height > rows`).
   - Detect pairwise collisions using a sparse occupancy `Map<"r,c", firstCellKey>`. First cell in **DOM source order** wins; later intersecting cells are marked `_hiddenDueToCollision = true`, hidden with `visibility:hidden` + `aria-hidden="true"`, and their overlap is logged via `console.warn` (single message, one warning per offending cell, includes their keys/labels and which cell they collide with).
3. `_computeReadingOrder()` produces the DOM reading order. The algorithm works in **row bands** — a single grid can contain a mix of Z-ordered and N-ordered regions. The key trigger for N order is `height > 1` (multi-row span); cell `width` does not affect Z-vs-N — wide single-row cells still follow Z order.

   **Algorithm — row-band decomposition:**
   1. Collect all unique row boundaries from cell anchors and their vertical extents (`y` and `y + height`). These boundaries partition the grid into **row bands** — contiguous row ranges where the set of multi-row cells is stable.
   2. For each row band:
      - If **no cell spans the full height of this band** (all cells within it have `height ≤ band height` and no cell anchored above extends into it), the band follows **Z order**: sort cells by anchor `y` then anchor `x` (left→right, top→bottom).
      - If **one or more cells span the full height of this band** (`height > 1` reaching from the band's top to its bottom), those tall cells act as **column-group dividers**. Partition the band's columns into groups separated by the tall cells' column ranges. Within each column group, cells are read top→bottom, then left→right within a row. The tall cell itself is read as a single unit in its column group's position. Column groups are read left→right. This produces the **N order** for the band.
   3. Concatenate the reading orders of all bands top→bottom to produce the final sequence.

   **Z example** (variable-width cells, all `height=1`):
   ```
   A(x=0, y=0, w=2)  B(x=2, y=0, w=1)
   C(x=0, y=1, w=1)  D(x=1, y=1, w=2)
   ```
   One band (rows 0–1), no multi-row cells → Z order: A, B, C, D.

   **N example** (single band with a tall cell):
   ```
   A(x=0, y=0)  B(x=1, y=0, h=2)  C(x=2, y=0)
   D(x=0, y=1)                      E(x=2, y=1)
   ```
   One band (rows 0–1). B spans the full band → column groups: {col 0}, {col 1 = B}, {col 2}. Reading order: A, D, B, C, E.

   **Mixed example** (two N bands stacked):
   ```
   cell_1(x=0, y=0)       cell_3(x=2, y=0, h=2)
   cell_2(x=0, y=1)
   cell_4(x=0, y=2, h=2)  cell_5(x=2, y=2)
                            cell_6(x=2, y=3)
   ```
   Band 1 (rows 0–1): cell_3 spans full band → groups {cols 0–1}, {col 2 = cell_3}. Order: cell_1, cell_2, cell_3.
   Band 2 (rows 2–3): cell_4 spans full band → groups {col 0 = cell_4}, {cols 2–3}. Order: cell_4, cell_5, cell_6.
   Final: cell_1, cell_2, cell_3, cell_4, cell_5, cell_6.

   **RTL mirroring** (orthogonal to Z/N): when host `dir="rtl"`, the horizontal axis is flipped — column groups are read right→left, and cells within a row are read right→left. This applies to both Z and N bands independently.
4. DOM ordering: `render()` iterates `_cells` in reading order and emits the full rendered tree from the host's shadow DOM:
   - One `<div role="row">` wrapper per unique anchor-`y` band.
   - Inside each row, one `<div role="gridcell" aria-rowindex=… aria-colindex=… aria-rowspan=… aria-colspan=… aria-roledescription=… tabindex=… style="grid-column/-row: …">` per cell in reading order.
   - Inside each gridcell, the host template renders the cell's **chrome** (drag-handle button and move-menu button, gated on `editable`) plus a `<slot name="cell-${key}">` that projects the authored cell's light-DOM content into position.
   - On `_rebuildCells()`, the host assigns `slot="cell-${key}"` to each authored `<d2l-accessible-grid-cell>` so its light-DOM children project into the correct rendered gridcell regardless of source order. The authored element itself is `display:contents` and contributes no visible box.
5. Roving tabindex and focus management target the host-rendered `role="gridcell"` divs (indexed by `key`), not the authored elements. Host `keydown` drives arrow/Home/End/PageUp/PageDown navigation in 2D (arrows move to the nearest cell by reading-order adjacency).
6. Consumer-attached listeners on `<d2l-accessible-grid-cell>` still work via event bubbling, but `event.target` will be the host-rendered node — documented gotcha in the README.

### Phase 3.5 — Visual CSS Grid layout (non-negotiable)

The host template's layout is a real **CSS Grid**. Every rendered gridcell must visually appear at the column/row anchor declared by its properties, with the declared span, regardless of its position in the reading-order-sorted DOM.

1. **Host shadow DOM structure** (simplified):
   ```html
   <div class="grid" part="grid" role="grid" aria-label=… aria-rowcount=… aria-colcount=…>
     <div role="row"> <!-- one per unique anchor-y; display:contents -->
       <div role="gridcell" class="cell" part="cell"
            style="grid-column: ${x+1} / span ${width}; grid-row: ${y+1} / span ${height};"
            aria-rowindex=… aria-colindex=… aria-rowspan=… aria-colspan=…
            aria-roledescription=… tabindex=…>
         <!-- chrome: drag-handle button, move-menu button (when editable) -->
         <slot name="cell-${key}"></slot>
       </div>
       …
     </div>
     …
   </div>
   ```
2. **Required CSS on `.grid`:**
   ```css
   .grid {
     display: grid;
     grid-template-columns: repeat(var(--_cols), minmax(0, 1fr));
     grid-template-rows: repeat(var(--_rows), minmax(var(--d2l-accessible-grid-min-row-height, 4rem), auto));
     gap: var(--d2l-accessible-grid-gap, 0.6rem);
     width: 100%;
     box-sizing: border-box;
   }
   [role="row"] { display: contents; }
   ```
   `--_cols` and `--_rows` are set on the host from the `cols`/`rows` properties (via inline `style` in `render()` or a `styleMap`), so Lit drives them reactively.
3. **Required CSS on `.cell`:** cells must use `grid-column` / `grid-row` shorthand (inline style, computed from `x`/`y`/`width`/`height`) — **not** `transform`, **not** absolute positioning, **not** flex. They should have a visible default surface (background, border-radius, padding) via the exposed custom properties so that a stock demo with empty cells still shows a recognizable grid.
4. **RTL** works automatically because CSS Grid flips `grid-column` numbering when `direction: rtl`. The reading-order algorithm's RTL mirroring (Phase 3.3) only affects the **DOM emission order** within each row band; the visual columns flip via CSS direction. Host sets `direction: rtl` on `.grid` when `this.dir === 'rtl'` (or inherits).
5. **`display: contents` on authored cells:** because the authored `<d2l-accessible-grid-cell>` is `display:contents`, and its children are projected into the host's rendered gridcell via `slot="cell-${key}"`, the authored element itself never affects layout. This is essential — otherwise authored cells would stack in source order outside the grid.
6. **Hidden-by-collision cells** (Phase 3.2): still rendered in the grid with `visibility: hidden` so they occupy their grid track (prevents layout shift), but `aria-hidden="true"` keeps them out of the a11y tree.
7. **Overflow/overflow-anchor and min sizing:** cells should `min-width: 0; min-height: 0; overflow: hidden;` by default to prevent intrinsic content from blowing out tracks — a classic CSS Grid gotcha.
8. **Demo CSS expectations:** every `demo/index.html` snippet must visually show a bounded, multi-column grid with clearly differentiated cells. A reviewer loading `npm start` must see a grid, not a vertical list. If cells appear stacked, layout is broken — do not proceed.

## Phase 4 — Announcement plumbing & localization

1. Use `announce()` from `@brightspace-ui/core/helpers/announce.js` for all AT messaging; no local live region (consistent with core).
2. Add keys under `lang/en.js` namespace `components.accessible-grid.*`:
   - `panel` (for `aria-roledescription`)
   - `pickedUp`, `droppedAt`, `cancelled`, `edgeOfGrid`
   - `invalidPosition`, `validPositions` (count at pickup)
   - `displacedSummary` (ICU plural)
   - `undoHint`, `undoPerformed`
   - `moveMenu.label`, `moveMenu.upLabel`, `moveMenu.downLabel`, `moveMenu.leftLabel`, `moveMenu.rightLabel`, `moveMenu.toPosition`
   - `dragHandle.label`, `dragHandle.keyboardInstructions`
3. Duplicate English keys into all 20 locale files in `lang/` with English fallback values (translations are handled by serge).

## Phase 5 — Editing: pointer drag/drop

1. HTML5 DnD on the **host-rendered gridcell div** (and/or drag-handle button) when `editable` — `draggable="true"` applied in the host template, `dragstart`/`dragover`/`drop` listeners bound once at the host level (no per-cell handlers).
   *(Note: DnD lives on host-rendered nodes, not the authored `<d2l-accessible-grid-cell>`. Consumers attaching `dragstart` directly to the authored element will not receive the event — documented in README.)*
2. During drag, compute hovered anchor cell via pointer→grid-coordinate math; render translucent **preview ghost** (inline-styled `<div>` overlaid via CSS grid) at the snapped anchor.
3. `DataTransfer` payload carries `cellKey` as `text/plain`; validate that the drag originated from this grid (`e.dataTransfer.types` includes a custom MIME `application/x-d2l-grid-cell`).
4. Honor `@media (prefers-reduced-motion: reduce)` — disable FLIP transitions on displaced cells.
5. On drop, invoke `_commitMove()` (Phase 7).

## Phase 6 — Editing: keyboard reorder state machine

1. Mirror `list-item-drag-handle` keybindings but in 2D:
   - `Enter`/`Space` on focused cell (or its drag-handle) → **pickup**. Grid enters grabbed mode; announce `pickedUp` (label, current anchor, span, count of valid anchors).
   - Arrow keys → move ghost one cell; clamp to the **valid anchor set** (`x+w ≤ cols && y+h ≤ rows`, excluding occupied-by-immovable cells). Announce `"row {r}, column {c}"`; edge hit announces `edgeOfGrid`.
   - `Home`/`End` → jump to first/last valid anchor in current row.
   - `PageUp`/`PageDown` → ±5 rows (d2l-list convention), clamped to valid set.
   - `Enter`/`Space` → commit (calls `_commitMove`).
   - `Escape` → cancel, restore original position, announce `cancelled`.
   - `Tab` → treated as commit + allow natural focus progression (trap is hostile; commit is closer to d2l-list's "save" on Tab).
2. Debounce announcements via `setTimeout(150ms)` so rapid arrow presses coalesce (per research).
3. On commit/cancel, restore focus to the moved cell's drag-handle via stored `key` — elements may have re-projected slots so focus by key not DOM reference.

## Phase 7 — Editing: Move menu (WCAG 2.5.7 alternative)

1. The host template (not the cell) renders a `<d2l-button-icon>` ("more") inside each gridcell when `editable`, opening a `<d2l-menu>` with items:
   - Move up / down / left / right (disabled when clamped out of valid anchors).
   - "Move to position…" → opens a small modal (use `<d2l-dialog>`) with numeric row/col inputs; validates anchor + span fit; commits on Submit.
2. Menu items call the same `_commitMove(cellKey, newX, newY)` used by DnD and keyboard — single code path.
3. Menu is fully click-reachable on touch (satisfies 2.5.7).

## Phase 8 — Displacement algorithm & undo

1. `_commitMove(cellKey, newX, newY)`:
   - Snapshot current positions (deep-copy) → `_lastMove`.
   - Linearize remaining cells in the current reading order (skipping the moved cell).
   - Place the moved cell at `(newX, newY)`.
   - For each remaining cell (in reading order), re-anchor to the next row-major free slot big enough for its span; push to subsequent rows as needed. If the grid is full, log a warning and refuse the move (revert snapshot).
   - Apply new positions, emit `d2l-accessible-grid-move` event (detail: `{ movedKey, from, to, displaced:[{key, from, to}] }`). Event is cancelable — consumer can `preventDefault()` to keep authoritative state.
   - Announce via `announce()`: label + new position + displaced count (`displacedSummary`) + `undoHint`. Show toast via `<d2l-alert-toast>` with "Undo" action and `Ctrl+Z` binding active while toast is visible.
2. `_undo()`: swap `_lastMove` back in, announce `undoPerformed`, clear `_lastMove`.

## Phase 9 — Tests & demo

1. Unit (`test/accessible-grid.test.js`): constructor, slot observation, overlap warning, reading-order computation (both Z and N inputs), keyboard pickup/move/drop/cancel, move-menu commit, undo, event emission, focus restoration across reorder.
2. Axe (`test/accessible-grid.axe.js`): default, editable, grabbed state (simulate pickup), move menu open, cell with span, RTL.
3. Vdiff (`test/accessible-grid.vdiff.js`): default, editable with handles visible, ghost during drag (keyboard-grabbed state), collision-hidden cell, RTL.
4. Demo (`demo/index.html`): scannable Z layout (uniform cells), scannable N layout (multi-row spanning cell), editable dashboard, RTL grid, intentional collision to show warning behavior.

---

## Relevant files

- [accessible-grid.js](accessible-grid.js) — becomes a re-export shim for back-compat; main implementation relocates to a `components/` folder.
- `components/accessible-grid/accessible-grid.js` **(new)** — host class, slot observation, validation, reading-order, **all rendered chrome** (row wrappers, gridcell boxes, ARIA, drag handles, move-menu buttons), roving focus, keyboard reorder state machine, pointer DnD, commit/undo, event emission.
- `components/accessible-grid/accessible-grid-cell.js` **(new)** — data-only model element; properties + lifecycle events + default `<slot>` for content. No ARIA, no focus, no chrome.
- `components/accessible-grid/move-menu.js` **(new, optional split)** — host-rendered move menu + "Move to position" dialog; keeps the host file from ballooning.
- [lang/en.js](lang/en.js) — new keys listed in Phase 4; mirror into all other `lang/*.js`.
- [demo/index.html](demo/index.html) — replace placeholder snippet with four snippets (Phase 9).
- [test/accessible-grid.test.js](test/accessible-grid.test.js), [test/accessible-grid.axe.js](test/accessible-grid.axe.js), [test/accessible-grid.vdiff.js](test/accessible-grid.vdiff.js) — extend per Phase 9.
- [README.md](README.md) — document properties, events (`d2l-accessible-grid-move`), slots, the WCAG 2.5.7 rationale for the move menu, and the Z-vs-N reading-order algorithm (auto-detected from cell geometry; N triggered by multi-row spanning cells).

## Reference architecture (to mirror, not duplicate)

- `components/list/list.js` — `slotchange` + `assignedElements({flatten:true})` + per-item state writeback.
- `components/list/list-item-drag-handle.js` + `list-item-drag-drop-mixin.js` — keyboard reorder state machine, announcements, event shape (`d2l-list-item-position-change`, `d2l-list-items-move`). Our `d2l-accessible-grid-move` event follows the same cancelable-with-reorder-callback shape.
- `components/overflow-group/overflow-group-mixin.js` — `MutationObserver` setup for slotted-item attribute changes.
- `helpers/announce.js` — shared polite live region (single source of truth for screen-reader messages).
- `helpers/focus.js` `getFocusRingStyles()` — focus ring on cells + handles.
- `mixins/property-required/property-required-mixin.js` — enforces `label` on cell and `label` on grid.

## Verification

1. `npm run lint` — must pass (ESLint brightspace + stylelint).
2. **Visual layout smoke test (do this first):** `npm start`, open each demo snippet. Cells must visibly tile into a 2-D grid at their declared `x`/`y`/`width`/`height` coordinates with visible gaps. A spanning cell (e.g. `width=2`) must be visibly twice as wide as a unit cell. If any demo shows cells stacked vertically or ignoring their coordinates, the CSS grid layout is broken and implementation is incomplete.
3. `npm run test:unit` — new specs cover: overlap warning logged once; earlier-source cell renders, later-source cell is `aria-hidden`; reading-order returns Z for a uniform grid and for variable-width single-row cells; N order for a grid with a multi-row spanning cell (A, D, B, C, E); mixed layout with stacked N bands (cell_1 through cell_6); RTL mirroring reverses horizontal order within both Z and N bands; `Enter` on focused cell emits pickup announcement via spied `announce`; arrow keys clamp at grid edges; Escape restores position; `Ctrl+Z` undoes last commit; focus is restored to the moved cell after DOM reorder.
3. `npm run test:axe` — all states pass axe; includes keyboard-grabbed state and open move menu.
4. `npm run test:vdiff` — goldens regenerated for the new demo snippets.
5. Manual a11y pass with **NVDA+Firefox** and **VoiceOver+Safari**: confirm the reading order matches visual expectation (Z for uniform grids, N when spanning cells create column groups), pickup/move/drop/undo are all announced in the expected template, and the move menu is operable by a single-pointer touch gesture.
6. `npm start` — sanity-check all four demo snippets visually and with keyboard only (no mouse).

## Decisions (locked in with user)

- **Element names:** `d2l-accessible-grid` + `d2l-accessible-grid-cell`.
- **Architecture:** filter-style model/view split — authored cells are data-only; the host renders all chrome (row wrappers, gridcell boxes, ARIA, drag handles, move menus). Authored cell content is projected into its rendered position via a named slot (`cell-${key}`).
- **Editing:** opt-in via `editable` attribute.
- **WCAG 2.5.7 alternative:** per-cell "Move" menu.
- **Collision displacement:** row-major re-pack, post-drop undo (Ctrl+Z + toast).
- **Reading order:** Auto-detected from cell geometry via row-band decomposition. Z order (row-major) for bands with only single-row cells (any width). N order (column-group) for bands containing multi-row spanning cells. A single grid can mix Z and N bands. RTL mirroring via standard `dir` attribute (orthogonal to Z/N).
- **Intersection at author time:** DOM source order wins; later cell hidden + warned.
- **Undo:** single level.

## Out of scope (v1)

- Resize of cells by users (only reorder).
- Responsive reflow / breakpoint-based layout overrides.
- Multi-cell select + drag.
- Drag across multiple grids.
- Persistence of layout (consumer handles via `d2l-accessible-grid-move` events).
