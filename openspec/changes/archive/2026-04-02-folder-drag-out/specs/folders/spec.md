## MODIFIED Requirements

### Requirement: Folder popover accessible in jiggle mode
The folder popover SHALL open when the user taps a folder icon in jiggle mode, allowing folder editing operations (rename, remove apps, drag out apps).

#### Scenario: Tap folder in jiggle mode
- **WHEN** jiggle mode is active and user taps a folder icon
- **THEN** the folder popover opens showing contained apps with remove badges

#### Scenario: Tap folder in normal mode
- **WHEN** jiggle mode is not active and user taps a folder icon
- **THEN** the folder popover opens showing contained apps (no remove badges)

## ADDED Requirements

### Requirement: Drag app out of folder popover
In jiggle mode, users SHALL be able to drag an app from the folder popover onto the main grid to extract it at a specific position.

#### Scenario: Drag app from popover to grid
- **WHEN** jiggle mode is active, folder popover is open, and user drags an app from the popover onto the main grid
- **THEN** the popover closes, a drag ghost follows the pointer, and dropping places the app at the target position on the grid

#### Scenario: Drop completes extraction
- **WHEN** user drops a popover-dragged app onto a grid position
- **THEN** the app is removed from the folder and inserted at the drop position

#### Scenario: Folder auto-unwrap after drag-out
- **WHEN** dragging out leaves the folder with only one app
- **THEN** the folder auto-unwraps into a single app icon on the grid

#### Scenario: Drag cancelled
- **WHEN** user presses Escape during a popover drag
- **THEN** the drag is cancelled and the app remains in the folder
