# Favorites — Tasks

## [x] Task 1: Backend model and security

Create `ggg.favorite` model with fields (name, url, user_id, sequence). Add access rights for `base.group_user` and record rule restricting to own records. Update `__manifest__.py` and `models/__init__.py`.

**Files:**
- `models/ggg_favorite.py` (new)
- `models/__init__.py` (modify)
- `security/ir.model.access.csv` (modify)
- `security/ggg_favorite_rule.xml` (new)
- `__manifest__.py` (modify — add security XML to data)

**Acceptance:**
- Model installs without error
- Users can only CRUD their own favorites

---

## [x] Task 2: Systray "Add to Favorite" component

Create FavoriteMenu OWL component registered in systray registry at sequence 25. Star icon (`fa-star-o`), dropdown with name input (auto-populated from breadcrumb/displayName), read-only URL field (auto-filled from current path), and Save button. Save creates record via ORM and closes dropdown.

**Files:**
- `static/src/webclient/favorite_menu/favorite_menu.js` (new)
- `static/src/webclient/favorite_menu/favorite_menu.xml` (new)
- `static/src/webclient/favorite_menu/favorite_menu.scss` (new)
- `__manifest__.py` (modify — add asset glob for favorite_menu)

**Acceptance:**
- Star icon appears in systray next to activities
- Clicking opens dropdown with auto-populated name and URL
- Save creates `ggg.favorite` record and closes dropdown

---

## [x] Task 3: Favorites section in App Launcher

Add collapsible favorites table at top of AppLauncher. Load favorites via `orm.searchRead` on mount. Table shows name, truncated URL, edit and delete buttons per row. Click row navigates to URL and closes launcher. Show/Hide toggle persists `favoritesCollapsed` in `ggg_app_layout` JSON via layout service.

**Files:**
- `static/src/webclient/app_launcher/app_launcher.js` (modify)
- `static/src/webclient/app_launcher/app_launcher.xml` (modify)
- `static/src/webclient/app_launcher/app_launcher.scss` (modify)
- `static/src/webclient/app_layout_service/app_layout_service.js` (modify — add favoritesCollapsed getter/setter)

**Acceptance:**
- Favorites section appears above app grid
- Click navigates and closes launcher
- Show/Hide persists across sessions
- Empty state: section hidden when no favorites exist

---

## [x] Task 4: Inline edit and delete for favorites

Add inline edit mode to favorite rows. Edit button converts name and URL to inputs with Save/Cancel. Delete button removes record via ORM. Both update local state immediately.

**Files:**
- `static/src/webclient/app_launcher/app_launcher.js` (modify)
- `static/src/webclient/app_launcher/app_launcher.xml` (modify)
- `static/src/webclient/app_launcher/app_launcher.scss` (modify)

**Acceptance:**
- Edit converts row to inline inputs, Save/Cancel work
- Delete removes row and record
- No page reload needed for any operation

---

## [x] Task 5: Unified search (apps + favorites)

Extend the existing search box to filter both apps and favorites. When query is non-empty, show matched favorites in a compact list above matched apps. Match is case-insensitive substring on `favorite.name` and `favorite.url`. Hide sections with no matches. Favorite search results are click-to-navigate only (no edit/delete in search mode).

**Files:**
- `static/src/webclient/app_launcher/app_launcher.js` (modify — extend `_renderSearchResults`)
- `static/src/webclient/app_launcher/app_launcher.xml` (modify — search results template)
- `static/src/webclient/app_launcher/app_launcher.scss` (modify — search results styling)

**Acceptance:**
- Typing in search filters both apps and favorites
- Matched favorites appear above matched apps
- Click favorite result navigates and closes launcher
- No matches in either section hides that section
