## 1. Module Foundation

- [x] 1.1 Update `__manifest__.py`: change `depends` from `['base']` to `['web']`, add `assets` dict with `web.assets_backend` glob patterns for `static/src/webclient/**/*.{js,xml,scss}`
- [x] 1.2 Create `models/res_users.py` with `ggg_app_layout` Text field, `SELF_READABLE_FIELDS` and `SELF_WRITEABLE_FIELDS` property overrides, update `models/__init__.py` to import it
- [x] 1.3 Create the `static/src/webclient/` directory tree: `navbar/`, `app_launcher/`, `app_layout_service/`

## 2. NavBar Override

- [x] 2.1 Create `webclient/navbar/navbar.xml` — xpath inherit on `web.NavBar.AppsMenu`, replace both mobile and desktop branches with a toggle button + `<AppLauncher>` component
- [x] 2.2 Create `webclient/navbar/navbar.js` — patch `NavBar.prototype` to add `state.gggLauncherOpen`, `toggleGggLauncher()`, `closeGggLauncher()` methods; patch `NavBar` to register `AppLauncher` in components

## 3. AppLayoutService

- [x] 3.1 Create `webclient/app_layout_service/app_layout_service.js` — register `ggg_app_layout` service with dependencies `["menu", "user", "orm"]`
- [x] 3.2 Implement `loadLayout()` — read `ggg_app_layout` from current user via ORM, parse JSON, call `reconcile()`
- [x] 3.3 Implement `reconcile(installedApps)` — diff saved appIds against `menuService.getApps()`, append new apps to last page, remove uninstalled apps, delete empty pages
- [x] 3.4 Implement `getPages(appsPerPage)` — return display-paginated layout (split oversized pages for rendering without mutating saved layout)
- [x] 3.5 Implement `moveApp(fromPage, fromIdx, toPage, toIdx)` — mutate layout in memory after drag
- [x] 3.6 Implement `saveLayout()` — write JSON to `res.users.ggg_app_layout` via ORM, handle first-time-user default (don't persist until first reorder)

## 4. AppLauncher Component — Shell

- [x] 4.1 Create `app_launcher/app_launcher.js` — OWL component with `useService("ggg_app_layout")`, `useService("menu")`, open/close state, Escape key handler, ACTION_MANAGER:UI-UPDATED bus listener
- [x] 4.2 Create `app_launcher/app_launcher.xml` — full-screen overlay template with SearchBar, PageContainer, and DotIndicator sections
- [x] 4.3 Create `app_launcher/app_launcher.scss` — position fixed, z-index 1060, full viewport, fade/scale open animation, backdrop styling

## 5. App Grid Rendering

- [x] 5.1 Create `app_launcher/app_page.js` + `app_page.xml` — component that renders a single page of AppIcon tiles in a CSS grid
- [x] 5.2 Create `app_launcher/app_icon.js` + `app_icon.xml` — component for a single app tile: icon image (webIconData with fallback), name label, click handler calling `menuService.selectMenu(app)`
- [x] 5.3 Add responsive grid SCSS — 3 cols (<576px), 4 cols (576-991px), 6 cols (≥992px), icon sizing, hover lift effect

## 6. Page Navigation (Swipe + Dots)

- [x] 6.1 Implement page container with CSS `translateX` transitions — render all pages side by side, offset by currentPage index
- [x] 6.2 Implement swipe detection — pointer event handlers on PageContainer: track pointerdown X, detect horizontal move > 30px within 300ms, animate page transition
- [x] 6.3 Implement rubber-band effect at page boundaries — elastic overscroll on first/last page that snaps back
- [x] 6.4 Create `app_launcher/dot_indicator.js` + `dot_indicator.xml` — render dots matching page count, highlight current, click-to-jump handler
- [x] 6.5 Implement resize recalculation — listen for viewport resize, recalculate appsPerPage, re-paginate display, jump to page containing first previously-visible app

## 7. Search/Filter

- [x] 7.1 Add search input to launcher header — `t-on-input` handler that filters `menuService.getApps()` by name (case-insensitive substring match)
- [x] 7.2 Implement search render mode — when search query is active, display filtered apps in a flat unpaginated grid (hide dot indicators)
- [x] 7.3 Implement search clear — clearing input restores paginated view at the same page index the user was on before searching

## 8. Gesture State Machine

- [x] 8.1 Implement gesture recognizer — pointer event state machine in AppLauncher: IDLE → PENDING → TAP/SWIPE/DRAG with thresholds (200ms tap, 30px/300ms swipe, 400ms hold for drag)
- [x] 8.2 Wire TAP to app selection, SWIPE to page navigation (from step 6.2), DRAG to reorder initiation

## 9. Drag-to-Reorder

- [x] 9.1 Implement drag visual — on DRAG recognition, create a floating clone of the app icon that follows pointer position with reduced opacity
- [x] 9.2 Implement drop target detection — calculate grid position from pointer coordinates, shift surrounding icons to show gap at drop position
- [x] 9.3 Implement within-page reorder — on drop, call `layoutService.moveApp()` then `layoutService.saveLayout()`
- [x] 9.4 Implement cross-page drag — detect pointer at viewport edge for 500ms, trigger page transition while maintaining drag, allow drop on the new page
- [x] 9.5 Implement drag cancellation — Escape key during drag returns icon to original position without saving

## 10. Polish & Integration

- [x] 10.1 Add open/close animations — CSS transitions for overlay appearance (fade in + scale from 0.95 to 1.0)
- [x] 10.2 Test with vanilla Odoo 19 CE — verify module installs, apps render, navigation works, layout persists across sessions
- [x] 10.3 Test responsive behavior — verify grid columns, page re-pagination, and swipe on mobile viewport sizes
- [x] 10.4 Test edge cases — zero apps, single app, 50+ apps, rapid swipe, concurrent drag+resize
