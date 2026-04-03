## ADDED Requirements

### Requirement: Remove app from folder via popover badge
In jiggle mode, each app inside the folder popover SHALL display a ✕ remove badge. Tapping the badge SHALL remove the app from the folder and place it on the main grid.

#### Scenario: Remove app from folder with multiple apps
- **WHEN** jiggle mode is active, folder popover is open, and user taps ✕ on an app in a folder with 3+ apps
- **THEN** the app is removed from the folder and inserted at the end of the folder's page, folder remains with remaining apps

#### Scenario: Remove app leaving folder with one app
- **WHEN** user removes an app leaving only one app in the folder
- **THEN** the folder auto-unwraps — the remaining app replaces the folder on the grid, popover closes

#### Scenario: Remove badge not shown in normal mode
- **WHEN** folder popover is open but jiggle mode is not active
- **THEN** no remove badges are shown on popover apps
