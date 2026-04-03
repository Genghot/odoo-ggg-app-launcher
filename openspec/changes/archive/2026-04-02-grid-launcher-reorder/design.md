## Context

Odoo 19 CE's app menu is a `Dropdown` component in `web.NavBar.AppsMenu` that renders a flat text list of installed apps. This module replaces it with a full-screen iOS/Android-style app launcher. The reference implementation is MuK's `muk_web_theme` which extends `Dropdown` for a grid layout — but our requirements (swipeable pages, drag-to-reorder, per-user persistence) demand a different architecture.

The core NavBar uses `useState` with `isAllAppsMenuOpened` and `isAppMenuSidebarOpened` for its mobile sidebar. Our patch adds to this existing state. The `menuService.getApps()` returns app objects with `id`, `name`, `webIconData`, `actionID`, `xmlid`, and `href` — these are our rendering inputs.

## Goals / Non-Goals

**Goals:**
- Replace the default app menu on both desktop and mobile with a single responsive component
- Render app icons in a responsive grid (3/4/6 columns) with swipeable page navigation
- Allow drag-to-reorder with per-user layout persistence
- Search/filter apps across all pages
- Zero external JS dependencies (pointer events only)
- Compatible with vanilla Odoo 19 CE — no theme dependency

**Non-Goals:**
- Folders and jiggle mode (Phase 2 — separate change)
- Admin-defined default layouts (each user gets their own)
- Customizable icon appearance (we use Odoo's existing `webIconData`)
- Home screen widgets or shortcuts beyond app icons

## Decisions

### 1. Standalone OWL component vs. extending Dropdown

**Decision:** Standalone `AppLauncher` component, not extending `Dropdown`.

**Why:** The launcher is a full-screen overlay with swipeable pages — fundamentally different from a dropdown. Extending `Dropdown` would fight its positioning logic, overflow handling, and close behavior. MuK extends Dropdown because their grid is still conceptually a dropdown. Ours is an iOS home screen.

**Alternative considered:** Extend `Dropdown` (MuK pattern). Rejected because page transitions with `translateX` conflict with dropdown overflow, and the gesture system (swipe vs drag vs tap) needs full control over pointer events that Dropdown's click-outside handler would interfere with.

### 2. Override scope — desktop + mobile unified

**Decision:** Replace the entire `web.NavBar.AppsMenu` template (both mobile and desktop branches) with a single component that handles responsiveness internally.

**Why:** The spec requires the launcher on both desktop and mobile with responsive columns. Two separate overrides (one for mobile sidebar, one for desktop dropdown) would duplicate logic. One component with CSS-driven responsive grid is simpler.

**xpath target:** `//div[hasclass('o_navbar_apps_menu')]/..` with `position="replace"` to capture the full `t-if/t-else` block.

### 3. Page model — explicit pages with display-time re-pagination

**Decision:** The persisted layout uses explicit `pages[]` arrays (matching the spec's JSON model). On render, if a page exceeds the current screen's items-per-page limit, overflow items are temporarily pushed to a virtual next page. The saved layout is not mutated by resize.

**Why:** Explicit pages let users intentionally organize apps across pages. Pure auto-chunking (flat list ÷ items-per-page) loses that intent. Re-pagination on resize is a display concern only.

**Items per page by breakpoint:**
| Breakpoint | Columns | Rows | Items/page |
|-----------|---------|------|------------|
| Mobile (<576px) | 3 | 3 | 9 |
| Tablet (576-991px) | 4 | 3 | 12 |
| Desktop (≥992px) | 6 | 3 | 18 |

### 4. Gesture disambiguation — state machine

**Decision:** A pointer-event state machine with three exclusive outcomes: TAP, SWIPE, DRAG.

```
IDLE → pointerdown → PENDING
PENDING → pointerup < 200ms, move < 10px → TAP (open app)
PENDING → horizontal move > 30px within 300ms → SWIPE (change page)
PENDING → hold > 400ms, move < 10px → DRAG (reorder mode)
```

Once a gesture is recognized, others are locked out until `pointerup` resets to IDLE. Swipe on empty grid space always triggers SWIPE (no ambiguity).

**Alternative considered:** Only enable drag in a dedicated edit/jiggle mode (Phase 2). Rejected because the spec merges Phase A+B, and requiring a mode toggle for reorder adds friction.

### 5. AppLayoutService — centralized state

**Decision:** A registered OWL service (`ggg_app_layout`) that owns all layout state, handles reconciliation, and persists to `res.users.ggg_app_layout`.

**Service API:**
- `loadLayout()` — fetch from server, reconcile with installed apps
- `getPages(appsPerPage)` — return display-paginated layout
- `moveApp(fromPage, fromIdx, toPage, toIdx)` — mutate layout after drag
- `saveLayout()` — persist to server via ORM write
- `reconcile(installedApps)` — add new apps to last page, remove uninstalled

**Reconciliation rules:**
- First-time user (no saved layout): build default from `menuService.getApps()`, don't persist until first reorder
- New apps since last save: append to last page (overflow to new page if full)
- Uninstalled apps: remove from layout on read, persist cleaned version on next save

### 6. Persistence field — Text on res.users

**Decision:** `ggg_app_layout = fields.Text()` on `res.users`, exposed via `SELF_READABLE_FIELDS` + `SELF_WRITEABLE_FIELDS` properties.

**Why:** JSON stored as Text is the simplest approach — no new model, no relations, no migration complexity. SELF_READABLE/WRITEABLE allows the frontend to read/write via standard `user` service RPC without sudo.

**Alternative considered:** Separate model `ggg.app.layout` with user_id FK. Rejected — adds unnecessary complexity for what is essentially a user preference blob.

### 7. Search behavior — view-level filter, not service mutation

**Decision:** Search filters the app list at the component level without touching the layout service. Results are displayed as a flat, unpaginated grid. Clearing search returns to the user's saved page layout at the same page index.

### 8. Component tree

```
NavBar (patched)
├── button.ggg-launcher-toggle (hotkey "h")
└── AppLauncher (position:fixed, z-index:1060, full-screen)
    ├── SearchBar (input + clear button)
    ├── PageContainer (overflow:hidden, pointer events for swipe)
    │   └── AppPage × N (inline, translateX for positioning)
    │       └── AppIcon × N (grid items)
    └── DotIndicator (● ○ ○, click to jump)
```

**z-index choice:** 1060 — above Odoo modals (1050), below notifications (1100). Using `position: fixed` on `<body>` avoids stacking context issues from being nested inside NavBar.

### 9. Asset registration

```python
'assets': {
    'web.assets_backend': [
        'ggg_app_launcher/static/src/webclient/**/*.js',
        'ggg_app_launcher/static/src/webclient/**/*.xml',
        'ggg_app_launcher/static/src/webclient/**/*.scss',
    ],
},
```

Glob patterns match the MuK convention and auto-include all files in the webclient tree.

## Risks / Trade-offs

**[Template conflict]** Other modules overriding `web.NavBar.AppsMenu` (e.g., `muk_web_theme`, enterprise `web_enterprise`) will conflict. → Mitigation: Document incompatibility. Users must choose one app menu override. Add `excludes` or load-order hints if needed.

**[Pointer event complexity]** The gesture state machine (tap/swipe/drag) adds interaction complexity, especially on mobile. → Mitigation: Conservative thresholds (30px swipe, 400ms hold), extensive manual testing on touch devices.

**[Layout data integrity]** If `menuService.getApps()` returns different IDs than what's stored in the layout (e.g., after module uninstall), stale references could cause rendering issues. → Mitigation: Reconciliation runs on every load, filtering out unknown appIds before rendering.

**[Performance with many apps]** Users with 30+ apps will have 2-4 pages. CSS translateX transitions and pointer tracking should handle this fine, but DOM node count per page could matter on low-end devices. → Mitigation: Only render current page ± 1 adjacent pages (lazy rendering).

**[No undo for reorder]** Drag-to-reorder saves immediately on drop. No undo. → Mitigation: Acceptable for a preference — users can re-drag. Phase 2 jiggle mode could add a "reset to default" option.
