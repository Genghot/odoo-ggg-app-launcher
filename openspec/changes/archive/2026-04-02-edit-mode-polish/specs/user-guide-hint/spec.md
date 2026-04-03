## ADDED Requirements

### Requirement: Re-enable hint after dismissal
In jiggle mode, the header SHALL display a toggle button to show or hide the user guide hint. This allows users to bring back the hint bar after it has been dismissed.

#### Scenario: Re-enable dismissed hint
- **WHEN** jiggle mode is active and hint is currently dismissed
- **THEN** a "Show hints" button appears in the header; tapping it re-enables the hint bar and persists the preference

#### Scenario: Hide hint via toggle
- **WHEN** jiggle mode is active and hint is currently visible
- **THEN** a "Hide hints" button appears in the header; tapping it hides the hint bar and persists the preference

#### Scenario: Toggle not visible in normal mode
- **WHEN** jiggle mode is not active
- **THEN** the hint toggle button is not shown
