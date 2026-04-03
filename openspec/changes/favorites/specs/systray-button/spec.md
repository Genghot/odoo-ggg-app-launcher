# Systray "Add to Favorite" Spec

## Component: FavoriteMenu

- Registered in `systray` registry with key `ggg_app_launcher.favorite_menu`, sequence 25
- Uses Odoo `Dropdown` component (position `bottom-end`)

## Template

```
┌─────────────────────────┐
│  Add to Favorites       │
│                         │
│  Name:                  │
│  [auto-populated input] │
│                         │
│  URL:                   │
│  [/odoo/contacts/3    ] │  ← read-only, dimmed
│                         │
│         [★ Save]        │
└─────────────────────────┘
```

## Behavior

### Auto-populate Name
- Use `env.services.action.currentController.config.getDisplayName()` if available
- Fallback: extract last breadcrumb name
- Fallback: use URL path segments as name

### Auto-fill URL
- Capture `browser.location.pathname + browser.location.search`
- Strip origin, keep relative path
- Display as read-only input (user can see but not accidentally break it)

### Save
- Validate name is not empty
- Call `orm.create("ggg.favorite", [{ name, url }])`
- Close dropdown
- No toast/notification needed (the action is fast and obvious)

### Edge Cases
- If name is empty on save: focus the name input, do not save
- If already on a page with no meaningful name: leave name blank for user to fill
