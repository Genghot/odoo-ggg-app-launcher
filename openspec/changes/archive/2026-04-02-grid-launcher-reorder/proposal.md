## Why

Odoo 19 Community Edition's app menu is a plain text dropdown — no icons, no customization, no mobile-friendly grid. Users with 10+ installed modules waste time scanning a flat list. This module replaces it with an iOS/Android-style full-screen app launcher with icon grid, swipeable pages, drag-to-reorder, and per-user layout persistence.

## What Changes

- **Replace the default app menu** (`web.NavBar.AppsMenu` Dropdown) with a standalone full-screen `AppLauncher` OWL component via xpath template inheritance
- **Add icon grid rendering** using `app.webIconData` from Odoo's menu service, with responsive columns (3 mobile / 4 tablet / 6 desktop)
- **Add swipeable page navigation** with CSS transform transitions, dot indicators, and touch/pointer support
- **Add search/filter bar** that filters apps across all pages in real-time
- **Add drag-to-reorder** using pointer events for cross-platform touch+mouse support
- **Add per-user layout persistence** via a new `ggg_app_layout` JSON Text field on `res.users` (SELF_READABLE + SELF_WRITEABLE)
- **Add an `AppLayoutService`** (OWL service) that manages layout state, reconciles newly installed/uninstalled apps, and persists to server
- **Patch `NavBar`** to register the new component and inject launcher open/close state

## Capabilities

### New Capabilities
- `app-grid-ui`: Full-screen overlay with responsive icon grid, open/close animations, search bar, and app selection
- `page-navigation`: Swipeable page system with CSS translateX transitions, dot indicators, responsive items-per-page calculation, and resize recalculation
- `drag-reorder`: Pointer-event-based drag-to-reorder within and across pages, with gesture disambiguation (tap vs swipe vs drag)
- `layout-persistence`: Per-user layout storage in `res.users`, AppLayoutService for state management, reconciliation of new/removed apps, and save-on-drop

### Modified Capabilities

_None — this is a new module with no existing specs._

## Impact

- **Odoo core override**: Template inherit on `web.NavBar.AppsMenu` — replaces the Dropdown for both desktop and mobile. Other modules that also override this template may conflict.
- **NavBar patch**: Adds state properties and methods to `NavBar.prototype` and registers `AppLauncher` in `NavBar.components`.
- **`res.users` model extension**: Adds `ggg_app_layout` Text field. No migration needed (new field, defaults to empty).
- **Dependencies**: Requires `web` module (not just `base`) for asset bundle access.
- **No external JS libraries**: All drag/swipe handling uses native pointer events.
- **Asset bundle**: All JS/XML/SCSS loaded via `web.assets_backend` glob patterns.
