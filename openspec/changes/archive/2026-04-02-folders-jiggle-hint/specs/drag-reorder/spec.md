## MODIFIED Requirements

### Requirement: Gesture state machine
The system SHALL use a pointer-event state machine to disambiguate between tap, swipe, and jiggle-entry gestures on app icons. In normal mode, long-press enters jiggle mode instead of initiating drag. In jiggle mode, any pointermove on an icon initiates drag immediately.

#### Scenario: Tap to open app
- **WHEN** user presses and releases an app icon within 200ms with less than 10px movement
- **THEN** the gesture is recognized as TAP and the app opens

#### Scenario: Horizontal swipe overrides other gestures
- **WHEN** user presses an app icon and moves horizontally more than 30px within 300ms
- **THEN** the gesture is recognized as SWIPE and the page navigates

#### Scenario: Long press enters jiggle mode (normal mode)
- **WHEN** the launcher is in normal mode and user presses an app icon and holds for more than 400ms with less than 10px movement
- **THEN** jiggle mode is entered (icons wobble). Drag is NOT initiated

#### Scenario: Immediate drag in jiggle mode
- **WHEN** jiggle mode is active and user presses an app icon and moves more than 5px
- **THEN** drag mode is initiated immediately without waiting for a hold timer

#### Scenario: Gesture lock
- **WHEN** a gesture (TAP, SWIPE, or DRAG) is recognized
- **THEN** the other gesture types are locked out until pointerup resets the state to IDLE

## ADDED Requirements

### Requirement: Folder drop zone during drag
The system SHALL detect when a dragged icon is held over another app icon (not a folder) for 300ms and show a folder creation highlight.

#### Scenario: Hover over app triggers folder zone
- **WHEN** user drags an app icon and hovers over another app icon for 300ms in jiggle mode
- **THEN** the target icon shows a scale-up + highlight ring indicating a folder will be created on drop

#### Scenario: Drop on folder zone creates folder
- **WHEN** user drops on the highlighted folder creation zone
- **THEN** a new folder is created containing the dragged and target apps

#### Scenario: Drop on existing folder adds to folder
- **WHEN** user drags an app icon and drops it on an existing folder icon in jiggle mode
- **THEN** the app is added to the folder
