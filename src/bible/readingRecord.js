import {BOOKS} from './constants.ts';

function emptyRecord() {
    const record = {};
    for (const book of BOOKS) {
        for (let chapter = 1; chapter <= book.numChapters; chapter++) {
            record[book.name + '_' + chapter] = false;
        }
    }
    return record;
}

const LEGACY_BOOK_NAMES = [
    ['Isiah', 'Isaiah'],
    ['Phillipians', 'Philippians'],
];

function migrateLegacyBookNames() {
    for (const [oldName, newName] of LEGACY_BOOK_NAMES) {
        const book = BOOKS.find((item) => item.name === newName);
        if (!book) {
            continue;
        }
        for (let chapter = 1; chapter <= book.numChapters; chapter++) {
            const oldKey = oldName + '_' + chapter;
            const stored = localStorage.getItem(oldKey);
            if (stored === null) {
                continue;
            }
            const newKey = newName + '_' + chapter;
            if (localStorage.getItem(newKey) === null) {
                localStorage.setItem(newKey, stored);
            }
            localStorage.removeItem(oldKey);
        }
    }
}

export function readRecord() {
    migrateLegacyBookNames();
    const record = emptyRecord();
    for (const key of Object.keys(record)) {
        record[key] = localStorage.getItem(key) === 'true';
    }
    return record;
}

export function writeRecord(partial) {
    const record = emptyRecord();
    for (const key of Object.keys(record)) {
        record[key] = partial[key] === true;
        localStorage.setItem(key, record[key] ? 'true' : 'false');
    }
    return record;
}

export const IMPORT_ERROR = 'That file is not a Bible Track record.';

export function parseImport(text) {
    let data;
    try {
        data = JSON.parse(text);
    } catch {
        return {ok: false};
    }
    const readStatus = Array.isArray(data) ? data[0] && data[0].readStatus : undefined;
    if (readStatus == null || typeof readStatus !== 'object' || Array.isArray(readStatus)) {
        return {ok: false};
    }
    const knownKeys = new Set(Object.keys(emptyRecord()));
    for (const [key, value] of Object.entries(readStatus)) {
        if (!knownKeys.has(key) || typeof value !== 'boolean') {
            return {ok: false};
        }
    }
    return {ok: true, record: readStatus};
}
