## 1. Allow Folder Popover in Jiggle Mode

- [x] 1.1 Remove the `this.state.jiggleMode` guard from `onFolderClick` so the popover opens in both normal and jiggle mode

## 2. Popover Drag Initiation

- [x] 2.1 Add `onPopoverPointerDown(ev, folderApp, folderAppIndex)` method — stores popover source info (`_popoverDragFolderPage`, `_popoverDragFolderIdx`, `_popoverDragAppIdx`) and sets gesture to PENDING
- [x] 2.2 In `onPointerMove`, when dragging from popover and move > 5px — close popover, call `_startDrag()`, set `_draggingFromPopover = true`
- [x] 2.3 Add `pointerdown` handler on `.ggg-popover-app` in `app_launcher.xml` — only in jiggle mode, calls `onPopoverPointerDown`

## 3. Drag Completion from Popover

- [x] 3.1 In `_completeDrag()`, if `_draggingFromPopover` is true — call `layoutService.removeAppFromFolder()` with drop target position instead of `layoutService.moveApp()`
- [x] 3.2 After popover drag completion, check if folder still exists — if auto-unwrapped or deleted, no extra action needed
- [x] 3.3 Reset `_draggingFromPopover` flag in `_cancelDrag()` and after completion

## 4. Testing

- [x] 4.1 Test: tap folder in jiggle mode opens popover
- [x] 4.2 Test: drag app from popover to grid — app lands at drop position
- [x] 4.3 Test: drag-out from 2-app folder causes auto-unwrap
- [x] 4.4 Test: cancel drag with Escape — app stays in folder
