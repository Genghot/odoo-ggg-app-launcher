## ADDED Requirements

### Requirement: Full-screen overlay launcher
The system SHALL render the app launcher as a full-screen fixed overlay (z-index 1060) covering the entire viewport when activated. The overlay SHALL be a standalone OWL component (not a Dropdown subclass).

#### Scenario: Open launcher via button click
- **WHEN** user clicks the ⊞ (oi-apps) button in the navbar
- **THEN** a full-screen overlay appears with a fade/scale animation covering the entire viewport

#### Scenario: Open launcher via hotkey
- **WHEN** user presses the `H` hotkey (data-hotkey="h")
- **THEN** the launcher overlay opens identically to a button click

#### Scenario: Close by clicking an app
- **WHEN** the launcher is open and user clicks an app icon
- **THEN** the launcher closes and Odoo navigates to the selected app

#### Scenario: Close by pressing Escape
- **WHEN** the launcher is open and user presses Escape
- **THEN** the launcher closes and the previous view remains

#### Scenario: Close on action manager update
- **WHEN** the launcher is open and the ACTION_MANAGER:UI-UPDATED bus event fires
- **THEN** the launcher closes automatically

### Requirement: App icon grid rendering
The system SHALL render each app as an icon tile with the app's `webIconData` image and name label, arranged in a responsive CSS grid.

#### Scenario: App with webIconData
- **WHEN** an app has a `webIconData` property (base64 data URL)
- **THEN** the icon tile displays that image

#### Scenario: App without webIconData
- **WHEN** an app has no `webIconData`
- **THEN** the icon tile displays a fallback icon from `/base/static/description/icon.png`

#### Scenario: App selection navigates
- **WHEN** user taps/clicks an app icon
- **THEN** the system calls `menuService.selectMenu(app)` to navigate to that app

### Requirement: Responsive grid columns
The grid SHALL adapt its column count based on viewport width using CSS media queries.

#### Scenario: Mobile viewport (< 576px)
- **WHEN** viewport width is less than 576px
- **THEN** the grid renders 3 columns

#### Scenario: Tablet viewport (576px - 991px)
- **WHEN** viewport width is between 576px and 991px
- **THEN** the grid renders 4 columns

#### Scenario: Desktop viewport (≥ 992px)
- **WHEN** viewport width is 992px or greater
- **THEN** the grid renders 6 columns

### Requirement: Search/filter bar
The launcher SHALL include a search input at the top that filters visible apps by name across all pages.

#### Scenario: Filter matches apps
- **WHEN** user types "sal" in the search bar
- **THEN** only apps whose name contains "sal" (case-insensitive) are displayed in a flat unpaginated grid

#### Scenario: Filter returns no results
- **WHEN** user types a query that matches no apps
- **THEN** the grid area is empty (no error message required)

#### Scenario: Clear search restores pages
- **WHEN** user clears the search input (backspace or clear button)
- **THEN** the launcher returns to the paginated view on the same page the user was on before searching

### Requirement: NavBar template override
The module SHALL override `web.NavBar.AppsMenu` using `t-inherit` with `t-inherit-mode="extension"` and xpath `position="replace"` to replace both the desktop Dropdown and mobile sidebar with the unified AppLauncher component.

#### Scenario: Module installed on clean Odoo 19 CE
- **WHEN** the module is installed on a vanilla Odoo 19 CE instance
- **THEN** the default text dropdown app menu is replaced by the icon grid launcher

#### Scenario: NavBar patch registers component
- **WHEN** the module loads
- **THEN** `AppLauncher` is added to `NavBar.components` and `state.gggLauncherOpen` is added to NavBar's existing useState
