## Why

Four usability gaps: (1) users expect tapping empty space to exit edit mode (like iOS), but currently only the Done button or Escape key works; (2) there's no way to remove an individual app from a folder without drag-out, which is not discoverable; (3) once the user guide hint is dismissed, there's no way to bring it back; (4) in normal mode, tapping empty space should close the launcher entirely, matching overlay dismiss patterns.

## What Changes

- Tapping empty grid space in normal mode closes the app launcher
- Tapping empty grid space in jiggle mode exits jiggle mode (calls `exitJiggleMode()` and saves layout)
- Add a remove button (✕) on each app inside the folder popover when in jiggle mode, allowing one-tap removal from the folder
- Add a "Show hints" toggle in jiggle mode header to re-enable the user guide hint after it has been dismissed

## Capabilities

### New Capabilities

_(none — both changes extend existing capabilities)_

### Modified Capabilities

- `jiggle-mode`: Tapping empty space in jiggle mode now exits edit mode
- `folders`: Folder popover shows per-app remove button in jiggle mode
- `user-guide-hint`: Add ability to re-enable hint after dismissal

## Impact

- `app_launcher.js` — modify `onPointerUp` empty-tap handling + add `onPopoverRemoveApp()` method + add hint toggle handler
- `app_launcher.xml` — add remove badge in popover app template + add hint toggle button in jiggle mode header
- `app_launcher.scss` — add remove badge styling in popover + hint toggle button styling
