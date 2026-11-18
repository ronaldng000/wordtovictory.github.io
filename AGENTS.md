# Bible Track

A local chapter checklist for the Protestant Bible. Progress is a boolean for every chapter, stored in the browser.

## Tech Stack

- React 18.3, Material UI 6, Create React App (`react-scripts` 5.0.1)
- Jest and Testing Library

## Commands

Run these from the repository root:

- Dev: `npm start`
- Build: `npm run build`
- Test: `CI=true npm test -- --watchAll=false`

There is no lint script. Do not add dependencies for a task that can use the packages already in `package.json`.

## Code Conventions

- Chapter progress is read and written only through `src/bible/readingRecord.js`.
- A chapter key is `Book.name + "_" + chapter`. Only the stored string `"true"` counts as read.
- Book names on the page match the catalog in `src/bible/constants.ts`.
- Match the surrounding file: four-space indent, single quotes, semicolons.
- Tests assert what the reader can see or what `localStorage` holds. `src/App.test.js` is the pattern.

## Boundaries

- Do not read or commit `.env` files, credentials, or tokens.
- Do not change the saved record shape unless the task says so.
- Ask before adding a dependency or replacing `tasks/plan.md`.
- The Gospel quotation work waits on `SPEC.md` until the storage repair's rename is done.

## Current task

The storage repair's rename is done. Isaiah and Philippians are the catalog names, and `readRecord` moves the old spellings onto them. The Gospel quotation spec in `SPEC.md` is the next feature, and it is not started.
