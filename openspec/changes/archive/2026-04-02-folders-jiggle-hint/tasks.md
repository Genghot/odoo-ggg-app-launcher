## 1. Layout Service — Folder & Hint Extensions

- [x] 1.1 Add `showHint` support to `loadLayout()` — default to `true` if missing from JSON
- [x] 1.2 Add `getShowHint()` and `setShowHint(value)` methods — `setShowHint` persists immediately
- [x] 1.3 Extend `reconcile()` to handle folder items — filter uninstalled appIds from folders, unwrap single-app folders, delete empty folders
- [x] 1.4 Add `createFolder(pageIdx, targetIdx, draggedAppId, fromPage, fromIdx)` — create folder from two apps
- [x] 1.5 Add `deleteFolder(pageIdx, folderIdx)` — delete folder and insert contained apps at folder position
- [x] 1.6 Add `addAppToFolder(pageIdx, folderIdx, appId, fromPage, fromIdx)` — move app into existing folder
- [x] 1.7 Add `removeAppFromFolder(pageIdx, folderIdx, appIdxInFolder, toPage, toIdx)` — extract app from folder, auto-unwrap if 1 remaining
- [x] 1.8 Add `renameFolder(pageIdx, folderIdx, newName)` — update folder name (reject empty)

## 2. Jiggle Mode — State & Animation

- [x] 2.1 Add `jiggleMode` boolean to AppLauncher state, add `enterJiggleMode()` and `exitJiggleMode()` methods
- [x] 2.2 Add Edit/Done toggle button in launcher header — Edit visible in normal mode, Done visible in jiggle mode
- [x] 2.3 Add jiggle CSS keyframe animation (`ggg-jiggle`, ±1.5deg rotation, 0.25s) applied to all `.ggg-app-icon-wrapper` elements when `.ggg-jiggle-mode` is on the container
- [x] 2.4 Wire Escape key — if jiggle mode active (no drag), exit jiggle mode; if drag active, cancel drag
- [x] 2.5 Wire app tap in jiggle mode — open app AND exit jiggle mode

## 3. Gesture System Retrofit

- [x] 3.1 Modify `onPointerDown` — in normal mode, long-press (400ms hold) enters jiggle mode instead of starting drag
- [x] 3.2 Modify `onPointerDown` — in jiggle mode, any pointermove > 5px immediately initiates drag (no hold timer)
- [x] 3.3 Remove direct `GESTURE_DRAG` transition from `PENDING` state in normal mode

## 4. Folder Rendering

- [x] 4.1 Add folder 2×2 preview template in `app_launcher.xml` — render folder items with 4 mini app icons inside a rounded container, folder name below
- [x] 4.2 Add folder preview SCSS — 2×2 CSS grid inside `.ggg-app-icon`, scaled-down images, gray placeholder for empty slots
- [x] 4.3 Handle folder click in normal mode — open folder popover (set `openFolderIdx` state)

## 5. Folder Popover

- [x] 5.1 Add folder popover template in `app_launcher.xml` — positioned overlay anchored to folder icon, showing folder name (editable) and app grid (max 3×3)
- [x] 5.2 Add folder popover SCSS — anchored positioning (above/below based on viewport half), backdrop, arrow indicator
- [x] 5.3 Add popover app click handler — open app, close popover, close launcher
- [x] 5.4 Add popover close — click outside or Escape closes popover
- [x] 5.5 Add folder rename — click folder name in popover to edit, Enter/blur saves, empty reverts

## 6. Folder Creation via Drag

- [x] 6.1 Add folder creation zone detection — during drag in jiggle mode, track 300ms hover over another app icon
- [x] 6.2 Add folder creation zone visual — target icon scales up with highlight ring after 300ms dwell
- [x] 6.3 On drop on folder zone — call `layoutService.createFolder()`, save, re-render
- [x] 6.4 On drop on existing folder — call `layoutService.addAppToFolder()`, save, re-render

## 7. Folder Editing in Jiggle Mode

- [x] 7.1 Add ✕ delete badge on folder icons in jiggle mode — positioned top-left, click calls `layoutService.deleteFolder()`
- [x] 7.2 Enable drag-out from folder popover in jiggle mode — dragging an app from popover onto grid calls `layoutService.removeAppFromFolder()`
- [x] 7.3 Handle single-app folder auto-unwrap — after any removal, if folder has 1 app, auto-replace folder with that app

## 8. User Guide Hint

- [x] 8.1 Add hint bar template in `app_launcher.xml` — positioned below dot indicators, shows text and dismiss "×" button
- [x] 8.2 Add hint bar SCSS — subtle styling, small font, semi-transparent text, centered
- [x] 8.3 Add mode-aware hint text — normal: "Hold an app to rearrange", jiggle: "Drag to reorder · Drop on another to folder · Press Done to finish"
- [x] 8.4 Hide hint during search and when folder popover is open
- [x] 8.5 Wire dismiss button — call `layoutService.setShowHint(false)`, hide hint bar
- [x] 8.6 Read `showHint` from layout service on mount — only render hint bar if true

## 9. Polish & Testing

- [x] 9.1 Test jiggle mode enter/exit flow — long-press, Edit button, Done button, Escape, app tap
- [x] 9.2 Test folder lifecycle — create by drop-on-app, add apps, rename, drag out, auto-unwrap, delete via badge
- [x] 9.3 Test reconciliation with folders — uninstall app that's inside a folder, verify cleanup
- [x] 9.4 Test hint bar — visible by default, dismissable, stays hidden across sessions, mode-aware text changes
- [x] 9.5 Test backward compatibility — Phase 1 layout JSON (no folders, no showHint) loads correctly
