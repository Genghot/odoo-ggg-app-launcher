# Launcher Favorites Section Spec

## Layout

Favorites section sits between the header (search bar) and the page viewport (app grid).

### Expanded (has favorites)

```
★ Favorites                                    [Hide]
┌────────────────────────────────────────────────────┐
│  Contact Admin      /odoo/contacts/3      [✎] [✕]  │
│  Sales Q1 Report    /odoo/sales/report    [✎] [✕]  │
│  My Timesheet       /odoo/timesheets      [✎] [✕]  │
└────────────────────────────────────────────────────┘
```

### Collapsed

```
★ Favorites (3)                                [Show]
```

### No favorites

Section is completely hidden — no empty state message.

## Behaviors

### Load
- On launcher mount: `orm.searchRead("ggg.favorite", [], ["name", "url", "sequence"], { order: "sequence, id" })`
- Store in `state.favorites` array

### Click row
- `browser.location.assign(favorite.url)`
- Close launcher via `props.onClose()`

### Toggle collapse
- Updates `ggg_app_layout.favoritesCollapsed` via layout service
- Persists immediately

### URL display
- Truncate with ellipsis if longer than ~30 chars
- Show full URL as title attribute on hover

## Inline Edit

### Enter edit mode
- Click ✎ on a row
- `state.editingFavoriteId = favorite.id`
- Row switches to input mode:

```
│  [Contact Admin___] [/odoo/contacts/3____]  [Save] [Cancel] │
```

### Save edit
- Validate name not empty
- `orm.write("ggg.favorite", [id], { name, url })`
- Exit edit mode, update local state

### Cancel edit
- Revert inputs to original values
- Exit edit mode

### Delete
- `orm.unlink("ggg.favorite", [id])`
- Remove from `state.favorites`
- If last favorite deleted: section disappears

## Search Integration

The existing search box filters both apps and favorites.

### Behavior
- When search query is non-empty, filter `state.favorites` by case-insensitive substring match on `name` or `url`
- Show matched favorites in a compact list above matched apps
- Favorite search results: click to navigate + close (no edit/delete buttons)
- If no favorites match the query: hide favorites section in results
- If no apps match: hide apps section in results

### Search Results Layout

```
★ Favorites
┌──────────────────────────────────────────┐
│  Contact Admin      /odoo/contacts/3     │
│  Contact List       /odoo/contacts       │
└──────────────────────────────────────────┘

Apps
  🟠           📊
  Contacts     ...
```

## Styling

- Section background: transparent (inherits launcher dark overlay)
- Header: `★ Favorites` in `rgba(255,255,255,0.6)`, 13px, uppercase tracking
- Toggle button: same ghost style as Edit/Done buttons
- Table rows:
  - Background: `rgba(255,255,255,0.05)`
  - Hover: `rgba(255,255,255,0.1)`
  - Border-bottom: `1px solid rgba(255,255,255,0.08)`
  - Cursor: pointer
- Name column: white text, 13px
- URL column: `rgba(255,255,255,0.4)`, 12px, monospace
- Action buttons: `rgba(255,255,255,0.3)`, visible on row hover at full opacity
- Edit inputs: same style as search bar input (dark bg, white text, rounded)
- Max height: ~150px with overflow-y auto (scroll if many favorites)
