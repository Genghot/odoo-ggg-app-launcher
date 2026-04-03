# GGG App Launcher — Module Spec

## Overview

A standalone Odoo 19 module that replaces the Community Edition's app menu (simple text dropdown) with an iOS/Android-style app launcher — full-screen grid of app icons with folders, drag-to-reorder, swipeable pages, and jiggle-mode editing.

## Module Identity

- **Module name:** `ggg_app_launcher`
- **Separate from:** `ggg_theme` (standalone, no dependency on ggg_theme)
- **Depends on:** `web`
- **License:** LGPL-3
- **Author:** GGG Solutions
- **Target:** Odoo 19 Community Edition

---

## Phases

### Phase A — Grid Launcher

**Goal:** Replace the text-only dropdown with a full-screen icon grid.

**Features:**
- Full-screen overlay when clicking the ⊞ icon (replaces Dropdown)
- App icons rendered from `app.webIconData` (already available in Odoo)
- Search/filter bar at top
- Responsive grid (3 cols mobile, 4 tablet, 6 desktop)
- Works on both desktop and mobile
- Swipeable pages (not scroll) when many apps
- Dot indicators at bottom for page navigation
- Fade/scale animation on open/close

**UI Behavior:**
- **Open:** Click ⊞ or hotkey `H` → full-screen overlay
- **Close:** Click outside, press Esc, or click an app
- **Navigate:** Swipe left/right between pages
- **Search:** Type to filter apps across all pages/folders

### Phase B — Drag to Reorder + Persist

**Goal:** Let users customize their app layout with persistence.

**Features:**
- Drag-and-drop to reorder apps within and across pages
- Per-user layout saved to server
- New apps (just installed) auto-append to end
- Uninstalled apps auto-cleanup on read

**Data Model:** JSON field on `res.users`

```json
{
  "pages": [
    {
      "items": [
        { "type": "app", "appId": 5 },
        { "type": "app", "appId": 12 },
        { "type": "app", "appId": 9 }
      ]
    },
    {
      "items": [
        { "type": "app", "appId": 15 },
        { "type": "app", "appId": 20 }
      ]
    }
  ]
}
```

**Field:** `ggg_app_layout` — `fields.Text` on `res.users`, SELF_READABLE + SELF_WRITEABLE.

### Phase C — Folders

**Goal:** iOS/Android-style app folders with jiggle mode.

**Features:**
- Drag one app onto another to create a folder
- Folder shows mini 2×2 preview of contained app icons
- Click folder to open and see contents in a popover/overlay
- Drag apps out of folders back to grid
- Rename folders (click name to edit)
- Empty folders auto-delete
- iOS-style "jiggle mode":
  - Long-press (or dedicated edit button) to enter edit mode
  - Icons wiggle with CSS animation
  - ✕ badges appear on folders for deletion
  - Can drag to reorder or create folders
  - Tap "Done" or press Esc to exit edit mode

**Data Model (folders):**

```json
{
  "pages": [
    {
      "items": [
        { "type": "app", "appId": 5 },
        { "type": "folder", "name": "Operations", "appIds": [8, 3, 22, 17] },
        { "type": "app", "appId": 9 }
      ]
    }
  ]
}
```

---

## Technical Architecture

### Override Approach

Template inherit on `web.NavBar.AppsMenu` — replace `<Dropdown>` with custom `<AppLauncher>` OWL component. Same pattern as MuK's `muk_web_theme`.

```
web.NavBar.AppsMenu (Odoo core)
  └── <Dropdown> with <DropdownItem> text list
        ↓ t-inherit, replace
  └── <AppLauncher> full-screen grid with icons
```

### Odoo Integration Points

| Integration | Source | Usage |
|---|---|---|
| App list | `menuService.getApps()` | Returns `id`, `name`, `webIconData`, `actionID`, `xmlid` |
| Navigate to app | `menuService.selectMenu(app)` | Opens the selected app |
| Override target | `web.NavBar.AppsMenu` template | Replace Dropdown content |
| NavBar component | `navbar.js` | May need patching to inject services |
| App ordering utils | `@web/webclient/menus/menu_helpers` | `computeAppsAndMenuItems()`, `reorderApps()` |
| User persistence | `res.users` model | JSON field for layout |

### Key App Object Properties (from Odoo)

```javascript
{
  id: 5,                    // Menu ID
  name: "Discuss",          // Display name
  webIconData: "data:...",  // Base64 icon image (or default icon path)
  webIcon: "...",           // Icon CSS class/color info
  actionID: 123,            // Action to execute
  xmlid: "mail.action_...", // XML ID
  href: "/odoo/discuss",    // URL path
}
```

