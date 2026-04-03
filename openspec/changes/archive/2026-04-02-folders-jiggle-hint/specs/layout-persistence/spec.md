## MODIFIED Requirements

### Requirement: Layout JSON structure
The layout SHALL be stored as a JSON string with a `pages` array, a `showHint` boolean, and support for both `type: "app"` and `type: "folder"` items.

#### Scenario: Valid layout with folders and hint
- **WHEN** a layout is saved
- **THEN** it follows the structure `{"showHint": <bool>, "pages": [{"items": [<app_or_folder_item>]}]}`

#### Scenario: App item structure
- **WHEN** an item has `type: "app"`
- **THEN** it has the structure `{"type": "app", "appId": <int>}`

#### Scenario: Folder item structure
- **WHEN** an item has `type: "folder"`
- **THEN** it has the structure `{"type": "folder", "name": <string>, "appIds": [<int>, ...]}`

#### Scenario: Empty/null layout
- **WHEN** a user has no saved layout (null or empty string)
- **THEN** the system treats this as "no custom layout", builds a default from installed apps, and sets `showHint` to `true`

#### Scenario: Legacy layout without showHint
- **WHEN** a saved layout has no `showHint` field (Phase 1 layout)
- **THEN** the system defaults `showHint` to `true`

## MODIFIED Requirements

### Requirement: Reconcile removed apps
The service SHALL detect appIds in the saved layout that no longer exist in `menuService.getApps()`, and remove them from both app items and folder appIds.

#### Scenario: Module uninstalled since last layout save
- **WHEN** the layout contains appId 20 but menuService no longer returns an app with id 20
- **THEN** appId 20 is silently removed from the layout (from app items and from folder appIds)

#### Scenario: Removal leaves empty page
- **WHEN** removing uninstalled apps causes a page to have zero items
- **THEN** the empty page is removed from the layout

#### Scenario: Removal leaves empty folder
- **WHEN** removing uninstalled apps from a folder causes it to have zero appIds
- **THEN** the folder item is removed from the layout

#### Scenario: Removal leaves single-app folder
- **WHEN** removing uninstalled apps from a folder causes it to have exactly 1 appId
- **THEN** the folder is unwrapped — replaced by a single app item with that appId

#### Scenario: Reconciliation does not auto-persist
- **WHEN** reconciliation adds or removes apps
- **THEN** the cleaned layout is used in memory but NOT persisted to the server until the next explicit save

## ADDED Requirements

### Requirement: Folder management methods
The AppLayoutService SHALL provide methods for creating, deleting, and modifying folders.

#### Scenario: Create folder
- **WHEN** `createFolder(pageIdx, targetIdx, draggedAppId)` is called
- **THEN** a new folder item is created at `pageIdx/targetIdx` containing the target app and the dragged app, the target app item is replaced, and the dragged app item is removed from its original position

#### Scenario: Delete folder and expand
- **WHEN** `deleteFolder(pageIdx, folderIdx)` is called
- **THEN** the folder is removed and its contained apps are inserted as individual app items at the folder's former position

#### Scenario: Add app to folder
- **WHEN** `addAppToFolder(pageIdx, folderIdx, appId, fromPage, fromIdx)` is called
- **THEN** the app is added to the folder's `appIds` and removed from its original grid position

#### Scenario: Remove app from folder
- **WHEN** `removeAppFromFolder(pageIdx, folderIdx, appIdxInFolder, toPage, toIdx)` is called
- **THEN** the app is removed from the folder's `appIds` and inserted at the target grid position. If the folder has 1 or 0 apps remaining, it is auto-unwrapped or deleted

#### Scenario: Rename folder
- **WHEN** `renameFolder(pageIdx, folderIdx, newName)` is called with a non-empty name
- **THEN** the folder's `name` is updated in the layout

### Requirement: Hint preference persistence
The AppLayoutService SHALL support reading and writing the `showHint` preference.

#### Scenario: Set showHint to false
- **WHEN** `setShowHint(false)` is called
- **THEN** `showHint` is set to `false` in the layout and persisted to the server

#### Scenario: Read showHint
- **WHEN** `getShowHint()` is called
- **THEN** the current `showHint` value is returned (defaulting to `true` if not set)
