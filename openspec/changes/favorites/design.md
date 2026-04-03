# Favorites — Design

## Data Model

### New model: `ggg.favorite`

| Field       | Type                    | Notes                        |
|-------------|-------------------------|------------------------------|
| name        | Char (required)         | User-provided label          |
| url         | Char (required)         | Odoo page URL path           |
| user_id     | Many2one(res.users)     | Owner, default=current user  |
| sequence    | Integer (default=10)    | For future ordering          |

**Security:**
- `ir.model.access`: CRUD for `base.group_user`
- `ir.rule`: domain `[('user_id','=',user.id)]` — users only see/edit their own

### Extend existing: `ggg_app_layout` JSON

Add `favoritesCollapsed` boolean to persist show/hide state:

```json
{
  "showHint": true,
  "favoritesCollapsed": false,
  "pages": [...]
}
```

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│  Systray                                                  │
│  ┌────────────────────┐                                  │
│  │  FavoriteMenu      │  Registered via systray registry │
│  │  (OWL Component)   │  sequence: 25                    │
│  │  • Dropdown        │                                  │
│  │  • Name input      │                                  │
│  │  • URL auto-fill   │                                  │
│  │  • Save via ORM    │                                  │
│  └────────────────────┘                                  │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  AppLauncher (modified)                                   │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Favorites Section (collapsible)                    │  │
│  │  • Loaded from ggg.favorite via ORM                │  │
│  │  • Table: Name | URL | Edit | Delete               │  │
│  │  • Click row → window.location = url, close        │  │
│  │  • Inline edit mode per row                        │  │
│  │  • Collapse state from ggg_app_layout JSON         │  │
│  └────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────┐  │
│  │  App Grid (existing, unchanged)                     │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

## Systray Component: FavoriteMenu

- Icon: `fa-star-o` (outline star)
- Position: `sequence: 25` (right of activities at 20)
- Dropdown opens below-end (standard Odoo Dropdown)
- Contents:
  - Name input — auto-populated from `action.currentController.config.getDisplayName()` or breadcrumb
  - URL input — read-only, auto-filled from `window.location.pathname + window.location.search`
  - Save button — calls `orm.create("ggg.favorite", [{ name, url }])`
  - Close dropdown on save

## Launcher Favorites Section

### Layout

```
★ Favorites (3)                          [Hide]
┌──────────────────────────────────────────────┐
│  Contact Admin     /odoo/contacts/3   [✎][✕] │
│  Sales Q1 Report   /odoo/sales/rep..  [✎][✕] │
│  My Timesheet      /odoo/timesheets   [✎][✕] │
└──────────────────────────────────────────────┘
```

### Inline Edit Mode

When ✎ clicked on a row:

```
│  [Contact Admin___] [/odoo/contacts/3_]  [Save][Cancel] │
```

- Name and URL become text inputs
- Save calls `orm.write("ggg.favorite", [id], { name, url })`
- Cancel reverts to display mode

### Behaviors

- **Click row** (not on buttons): navigate to URL via `browser.location.assign(url)`, close launcher
- **Delete (✕)**: calls `orm.unlink("ggg.favorite", [id])`, removes row
- **Show/Hide toggle**: updates `ggg_app_layout.favoritesCollapsed` via layout service, persists
- **Collapsed view**: `★ Favorites (3) [Show]` — just header with count

### Styling

- Dark theme matching launcher overlay
- Rows: `rgba(255,255,255,0.05)` background, hover `rgba(255,255,255,0.1)`
- Subtle bottom border between rows
- Edit/delete buttons: ghost style, low opacity, full opacity on row hover
- Compact table — no wasted vertical space

## Unified Search

The existing search box filters both apps **and** favorites simultaneously.

### Search Results Layout

When query is non-empty, replace the normal view with a single results page:

```
🔍 [contact________]                         Done

★ Favorites
┌──────────────────────────────────────────────┐
│  Contact Admin      /odoo/contacts/3         │
│  Contact List       /odoo/contacts           │
└──────────────────────────────────────────────┘

Apps
  🟠           📊
  Contacts     ...
```

- Favorites matching the query appear first in their own section
- Apps matching the query appear below in the existing grid
- Match is case-insensitive substring on `favorite.name` and `favorite.url`
- If no favorites match, favorites section is hidden
- If no apps match, apps section is hidden
- Favorite search results are clickable (navigate + close), no edit/delete buttons in search mode

### Implementation

Extend `_renderSearchResults(query)` in `app_launcher.js`:
- Filter `state.favorites` by query (name or URL contains query)
- Store matched favorites in `state.filteredFavorites`
- Existing app filtering stays as-is

## Data Flow

```
Add Favorite:
  FavoriteMenu → orm.create("ggg.favorite") → DB

Open Launcher:
  AppLauncher.setup → orm.searchRead("ggg.favorite") → state.favorites

Edit Favorite:
  Inline edit → orm.write("ggg.favorite") → update state

Delete Favorite:
  Click ✕ → orm.unlink("ggg.favorite") → remove from state

Toggle Collapse:
  Click Show/Hide → layoutService.setFavoritesCollapsed() → saveLayout()
```
