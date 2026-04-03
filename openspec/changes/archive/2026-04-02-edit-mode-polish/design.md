## Context

The app launcher has jiggle mode (edit mode) for reordering apps and managing folders. Currently, exiting jiggle mode requires tapping the "Done" button or pressing Escape. Users expect tapping any empty space to also exit, matching iOS/Android behavior. Additionally, removing an app from a folder currently requires dragging it out of the popover, which is not discoverable — a visible remove button would improve usability. Finally, once the user guide hint is dismissed, there is no way to bring it back.

## Goals / Non-Goals

**Goals:**
- Tap on empty grid space in jiggle mode exits edit mode and saves layout
- Each app in the folder popover shows a ✕ remove badge in jiggle mode
- Tapping the remove badge extracts the app from the folder into the main grid
- A toggle in jiggle mode header allows re-enabling the hint bar after dismissal

**Non-Goals:**
- Changing drag-out behavior (still works as before)
- Adding remove badges to apps on the main grid (only in folder popover)

## Decisions

### 1. Empty-space tap exits jiggle mode

In `onPointerUp`, when `gestureState === GESTURE_PENDING` and `_gestureItemId === null` (no icon was tapped):
- If `jiggleMode` is active → call `exitJiggleMode()` + `saveLayout()`
- If normal mode → call `props.onClose()` to close the launcher

**Why:** Reuses existing gesture detection — empty-space taps already go through `onPointerDownEmpty` which sets `_gestureItemId = null`. Just need to check this condition in `onPointerUp` and branch on jiggle state.

### 2. Popover remove badge

Add a ✕ button on each app in `.ggg-popover-app` when `state.jiggleMode` is true. On click, call `layoutService.removeAppFromFolder()` to extract the app, then re-render. The app is inserted at the end of the folder's page.

**Why:** Consistent with the folder delete badge pattern already used in jiggle mode. Uses existing `removeAppFromFolder()` service method — no new service API needed.

### 3. Hint toggle button

Add a small "Show hints" / "Hide hints" toggle button next to the Done button in jiggle mode header. When hint is hidden, clicking "Show hints" calls `layoutService.setShowHint(true)` and updates `state.showHint`. When hint is visible, clicking "Hide hints" calls `layoutService.setShowHint(false)`.

**Why:** Placing it in the jiggle mode header keeps it discoverable but out of the way during normal use. The toggle only appears in jiggle mode since that's when users are configuring the launcher.

## Risks / Trade-offs

- [Empty-space tap may conflict with swipe] → Mitigated: only triggers on `GESTURE_PENDING` state with short elapsed time + minimal movement, same as existing tap detection.
- [Removing last app from folder in popover] → `removeAppFromFolder` already handles auto-unwrap (1 app) and deletion (0 apps). Popover should close if folder dissolves.
