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

export function readRecord() {
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
