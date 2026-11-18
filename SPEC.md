# Spec: Gospel chapter shows the quoted passage

Source intent: `intent/2026-11-17-gospel-chapter-shows-the-quoted-passage.md` (status: proposed).

## Objective

A new believer reading Bible Track can see that a Gospel verse is talking to an Old Testament passage. On either chapter, they read a few English sentences about what the Gospel writer is doing with that passage, and they can move to the other chapter on the same page.

The reader is a new believer who otherwise treats the chapter as a finished story. Success is that every direct quotation in Matthew, Mark, Luke, and John is visible from both chapters, the note can be finished without leaving the page, and the page spells Isaiah and Philippians.

User stories:

- On Matthew 1, the reader sees that Matthew 1:23 quotes Isaiah 7:14, reads two to four sentences on what Matthew is doing with that promise, and can move to Isaiah 7 without the read-state of either chapter changing.
- On Isaiah 7, the same note is visible, and the reader can move to Matthew 1.
- A chapter with no direct Gospel quotation shows no note.
- A reader who already marked Isaiah or Philippians under the old spelling still sees those chapters marked after the labels change.

## Tech Stack

- React 18.3 and React DOM 18.3
- Material UI 6 (`@mui/material` 6.1)
- Create React App via `react-scripts` 5.0.1
- Jest and Testing Library, already used by `src/App.test.js`
- No new runtime or test dependencies

## Commands

From the repository root:

```
Dev: npm start
Build: npm run build
Test: CI=true npm test -- --watchAll=false
```

`package.json` has no lint script. ESLint is the `react-app` config already in that file. Do not add a lint script for this feature.

## Project Structure

```
src/App.js                         App shell
src/App.test.js                    Existing checklist tests
src/dashboard/                     Chapter grid, statistics, save and load
src/bible/constants.ts             Book catalog and chapter counts
src/bible/readingRecord.js         The only reader and writer of chapter progress
src/bible/gospelQuotations.js      Direct Gospel quotations and their notes
src/bible/gospelQuotations.test.js Tests for the list and both-chapter rendering
intent/                            Accepted product intent
SPEC.md                            This spec
```

Chapter progress remains in `readingRecord.js`. The quotation list is separate data. It is not written into the saved record.

A quotation record looks like this:

```javascript
{
    gospel: 'Matthew',
    gospelChapter: 1,
    gospelVerse: 23,
    source: 'Isaiah',
    sourceChapter: 7,
    sourceVerse: 14,
    note: 'Matthew 1:23 quotes Isaiah 7:14. Matthew is saying the child promised in that passage is Jesus.',
}
```

Book names in the record are the catalog names after correction. `gospel` is Matthew, Mark, Luke, or John. `source` is an Old Testament book from the catalog.

## Code Style

Match the existing dashboard files. Four-space indent, single quotes, semicolons, and a function component that receives the record and callbacks as props.

```javascript
export default function QuotationNote({quotation, onGoToChapter}) {
    return (
        <section>
            <p>{quotation.note}</p>
            <button type="button" onClick={() => onGoToChapter(quotation)}>
                Go to {quotation.source} {quotation.sourceChapter}
            </button>
        </section>
    );
}
```

The note control is a separate button from the chapter-number button. The chapter-number button still only toggles read and unread.

## Testing Strategy

Framework is Jest with Testing Library. Run `CI=true npm test -- --watchAll=false`. There is no coverage threshold. Every success criterion below has an automated test, except the human review of whether the shipped list is complete.

Tests live in `src/bible/gospelQuotations.test.js` and assert through the rendered checklist, the same way `src/App.test.js` finds a chapter button. Existing checklist tests keep passing, including save, load, and clear.

Test levels:

- The shipped list rejects a row whose book is not in the catalog, whose chapter is out of range, whose `gospel` is not one of the four Gospels, or whose note is not two to four sentences.
- Rendering one Gospel chapter shows only that chapter's notes.
- Rendering the quoted Old Testament chapter shows the same note.
- Activating "go to the other chapter" reveals the other chapter's row and does not change `localStorage` or the read count.
- Toggling a chapter number still marks that chapter read.
- Stored `Isiah_N` and `Phillipians_N` values move to `Isaiah_N` and `Philippians_N` on read. When both spellings exist, the new spelling remains and the old key is removed.

## Boundaries

- Always: keep the note on the checklist page, keep chapter progress in `readingRecord.js`, use the corrected spellings Isaiah and Philippians in labels and notes, and run the test command above before considering a task done.
- Ask first: adding a dependency, changing the saved record shape, replacing `tasks/plan.md` (that file is the storage-repair plan), or opening the quotation in another site.
- Never: ship allusions, quotations outside the four Gospels, Chinese text, a separate study page, the large cross-reference dump, character trees, reading plans, or a note long enough that the reader must leave the chapter. Never commit secrets. Never edit `node_modules`. Never remove a failing test to make the suite pass.

## Success Criteria

- The catalog labels visible on the page are Isaiah and Philippians.
- Progress stored under `Isiah_N` or `Phillipians_N` is still marked read on the renamed chapter after reload. If both spellings were stored, the new spelling's value remains.
- The app ships one list of direct quotations for Matthew, Mark, Luke, and John. Each row names the Gospel verse, the Old Testament verse, and a note of two to four English sentences.
- The list includes Matthew 1:23 quoting Isaiah 7:14, Matthew 4:4 quoting Deuteronomy 8:3, and at least one direct quotation in each of Mark, Luke, and John.
- For every row, Matthew, Mark, Luke, or John shows the note on that Gospel chapter, and the Old Testament book shows the same note on the quoted chapter.
- A chapter with no row shows no quotation note.
- From the note, the reader can bring the other chapter's row into view. The read count and stored chapter values stay unchanged.
- The chapter-number control still toggles that chapter's read state.
- Save and load still round-trip the chapter map only. The notes are not part of the file.
- A human reviews the shipped list and accepts it as the direct quotations in the four Gospels before the feature is called done. Automated tests prove the list renders. They do not decide completeness.

## Open Questions

None.
