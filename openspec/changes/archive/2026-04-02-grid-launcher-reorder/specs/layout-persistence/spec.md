## ADDED Requirements

### Requirement: Per-user layout field
The system SHALL add a `ggg_app_layout` Text field to `res.users` that stores the user's app layout as JSON. The field SHALL be SELF_READABLE and SELF_WRITEABLE.

#### Scenario: Field exists after install
- **WHEN** the module is installed
- **THEN** `res.users` has a `ggg_app_layout` Text field with no default value

#### Scenario: Frontend can read own layout
- **WHEN** the frontend reads the current user's `ggg_app_layout` field
- **THEN** the value is returned without requiring admin privileges

#### Scenario: Frontend can write own layout
- **WHEN** the frontend writes to the current user's `ggg_app_layout` field
- **THEN** the write succeeds without requiring admin privileges

### Requirement: Layout JSON structure
The layout SHALL be stored as a JSON string with a `pages` array, where each page has an `items` array of app references.

#### Scenario: Valid layout structure
- **WHEN** a layout is saved
- **THEN** it follows the structure `{"pages": [{"items": [{"type": "app", "appId": <int>}]}]}`

#### Scenario: Empty/null layout
- **WHEN** a user has no saved layout (null or empty string)
- **THEN** the system treats this as "no custom layout" and builds a default from installed apps

### Requirement: AppLayoutService initialization
The AppLayoutService SHALL load the user's layout on startup and reconcile it with currently installed apps.

#### Scenario: First-time user with no layout
- **WHEN** a user has no saved `ggg_app_layout`
- **THEN** the service builds a default layout from `menuService.getApps()` ordered by app ID, does NOT persist until the user makes a reorder

#### Scenario: Returning user with saved layout
- **WHEN** a user has a saved `ggg_app_layout`
- **THEN** the service loads the JSON, reconciles with installed apps, and uses the saved ordering

### Requirement: Reconcile new apps
The service SHALL detect apps that exist in `menuService.getApps()` but are missing from the saved layout, and append them.

#### Scenario: New module installed since last layout save
- **WHEN** the layout contains appIds [5, 12, 9] but menuService returns apps [5, 9, 12, 33]
- **THEN** app 33 is appended to the last page's items array

#### Scenario: Last page overflow from new apps
- **WHEN** appending new apps would exceed the items-per-page limit on the last page
- **THEN** a new page is created for the overflow apps

### Requirement: Reconcile removed apps
The service SHALL detect appIds in the saved layout that no longer exist in `menuService.getApps()`, and remove them.

#### Scenario: Module uninstalled since last layout save
- **WHEN** the layout contains appId 20 but menuService no longer returns an app with id 20
- **THEN** appId 20 is silently removed from the layout

#### Scenario: Removal leaves empty page
- **WHEN** removing uninstalled apps causes a page to have zero items
- **THEN** the empty page is removed from the layout

#### Scenario: Reconciliation does not auto-persist
- **WHEN** reconciliation adds or removes apps
- **THEN** the cleaned layout is used in memory but NOT persisted to the server until the next explicit save (triggered by user reorder)

### Requirement: Save on reorder
The service SHALL persist the layout to the server after every successful drag-and-drop reorder.

#### Scenario: Successful reorder save
- **WHEN** user drops an app icon after reordering
- **THEN** the service writes the updated JSON to `res.users.ggg_app_layout` via ORM

#### Scenario: Save failure
- **WHEN** the ORM write fails (network error, permission issue)
- **THEN** the in-memory layout retains the new order (optimistic) and the save is retried on next reorder
