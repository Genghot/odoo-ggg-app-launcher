## Context

Phase 1 (`grid-launcher-reorder`) delivered a full-screen app launcher with icon grid, swipeable pages, search, and drag-to-reorder via long-press. The gesture state machine in `app_launcher.js` handles TAP/SWIPE/DRAG transitions. The layout service persists per-user JSON to `res.users.ggg_app_layout`.

This phase adds three features: jiggle mode (edit mode gate), app folders, and a user guide hint. The main challenge is retrofitting the existing gesture system and extending the layout data model without breaking existing saved layouts.

## Goals / Non-Goals

**Goals:**
- Add jiggle mode as the single entry point for all editing (drag, folder creation, deletion)
- Support iOS-style app folders with create, open, rename, drag-in/out, auto-delete
- Show contextual user guide hint that adapts to current mode and can be toggled off
- Maintain backward compatibility with Phase 1 layout JSON (additive changes only)

**Non-Goals:**
- Nested folders (folders inside folders)
- Admin-managed shared folder templates
- Folder color customization or custom icons
- Animated folder open/close transitions (keep it simple — popover only)

## Decisions

### 1. Jiggle mode gates all editing — retrofit gesture system

**Decision:** Remove the `GESTURE_DRAG` transition from `PENDING` state. Instead, long-press (400ms hold) enters jiggle mode. Once in jiggle mode, any `pointerdown + pointermove` on an icon initiates drag immediately (no hold required).

**Current gesture flow (Phase 1):**
```
IDLE → pointerdown → PENDING
PENDING → hold 400ms → DRAG (direct drag)
```

**New gesture flow (Phase 2):**
```
Normal mode:
  IDLE → pointerdown → PENDING
  PENDING → hold 400ms → enter JIGGLE MODE (no drag yet)
  PENDING → tap → open app
  PENDING → swipe → page nav

Jiggle mode:
  IDLE → pointerdown → PENDING
  PENDING → any pointermove > 5px → DRAG (immediate, no hold)
  PENDING → tap on app → open app + exit jiggle
  PENDING → tap on empty → no-op
  PENDING → swipe → page nav
```

**Why:** iOS uses jiggle mode as a clear visual state. Users see icons wobbling and understand "I'm in edit mode." Without it, the drag interaction is invisible and undiscoverable — hence the need for the hint.

### 2. Folder creation — drop detection zone

**Decision:** When dragging an icon in jiggle mode, hovering over another app icon for 300ms triggers a "folder creation zone" visual (the target icon scales up and shows a highlight ring). Dropping there creates a new folder containing both apps.

**Why not instant?** Accidental folder creation would be frustrating. The 300ms dwell time + visual feedback gives the user a chance to move away.

**Folder naming:** Auto-generated name "Folder" (editable). iOS auto-names based on app categories, but Odoo app categories are inconsistent — a generic default is safer.

### 3. Folder popover — inline overlay, not a modal

**Decision:** Clicking a folder opens an inline popover positioned above/below the folder icon (not a full-screen modal). The popover shows folder contents in a small grid (max 3×3). Clicking an app in the popover opens it and closes both popover and launcher.

```
┌──────────────────────────────────────┐
│                                       │
│   📊    ┌────────────────┐    💰     │
│   CRM   │  Operations    │   Acc     │
│         │  🏭 📦 📋 🔧  │           │
│         │                │           │
│         └────────────────┘           │
│         ← popover anchored           │
│            to folder icon            │
│                                       │
└──────────────────────────────────────┘
```

**Why not full-screen?** Keeps context — the user can see where the folder is in the grid. A modal feels heavy for browsing 2-6 apps inside a folder.

**In jiggle mode:** the popover also allows dragging apps out of the folder back onto the grid.

### 4. Folder 2×2 preview rendering

**Decision:** Folder icons render as a rounded-rect container with a 2×2 mini-grid of the first 4 app icons inside (scaled down). If the folder has fewer than 4 apps, empty slots show as light gray placeholders.

```
┌─────────┐
│ 🏭  📦  │
│ 📋  ░░  │  ← 3 apps + empty slot
│  Ops    │
└─────────┘
```

**Implementation:** A CSS grid inside the `.ggg-app-icon` container, using `<img>` elements scaled to 50% of the normal icon size.

### 5. Layout JSON extension — backward compatible

**Decision:** Add `showHint` to the root object and support `type: "folder"` items. Old layouts without these fields are handled gracefully.

```json
{
  "showHint": true,
  "pages": [
    {
      "items": [
        { "type": "app", "appId": 5 },
        { "type": "folder", "name": "Operations", "appIds": [8, 3, 22] },
        { "type": "app", "appId": 9 }
      ]
    }
  ]
}
```

**Migration:** No server-side migration needed. On `loadLayout()`:
- If `showHint` is missing → default to `true`
- If no folder items exist → that's valid (same as Phase 1)
- Existing layouts continue to work without modification

### 6. Folder reconciliation

**Decision:** Extend the existing `reconcile()` function to handle folders:
- For each folder item, filter out `appIds` that are no longer installed
- If a folder has 0 apps after filtering → delete the folder item
- If a folder has 1 app after filtering → unwrap (replace folder with the single app item)
- New apps still append to last page as bare app items (never auto-added to folders)

### 7. User guide hint — in layout JSON, default on

**Decision:** Store `showHint: boolean` in the `ggg_app_layout` JSON blob. Default `true` for new users and existing users without the field. A small "×" dismiss button on the hint bar sets it to `false` and persists.

**Hint content by mode:**
| Mode | Text |
|------|------|
| Normal | "Hold an app to rearrange" |
| Jiggle | "Drag to reorder · Drop on another to folder · Press Done to finish" |
| Search | _(hidden)_ |
| Folder popover open | _(hidden)_ |

### 8. Component changes — keep single component, add sub-templates

**Decision:** Keep AppLauncher as a single OWL component (no new sub-components for folders or hint). Use inline template blocks (`t-call` or inline XML) for folder preview, folder popover, and hint bar. This avoids prop-drilling the complex jiggle/drag state through component boundaries.

**Exception:** The folder popover could become its own component if it gets complex, but start inline and extract if needed.

## Risks / Trade-offs

**[Gesture retrofit]** Changing long-press from "start drag" to "enter jiggle" changes Phase 1 behavior. → Mitigation: Jiggle mode is strictly better UX. The hint text makes the new flow discoverable.

**[Folder creation accidental]** Users might accidentally create folders while reordering. → Mitigation: 300ms dwell time + visual feedback before folder creation commits.

**[Popover positioning]** The folder popover needs to position itself relative to the folder icon without clipping at viewport edges. → Mitigation: Use simple above/below logic — if folder is in the top half of viewport, show popover below; otherwise above.

**[Performance with many folders]** Each folder renders a 2×2 preview grid with 4 images. With 10 folders that's 40 extra images. → Mitigation: Images are already loaded (same `webIconData` as the grid). No extra network requests.

**[Single-app folder edge case]** User drags one app out of a 2-app folder, leaving 1. → Mitigation: Auto-unwrap — replace the folder with the remaining single app. Matches iOS behavior.

## Migration Plan

1. **Deploy:** Update module, restart Odoo. No server-side migration needed.
2. **Existing layouts:** Old JSON without `showHint` or folder items works as-is. `loadLayout()` fills defaults.
3. **Rollback:** Downgrading to Phase 1 code would ignore `showHint` and folder items in JSON. Folders would be invisible but data wouldn't be lost. Re-upgrading would restore them.
