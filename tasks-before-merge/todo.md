# Tasks: Repair Bible Track record storage and tests

Full plan: `tasks/plan.md`.

Commands below run from the repository root.

## Task 1: Let the suite render Bible Track

**Description:** Remove the unused `react-social-icons` imports that stop Jest from loading `App`, and replace the Create React App “learn react” assertion with a smoke check that the dashboard rendered.

**Acceptance criteria:**
- [ ] `src/header/Footer.js` no longer imports `react-social-icons`
- [ ] `src/App.test.js` renders `App` and finds the text `Genesis` and `0 of 1189 chapters read`
- [ ] The suite completes assertions instead of failing during import

**Verification:**
- [ ] Tests pass: `CI=true npm test -- --watchAll=false`
- [ ] Build succeeds: `npm run build`
- [ ] Manual check: `npm start` shows the book grid and the chapter total

**Dependencies:** None

**Files likely touched:**
- `src/header/Footer.js`
- `src/App.test.js`

**Estimated scope:** Small: 1-2 files

## Checkpoint: After Task 1

- [ ] `CI=true npm test -- --watchAll=false` passes
- [ ] `npm run build` succeeds
- [ ] The page shows Genesis and the chapter total
- [ ] Review with human before proceeding

## Task 2: Persist a chapter toggle through the record module

**Description:** Add `src/bible/readingRecord.js` and route the initial load and chapter toggle through it. A toggle writes the full chapter map to `localStorage` and React state, using `"true"` and `"false"` for every known chapter.

**Acceptance criteria:**
- [ ] `readRecord` returns a boolean for every chapter in `BOOKS`. A missing key is `false`. Only the stored string `"true"` is read.
- [ ] `writeRecord` stores every known chapter and returns that same complete map
- [ ] `Dashboard` initializes state from `readRecord`. `BookRecord` toggles by writing the full map through `writeRecord`
- [ ] Clicking Genesis chapter 1 marks that chapter read, stores `Genesis_1` as `"true"`, and the statistics line shows `1 of 1189 chapters read`
- [ ] Remounting `App` shows Genesis 1 still read

**Verification:**
- [ ] Tests pass: `CI=true npm test -- --watchAll=false`
- [ ] Build succeeds: `npm run build`
- [ ] Manual check: toggle a chapter, refresh, and confirm it stays read

**Dependencies:** Task 1

**Files likely touched:**
- `src/bible/readingRecord.js`
- `src/dashboard/Dashboard.js`
- `src/dashboard/BookRecord.js`
- `src/App.test.js`

**Estimated scope:** Medium: 3-5 files

## Task 3: Make clear and load replace the whole record

**Description:** Route Clear All and Load through the record module. A successful load replaces every chapter, so chapters omitted from a valid file become unread in `localStorage`. An invalid file changes nothing and shows an error.

**Acceptance criteria:**
- [ ] Clear All sets every known chapter to `false` in React state and in `localStorage`
- [ ] A valid import with a partial `readStatus` sets omitted chapters to `false` in `localStorage`, including keys that were `"true"` before the import
- [ ] An empty `readStatus` object is valid and clears every chapter
- [ ] These inputs do not change state or `localStorage`, and the screen shows “That file is not a Bible Track record.” with `role="alert"`: invalid JSON, a non-array, a missing `readStatus` object, a non-boolean value, an unknown key
- [ ] The same file can be chosen again after a successful load

**Verification:**
- [ ] Tests pass: `CI=true npm test -- --watchAll=false`
- [ ] Build succeeds: `npm run build`
- [ ] Manual check: save a record, clear it, load the file back; then load a text file that is not JSON and confirm the record is unchanged and the error line appears

**Dependencies:** Task 2

**Files likely touched:**
- `src/bible/readingRecord.js`
- `src/dashboard/ControlPanel.js`
- `src/App.test.js`

**Estimated scope:** Medium: 3-5 files

## Checkpoint: After Tasks 2-3

- [ ] Toggle, clear, full load, partial load, and a bad file are covered by tests
- [ ] `CI=true npm test -- --watchAll=false` passes
- [ ] `npm run build` succeeds
- [ ] Manual check of toggle, clear, and load
- [ ] Review with human before proceeding

## Task 4: Rename Isaiah and Philippians and migrate stored keys

**Description:** Correct the two catalog names and move existing progress onto the new keys during read, so a refresh does not drop chapters the reader already marked.

**Acceptance criteria:**
- [ ] The grid shows `Isaiah` and `Philippians`
- [ ] Stored `Isiah_N=true` becomes `Isaiah_N=true`, and `Isiah_N` is removed
- [ ] Stored `Phillipians_N=true` becomes `Philippians_N=true`, and `Phillipians_N` is removed
- [ ] When both the old key and the new key exist, the new key’s value remains and the old key is removed
- [ ] A chapter marked read under the old name still shows read after reload

**Verification:**
- [ ] Tests pass: `CI=true npm test -- --watchAll=false`
- [ ] Build succeeds: `npm run build`
- [ ] Manual check: with an old `Isiah_1` value set in `localStorage`, refresh and confirm the Isaiah 1 button is read and the old key is gone

**Dependencies:** Task 3

**Files likely touched:**
- `src/bible/constants.ts`
- `src/bible/readingRecord.js`
- `src/App.test.js`

**Estimated scope:** Medium: 3-5 files

## Checkpoint: Complete

- [ ] Old spelling keys migrate and the buttons show the corrected names
- [ ] `CI=true npm test -- --watchAll=false` passes
- [ ] `npm run build` succeeds
- [ ] All acceptance criteria met
- [ ] Ready for review
