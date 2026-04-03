## ADDED Requirements

### Requirement: Paginated app display
The system SHALL split apps into pages based on the current viewport's items-per-page limit (9 mobile, 12 tablet, 18 desktop). Each page SHALL be rendered as a horizontal panel within a swipeable container.

#### Scenario: Apps fit in one page
- **WHEN** there are 6 installed apps and the viewport is desktop (18 items/page)
- **THEN** one page is rendered with 6 icons and no dot indicators

#### Scenario: Apps span multiple pages
- **WHEN** there are 25 installed apps and the viewport is desktop (18 items/page)
- **THEN** two pages are rendered (18 + 7) with dot indicators showing ● ○

#### Scenario: Saved page has more items than current breakpoint allows
- **WHEN** a saved page contains 15 items and the viewport is mobile (9 items/page)
- **THEN** overflow items are displayed on a virtual next page for rendering only (saved layout is not mutated)

### Requirement: Swipe navigation
The system SHALL support horizontal swipe gestures to navigate between pages using pointer events (touch and mouse).

#### Scenario: Swipe left to next page
- **WHEN** user swipes left (horizontal move > 30px within 300ms) and there is a next page
- **THEN** the page container animates via CSS `translateX` to show the next page

#### Scenario: Swipe right to previous page
- **WHEN** user swipes right (horizontal move > 30px within 300ms) and there is a previous page
- **THEN** the page container animates to show the previous page

#### Scenario: Swipe at boundary
- **WHEN** user swipes left on the last page (or right on the first page)
- **THEN** the container shows a rubber-band resistance effect and snaps back

#### Scenario: Swipe on empty space
- **WHEN** user initiates a swipe gesture on empty grid space (not on an app icon)
- **THEN** the gesture is always interpreted as a page swipe (no ambiguity)

### Requirement: Dot indicators
The system SHALL render dot indicators at the bottom showing the current page position. Dots SHALL be clickable to jump to a specific page.

#### Scenario: Current page highlighted
- **WHEN** user is on page 2 of 3
- **THEN** dot indicators show ○ ● ○

#### Scenario: Click dot to jump
- **WHEN** user clicks the third dot indicator
- **THEN** the page container animates to page 3 and dots update to ○ ○ ●

#### Scenario: Single page hides dots
- **WHEN** all apps fit on one page
- **THEN** no dot indicators are rendered

### Requirement: Resize recalculation
The system SHALL recalculate the items-per-page and re-paginate on viewport resize, preserving user context.

#### Scenario: Resize from desktop to mobile
- **WHEN** user resizes from desktop (18/page, viewing page 2) to mobile (9/page)
- **THEN** pages are re-paginated for 9 items/page and the view jumps to the page containing the first app that was visible on the previous page 2

#### Scenario: Resize does not mutate saved layout
- **WHEN** a resize causes re-pagination
- **THEN** the saved layout in `ggg_app_layout` is NOT modified
