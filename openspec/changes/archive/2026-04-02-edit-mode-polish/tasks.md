## 1. Tap Empty Space to Exit Jiggle Mode

- [x] 1.1 In `onPointerUp`, when `gestureState === GESTURE_PENDING` and `_gestureItemId === null` — if `jiggleMode` is true, call `exitJiggleMode()` and `layoutService.saveLayout()`; if normal mode, call `props.onClose()` to close the launcher
- [x] 1.2 Verify: tap empty space in normal mode closes the launcher

## 2. Remove App from Folder via Popover

- [x] 2.1 Add `onPopoverRemoveApp(folderApp, folderAppIndex)` method — calls `layoutService.removeAppFromFolder()` to extract app to end of folder's page, then saves and re-renders
- [x] 2.2 After removal, if folder no longer exists (auto-unwrap or deleted), close popover
- [x] 2.3 Add ✕ remove badge in `app_launcher.xml` on each `.ggg-popover-app` when `state.jiggleMode` is true
- [x] 2.4 Add `.ggg-popover-remove-badge` SCSS — small red circle, positioned top-right of popover app icon

## 3. Hint Toggle in Jiggle Mode

- [x] 3.1 Add `onToggleHint()` method — toggles `state.showHint` and calls `layoutService.setShowHint()`
- [x] 3.2 Add hint toggle button in `app_launcher.xml` — shown in jiggle mode header next to Done button, text "Show hints" / "Hide hints" based on `state.showHint`
- [x] 3.3 Add `.ggg-hint-toggle-btn` SCSS — subtle styling consistent with Edit/Done buttons

## 4. Testing

- [x] 4.1 Test empty-space tap — in normal mode closes launcher; in jiggle mode exits edit mode
- [x] 4.2 Test popover remove badge — remove app from 3+ app folder, verify app appears on grid
- [x] 4.3 Test auto-unwrap — remove app from 2-app folder, verify folder dissolves and popover closes
- [x] 4.4 Test hint toggle — dismiss hint, enter jiggle mode, tap "Show hints", verify hint reappears and persists across sessions
