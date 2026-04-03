## ADDED Requirements

### Requirement: Enter jiggle mode via long-press
The system SHALL enter jiggle mode when the user long-presses any app icon or folder for more than 400ms in normal mode.

#### Scenario: Long-press on app icon
- **WHEN** user presses and holds an app icon for more than 400ms with less than 10px movement
- **THEN** jiggle mode activates — all icons begin wobbling and a "Done" button appears in the header

#### Scenario: Long-press on folder
- **WHEN** user presses and holds a folder icon for more than 400ms
- **THEN** jiggle mode activates identically to long-pressing an app

### Requirement: Enter jiggle mode via Edit button
The system SHALL provide an "Edit" button in the launcher header that enters jiggle mode on click.

#### Scenario: Click Edit button
- **WHEN** user clicks the "Edit" button in the launcher header
- **THEN** jiggle mode activates, the "Edit" button is replaced by a "Done" button

### Requirement: Jiggle animation
The system SHALL apply a CSS wobble animation to all app icons and folder icons while jiggle mode is active.

#### Scenario: Icons wobble
- **WHEN** jiggle mode is active
- **THEN** all icons display a continuous subtle rotation animation (alternating ±1.5deg)

#### Scenario: Icons stop wobbling on exit
- **WHEN** jiggle mode is deactivated
- **THEN** all icons immediately stop the wobble animation

### Requirement: Exit jiggle mode
The system SHALL exit jiggle mode when the user presses "Done", presses Escape, or taps an app to open it.

#### Scenario: Press Done button
- **WHEN** jiggle mode is active and user clicks "Done"
- **THEN** jiggle mode deactivates, wobble stops, "Done" reverts to "Edit"

#### Scenario: Press Escape
- **WHEN** jiggle mode is active and user presses Escape (with no active drag)
- **THEN** jiggle mode deactivates

#### Scenario: Open app exits jiggle
- **WHEN** jiggle mode is active and user taps an app icon
- **THEN** the app opens and jiggle mode deactivates

### Requirement: Delete badges on folders
The system SHALL show ✕ delete badges on folder icons while jiggle mode is active.

#### Scenario: Delete badge visible
- **WHEN** jiggle mode is active
- **THEN** each folder icon displays a ✕ badge in the top-left corner

#### Scenario: Click delete badge
- **WHEN** user clicks the ✕ badge on a folder in jiggle mode
- **THEN** the folder is deleted and its contained apps are placed back on the grid at the folder's position

#### Scenario: Delete badge hidden in normal mode
- **WHEN** jiggle mode is not active
- **THEN** no ✕ badges are visible on folders
