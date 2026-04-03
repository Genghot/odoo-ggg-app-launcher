## Why

Phase 1 delivered a functional grid launcher with drag-to-reorder, but the UX lacks discoverability — users don't know they can long-press to reorder. Additionally, power users with many apps (15+) need a way to organize them into groups. This phase adds iOS-style folders, jiggle mode as the single entry point for all editing, and a toggleable user guide hint to teach interactions.

## What Changes

- **Add jiggle mode** — long-press or "Edit" button enters edit mode where all icons wobble. This becomes the sole gate for drag-to-reorder and folder operations. "Done" button or Esc exits. **BREAKING**: removes Phase 1's direct long-press-to-drag behavior (drag now requires jiggle mode)
- **Add app folders** — drag one app onto another to create a folder. Folders show a 2×2 mini-preview of contained icons. Click a folder to open a popover showing its contents. Drag apps out of folders. Rename folders inline. Empty folders auto-delete
- **Add ✕ delete badges** on folders in jiggle mode
- **Add user guide hint** — subtle contextual text at the bottom of the launcher. Content changes by mode (normal → "Hold to rearrange", jiggle → "Drag to reorder · Press Done to finish", search → hidden). Toggleable on/off, preference stored in `ggg_app_layout` JSON
- **Extend data model** — add `type: "folder"` items with `name` and `appIds` to the layout JSON, add `showHint` boolean preference

## Capabilities

### New Capabilities
- `jiggle-mode`: Enter/exit edit mode, wobble animation, Done button, Esc to exit, gates all drag and folder operations
- `folders`: Folder creation by drop-on-app, 2×2 preview icon, popover with contents, drag apps in/out, rename, empty auto-delete, ✕ delete badge in jiggle mode
- `user-guide-hint`: Contextual hint text at launcher bottom, mode-aware content, toggleable on/off with preference persisted in layout JSON

### Modified Capabilities
- `drag-reorder`: Drag-to-reorder now requires jiggle mode to be active (long-press no longer initiates drag directly). Gesture state machine changes: PENDING no longer transitions to DRAG — instead, long-press enters jiggle mode, then drag is free
- `layout-persistence`: Layout JSON extended with `showHint` boolean and `type: "folder"` items. Reconciliation must handle folders (remove appIds of uninstalled apps from folders, delete empty folders)

## Impact

- **app_launcher.js**: Major changes — add jiggle mode state, retrofit gesture system, add folder creation/popover logic
- **app_launcher.xml**: New template sections for folder preview, folder popover, hint bar, Done/Edit buttons, ✕ badges
- **app_launcher.scss**: Jiggle keyframe animation, folder styles, popover styles, hint bar styles
- **app_layout_service.js**: Extend reconcile to handle folder items, add createFolder/deleteFolder/renameFolder/moveAppToFolder/moveAppFromFolder methods
- **Layout JSON schema**: Breaking change — old layouts without `showHint` must default to `true`. Folders are additive (old layouts have no folders, which is valid)
