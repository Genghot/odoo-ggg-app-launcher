## Context

The folder popover shows apps inside a folder. In normal mode, tapping an app opens it. In jiggle mode (edit mode), the popover also shows ✕ remove badges. However, the popover cannot currently be opened in jiggle mode because `onFolderClick` has a guard `if (this.state.jiggleMode) return`. The drag-out from popover feature (task 7.2 in Phase 2) was scaffolded but the folder tap was blocked.

## Goals / Non-Goals

**Goals:**
- Open folder popover in jiggle mode via tap on folder icon
- Drag an app from the popover onto the main grid to extract it at a precise position
- Reuse existing drag ghost, drop target detection, and `removeAppFromFolder` service method

**Non-Goals:**
- Drag apps INTO the folder popover (already handled by folder zone dwell on grid)
- Reorder apps within the folder popover

## Decisions

### 1. Allow popover in jiggle mode

Remove the `this.state.jiggleMode` guard from `onFolderClick`. The popover already renders correctly with remove badges in jiggle mode.

### 2. Popover drag initiation

Add `pointerdown` handler on `.ggg-popover-app` elements (only in jiggle mode). On pointerdown, store the source folder coordinates (`_popoverDragFolderPage`, `_popoverDragFolderIdx`, `_popoverDragAppIdx`). When pointermove exceeds 5px threshold, close the popover and start a regular drag using the existing `_startDrag()` flow with a special flag `_draggingFromPopover = true`.

**Why:** Reusing the existing drag system means drop target detection, edge scrolling, and the drag ghost all work without changes.

### 3. Drag completion from popover

In `_completeDrag()`, check `_draggingFromPopover`. If true, call `layoutService.removeAppFromFolder()` instead of `layoutService.moveApp()`, passing the drop target position. Then check if the folder auto-unwrapped or was deleted.

### 4. Popover closes on drag start

When the drag begins from a popover app, close the popover immediately so the user sees the main grid and drop targets clearly.

## Risks / Trade-offs

- [Drag from popover may feel different from grid drag] → Mitigated: once popover closes and drag starts, the experience is identical to grid drag.
- [Pointer capture on popover vs grid] → The pointermove/pointerup handlers are on the page viewport; since we close the popover on drag start, pointer events flow to the grid naturally.