### Drag and Drop

Options evaluated:
- **HTML5 Drag & Drop API** — native, no library, clunky on mobile
- **Pointer events + manual tracking** — more control, works on touch ✓
- **SortableJS** — external dependency

Recommendation: **Pointer events** for cross-platform touch+mouse support without external dependencies. Odoo has internal `useSortable` hook patterns in kanban that can be referenced.

### Swipe / Pages

- Track touch start/end X positions for swipe detection
- CSS `transform: translateX()` with transitions for page sliding
- Dot indicators: `● ○ ○` — click or swipe to navigate
- Apps per page: configurable, default ~18 (6 cols × 3 rows desktop) or ~9 (3 cols × 3 rows mobile)

### Jiggle Mode (Phase C)

```css
@keyframes ggg-jiggle {
  0%, 100% { transform: rotate(-1.5deg); }
  50%      { transform: rotate(1.5deg); }
}
.ggg-jiggle-mode .ggg-app-icon {
  animation: ggg-jiggle 0.25s ease-in-out infinite;
}
```

- Triggered by long-press (500ms pointer down without move)
- Or dedicated "Edit" button in the launcher header
- Exit via "Done" button or Esc key

---

## Reference Implementation

MuK modules at `/Users/administrator/Developer/odoo_19/custom_addons/odoo_market/muk/`:

| Module | Relevant Pattern |
|---|---|
| `muk_web_theme` | `AppsMenu` extending Dropdown, grid layout, template inherit on `web.NavBar.AppsMenu`, background image |
| `muk_web_appsbar` | `app_menu` service for app data + reordering, `AppsBar` sidebar component |

Key MuK files:
- `muk_web_theme/static/src/webclient/appsmenu/appsmenu.js` — AppsMenu extends Dropdown
- `muk_web_theme/static/src/webclient/appsmenu/appsmenu.scss` — Flexbox grid layout
- `muk_web_theme/static/src/webclient/navbar/navbar.xml` — Template inherit replacing Dropdown
- `muk_web_theme/static/src/webclient/navbar/navbar.js` — NavBar patch adding appMenuService
- `muk_web_appsbar/static/src/webclient/menus/app_menu_service.js` — App menu data service

---

## UI Mockups

### Grid Launcher (Phase A)

```
┌──────────────────────────────────────────────────┐
│  🔍 Search apps...                          Done │
├──────────────────────────────────────────────────┤
│                                                   │
│    🟠          📊          📈          💰        │
│   Discuss      CRM        Sales     Accounting   │
│                                                   │
│    📦          🏭          🛒          📋        │
│  Inventory     Mfg       Purchase    Project      │
│                                                   │
│    🕐          🌐          🏪          🎫        │
│  Timesheets   Website      POS       Helpdesk    │
│                                                   │
│                 ● ○ ○                             │
└──────────────────────────────────────────────────┘
```

### Folder View (Phase C)

```
┌──────────────────────────────────────────────────┐
│                                                   │
│    🟠          📊         ┌──────┐     💰        │
│   Discuss      CRM       │🏭 📦│   Accounting   │
│                           │📋 🔧│                │
│                           │ Ops  │                │
│                           └──────┘                │
│                              ↑                    │
│                         folder icon               │
│                                                   │
│  Click folder → opens:                            │
│  ┌────────────────────────────┐                   │
│  │  Operations           ✕   │                   │
│  │  🏭 Mfg    📦 Inventory  │                   │
│  │  📋 Project 🔧 Maint     │                   │
│  └────────────────────────────┘                   │
└──────────────────────────────────────────────────┘
```

### Jiggle Mode (Phase C)

```
┌──────────────────────────────────────────────────┐
│  🔍 Search apps...                       [Done]  │
├──────────────────────────────────────────────────┤
│                                                   │
│    🟠˜         📊˜         📈˜         💰˜      │
│   Discuss      CRM        Sales     Accounting   │
│     (wobble)   (wobble)   (wobble)   (wobble)    │
│                                                   │
│   ┌──────┐˜                                       │
│   │🏭 📦│     🕐˜         🌐˜         🏪˜      │
│   │📋 🔧│✕  Timesheets   Website      POS       │
│   │ Ops  │                                        │
│   └──────┘                                        │
│      ↑ ✕ to delete folder                        │
│                                                   │
│  Drag any icon to reorder or drop onto another    │
│  to create a new folder                           │
│                                                   │
│                 ● ○ ○                             │
└──────────────────────────────────────────────────┘
```
