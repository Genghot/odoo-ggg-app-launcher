## Why

When a folder popover is open in jiggle mode, users should be able to drag an app out of the folder onto the main grid. Currently the folder popover only supports tapping apps (to open them) and the ✕ remove badge (to extract to end of page). Drag-out gives users precise control over where the extracted app lands on the grid.

Additionally, `onFolderClick` currently blocks in jiggle mode, so the folder popover cannot even be opened during edit mode — this must be fixed first.

## What Changes

- Allow folder popover to open in jiggle mode (remove the jiggle guard in `onFolderClick`)
- Enable pointer-down on popover apps in jiggle mode to initiate a drag
- On drag completion, extract the app from the folder and insert it at the drop position on the main grid
- Auto-close popover and auto-unwrap/delete folder if it has ≤1 app remaining

## Capabilities

### New Capabilities

_(none — extends existing folder editing capability)_

### Modified Capabilities

- `folders`: Allow dragging apps out of folder popover onto the main grid in jiggle mode

## Impact

- `app_launcher.js` — remove jiggle guard in `onFolderClick`, add popover drag initiation + completion logic
- `app_launcher.xml` — add `pointerdown` handler on popover apps in jiggle mode
- `app_launcher.scss` — minor: dragging state on popover app
