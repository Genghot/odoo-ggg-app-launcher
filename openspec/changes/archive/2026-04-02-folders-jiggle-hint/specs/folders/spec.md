## ADDED Requirements

### Requirement: Create folder by dropping app onto app
The system SHALL create a new folder when a user drags an app icon onto another app icon in jiggle mode and holds for 300ms.

#### Scenario: Hover triggers folder creation zone
- **WHEN** user drags an app icon over another app icon and holds for 300ms in jiggle mode
- **THEN** the target icon scales up and shows a highlight ring indicating a folder will be created on drop

#### Scenario: Drop creates folder
- **WHEN** user drops the dragged app onto the highlighted target app
- **THEN** a new folder is created containing both apps, named "Folder", replacing the target app's position in the grid

#### Scenario: Move away cancels folder creation
- **WHEN** user drags over a target app, the highlight appears, but user moves away before dropping
- **THEN** the highlight disappears and no folder is created

#### Scenario: Cannot create folder from single app
- **WHEN** user drags an app but does not drop it on another app
- **THEN** the app is reordered normally and no folder is created

### Requirement: Folder 2×2 preview icon
The system SHALL render folder items as a rounded-rect container with a 2×2 mini-grid showing the first 4 contained app icons.

#### Scenario: Folder with 4+ apps
- **WHEN** a folder contains 4 or more apps
- **THEN** the folder icon shows a 2×2 grid of the first 4 app icons scaled down, with the folder name below

#### Scenario: Folder with fewer than 4 apps
- **WHEN** a folder contains 2 or 3 apps
- **THEN** the folder icon shows the app icons in the 2×2 grid with empty slots as light gray placeholders

### Requirement: Open folder popover
The system SHALL open an inline popover when a folder is clicked in normal mode, showing the folder's contents.

#### Scenario: Click folder in normal mode
- **WHEN** user clicks a folder icon while not in jiggle mode
- **THEN** a popover appears anchored to the folder icon showing all apps in the folder in a small grid (max 3×3)

#### Scenario: Click app in popover
- **WHEN** user clicks an app icon inside the folder popover
- **THEN** the app opens, the popover closes, and the launcher closes

#### Scenario: Close popover
- **WHEN** the folder popover is open and user clicks outside it or presses Escape
- **THEN** the popover closes

#### Scenario: Popover positioning
- **WHEN** a folder popover opens
- **THEN** it positions below the folder if the folder is in the top half of the viewport, or above if in the bottom half

### Requirement: Rename folder
The system SHALL allow users to rename a folder by clicking its name label.

#### Scenario: Click folder name to edit
- **WHEN** user clicks the folder name in the popover header
- **THEN** the name becomes an editable text input with the current name selected

#### Scenario: Save renamed folder
- **WHEN** user changes the folder name and presses Enter or clicks outside
- **THEN** the new name is saved to the layout and persisted

#### Scenario: Empty name reverts
- **WHEN** user clears the folder name and confirms
- **THEN** the name reverts to the previous name (empty names are not allowed)

### Requirement: Drag apps into folders
The system SHALL allow users to drag additional apps into existing folders in jiggle mode.

#### Scenario: Drop app onto folder
- **WHEN** user drags an app icon and drops it onto a folder icon in jiggle mode
- **THEN** the app is added to the folder's appIds and removed from the grid

### Requirement: Drag apps out of folders
The system SHALL allow users to drag apps out of a folder popover back onto the grid in jiggle mode.

#### Scenario: Drag app out of popover
- **WHEN** jiggle mode is active, a folder popover is open, and user drags an app out of the popover onto the grid
- **THEN** the app is removed from the folder and placed at the drop position on the grid

#### Scenario: Last app dragged out unwraps folder
- **WHEN** user drags an app out and the folder has only 1 app remaining
- **THEN** the folder is automatically replaced by the remaining single app

### Requirement: Empty folder auto-delete
The system SHALL automatically delete folders that become empty.

#### Scenario: All apps removed from folder
- **WHEN** all apps are dragged out of a folder or uninstalled via reconciliation
- **THEN** the folder item is removed from the layout

### Requirement: Folder delete via badge
The system SHALL delete a folder when the user clicks its ✕ badge in jiggle mode, returning contained apps to the grid.

#### Scenario: Delete folder via badge
- **WHEN** user clicks the ✕ badge on a folder in jiggle mode
- **THEN** the folder is removed and all its contained apps are inserted at the folder's former grid position
