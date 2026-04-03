## ADDED Requirements

### Requirement: Display contextual hint bar
The system SHALL display a subtle text hint at the bottom of the launcher, between the dot indicators and the viewport edge.

#### Scenario: Hint visible in normal mode
- **WHEN** the launcher is open in normal mode and `showHint` is true
- **THEN** a hint bar displays "Hold an app to rearrange"

#### Scenario: Hint changes in jiggle mode
- **WHEN** jiggle mode is active and `showHint` is true
- **THEN** the hint bar displays "Drag to reorder · Drop on another to folder · Press Done to finish"

#### Scenario: Hint hidden during search
- **WHEN** a search query is active
- **THEN** the hint bar is hidden regardless of `showHint` setting

#### Scenario: Hint hidden when folder popover open
- **WHEN** a folder popover is open
- **THEN** the hint bar is hidden

### Requirement: Toggle hint on/off
The system SHALL allow users to dismiss the hint bar via a close button, and the preference SHALL persist.

#### Scenario: Dismiss hint
- **WHEN** user clicks the "×" button on the hint bar
- **THEN** the hint bar is hidden and `showHint` is set to `false` in the layout JSON and persisted

#### Scenario: Hint stays hidden
- **WHEN** `showHint` is `false` in the user's layout
- **THEN** the hint bar is not rendered on any subsequent launcher opens

### Requirement: Default hint state
The system SHALL default `showHint` to `true` for users without an explicit preference.

#### Scenario: New user sees hint
- **WHEN** a user has no saved layout (first time)
- **THEN** the hint bar is visible with `showHint` defaulting to `true`

#### Scenario: Existing user without showHint field
- **WHEN** a user has a saved layout from Phase 1 (no `showHint` field)
- **THEN** the system defaults `showHint` to `true` and the hint bar is visible
