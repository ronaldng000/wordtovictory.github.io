# Implementation Plan: Repair Bible Track record storage and tests

## Overview

Make the Bible Track suite able to load the app, then give chapter progress one write path so toggle, Clear All, and Load all persist a complete chapter map. Imported JSON is checked before it touches storage. The catalog names `Isiah` and `Phillipians` become `Isaiah` and `Philippians`, and existing `localStorage` keys move with them.

This plan covers the required findings from the review of `Bug-fix` at `744235c`. It does not add features.

## Assumptions

1. Scope is those required findings. Performance memoization, `npm audit` fixes, layout changes, and drive-by nits stay out.
2. Dead files and commented blocks stay until you ask to remove them.
3. A bad import leaves both React state and `localStorage` as they were, and the screen shows an error line under the load button.
4. An empty `readStatus` object is a valid import and means every chapter is unread.
5. If both an old spelling key and a new spelling key exist, the new key wins and the old key is removed.
6. No new dependencies. Tests use Jest and Testing Library, already in the repo.

## Architecture Decisions

- Add `src/bible/readingRecord.js` as the only reader and writer of chapter progress. `Dashboard`, `BookRecord`, and `ControlPanel` call it. They stop calling `localStorage` themselves.
- A record is a complete map: every `Book.name + "_" + chapter` from `BOOKS`, value a boolean. Absent keys are unread. Storage values are the strings `"true"` and `"false"`.
- `writeRecord` normalizes to that complete map, writes every known key, and returns the map used for React state. Toggle, clear, and a successful load all end in `writeRecord`.
- `parseImport` accepts only the file shape this app already saves: a one-element array whose `readStatus` is an object. Every key must be a real chapter id. Every value must be a boolean. Any other shape fails the whole file. Omitted chapters become `false` only after the file is accepted.
- Rename the two books in `src/bible/constants.ts`. `readRecord` copies `Isiah_N` to `Isaiah_N` and `Phillipians_N` to `Philippians_N` when the new key is absent, then removes the old key. When both exist, it keeps the new key and removes the old one.
- Show load failures as text with `role="alert"` in `ControlPanel`. Do not use `window.alert`.

## Task List

### Phase 1: Suite can load the app

- [x] Task 1: Let the suite render Bible Track

### Checkpoint: Suite is green

- [x] `CI=true npm test -- --watchAll=false` passes
- [x] `npm run build` succeeds
- [x] Review with human before proceeding

### Phase 2: One record writer

- [x] Task 2: Persist a chapter toggle through the record module
- [x] Task 3: Make clear and load replace the whole record

### Checkpoint: Record flow

- [x] Toggle, clear, full load, partial load, and a bad file are covered by tests
- [x] `CI=true npm test -- --watchAll=false` passes
- [x] `npm run build` succeeds
- [x] Manual check of toggle, clear, and load
- [ ] Review with human before proceeding

### Phase 3: Catalog names

- [x] Task 4: Rename Isaiah and Philippians and migrate stored keys

### Checkpoint: Complete

- [x] Old spelling keys migrate and the buttons show the corrected names
- [x] `CI=true npm test -- --watchAll=false` passes
- [x] `npm run build` succeeds
- [ ] Ready for review

## Out of scope

- Deleting `src/App-archive.js`, unused exports in `constants.ts`, commented footer markup, or duplicate favicons
- Memoizing book rows
- Removing `console.log`, replacing `BOOKS.map` side effects, or changing `getButtonColor`, except where a function rewritten for a task above would otherwise keep that code
- Dependency upgrades and `npm audit`
- Splitting the grid into Old Testament and New Testament
- Changing the AppBar color

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Renaming a book orphans `Isiah_*` and `Phillipians_*` progress | High | Migrate inside `readRecord` in the same task as the rename. Test both “old key only” and “both keys exist”. |
| A partial import wipes progress the file simply omitted | High | Reject unknown keys and non-booleans. Apply omitted-as-unread only after the file is valid, and only through `writeRecord`. |
| A bad import still writes some keys before throwing | High | Parse and validate the whole file before any `setItem`. On failure, do not call `writeRecord`. |
| jsdom leaks `localStorage` between tests | Med | `localStorage.clear()` in `beforeEach`. |
| File-input tests are brittle | Med | Drive the hidden input with Testing Library’s `upload`. Assert storage and the error text, not the download library. |

## Open Questions

- Dead code listed in the review (`App-archive.js`, unused `BookChapter` helpers, commented social links, duplicate favicons): leave it. Say if you want a fifth task to remove it.
- Load error copy: default is “That file is not a Bible Track record.” Say if you want different wording.

## Parallelization

Tasks 2, 3, and 4 share `readingRecord.js` and the test file. Run them in order. Task 1 is the only foundation, and it blocks the rest because the suite cannot import `App` today.
