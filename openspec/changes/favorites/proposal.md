# Favorites

## Problem

Users frequently navigate to specific Odoo pages (e.g., a particular contact, a sales report, a timesheet view). Currently they must navigate through menus every time. There is no way to bookmark pages within Odoo for quick access.

## Solution

Add a **Favorites** feature with two parts:

1. **Systray "Add to Favorite" button** — a star icon in the navbar (next to activities) that opens a dropdown to save the current page URL with a custom name.
2. **Favorites section in the App Launcher** — a collapsible table at the top of the launcher showing all saved favorites with click-to-navigate, inline edit, and delete.
3. **Unified search** — the existing search box filters both apps and favorites, showing matched favorites alongside matched apps.

## Scope

- New `ggg.favorite` model for per-user favorite storage
- New systray component (`fa-star-o`, sequence 25)
- Favorites table in existing AppLauncher component
- Show/hide state persisted in `ggg_app_layout` JSON
- Name auto-populates from page breadcrumb

## Out of Scope

- Favorite icons/colors (all use generic star)
- Sharing favorites between users
- Favorite folders/categories
- Drag-to-reorder favorites (use sequence field for future extensibility)
