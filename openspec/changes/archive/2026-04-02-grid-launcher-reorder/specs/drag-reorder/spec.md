## ADDED Requirements

### Requirement: Gesture state machine
The system SHALL use a pointer-event state machine to disambiguate between tap, swipe, and drag gestures on app icons.

#### Scenario: Tap to open app
- **WHEN** user presses and releases an app icon within 200ms with less than 10px movement
- **THEN** the gesture is recognized as TAP and the app opens

#### Scenario: Horizontal swipe overrides drag
- **WHEN** user presses an app icon and moves horizontally more than 30px within 300ms
- **THEN** the gesture is recognized as SWIPE and the page navigates (drag is not initiated)

#### Scenario: Long press initiates drag
- **WHEN** user presses an app icon and holds for more than 400ms with less than 10px movement
- **THEN** the gesture is recognized as DRAG and the icon enters drag mode

#### Scenario: Gesture lock
- **WHEN** a gesture (TAP, SWIPE, or DRAG) is recognized
- **THEN** the other gesture types are locked out until pointerup resets the state to IDLE

### Requirement: Drag visual feedback
The system SHALL provide visual feedback during drag operations.

#### Scenario: Icon follows pointer
- **WHEN** a drag gesture is active and the user moves the pointer
- **THEN** the dragged app icon follows the pointer position with slight opacity reduction

#### Scenario: Drop target highlight
- **WHEN** a dragged icon hovers over a valid drop position (between other icons)
- **THEN** surrounding icons shift to create a visible gap indicating the drop position

#### Scenario: Drag cancellation
- **WHEN** user presses Escape during a drag operation
- **THEN** the drag is cancelled and the icon returns to its original position

### Requirement: Reorder within a page
The system SHALL allow users to drag an app icon to a new position within the same page.

#### Scenario: Move app within page
- **WHEN** user drags app from position 2 to position 5 on page 1
- **THEN** the app moves to position 5, other apps shift to fill the gap, and the layout service is updated

#### Scenario: Drop triggers save
- **WHEN** user drops an app icon after a reorder
- **THEN** the layout service persists the updated layout to the server

### Requirement: Reorder across pages
The system SHALL allow users to drag an app icon to a different page.

#### Scenario: Drag to edge triggers page transition
- **WHEN** user drags an app icon to the left or right edge of the viewport and holds for 500ms
- **THEN** the page transitions to the adjacent page while maintaining the drag operation

#### Scenario: Drop on different page
- **WHEN** user drops an app icon on a different page
- **THEN** the app is removed from the source page and inserted at the drop position on the target page, and layout is persisted
