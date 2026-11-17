import {fireEvent, render, screen, waitFor, within} from '@testing-library/react';
import App from './App';
import {IMPORT_ERROR, readRecord, writeRecord} from './bible/readingRecord';

if (typeof File.prototype.text !== 'function') {
    File.prototype.text = function text() {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result));
            reader.onerror = () => reject(reader.error);
            reader.readAsText(this);
        });
    };
}

beforeEach(() => {
    localStorage.clear();
});

function genesisChapter(number) {
    const row = screen.getByText('Genesis').parentElement;
    return within(row).getByRole('button', {name: String(number)});
}

test('renders the Bible Track dashboard', () => {
    render(<App/>);
    expect(screen.getByText('Genesis')).toBeInTheDocument();
    expect(screen.getByText('0 of 1189 chapters read')).toBeInTheDocument();
});

test('readRecord counts only the stored string true', () => {
    localStorage.setItem('Genesis_1', 'true');
    localStorage.setItem('Genesis_2', 'false');
    localStorage.setItem('Genesis_3', 'TRUE');

    const record = readRecord();

    expect(Object.keys(record)).toHaveLength(1189);
    expect(record.Genesis_1).toBe(true);
    expect(record.Genesis_2).toBe(false);
    expect(record.Genesis_3).toBe(false);
    expect(record.Exodus_1).toBe(false);
});

test('writeRecord stores every chapter and returns that map', () => {
    const written = writeRecord({Genesis_1: true});

    expect(Object.keys(written)).toHaveLength(1189);
    expect(written.Genesis_1).toBe(true);
    expect(written.Genesis_2).toBe(false);
    expect(localStorage.getItem('Genesis_1')).toBe('true');
    expect(localStorage.getItem('Genesis_2')).toBe('false');
    expect(localStorage.getItem('Revelation_22')).toBe('false');
});

test('toggling Genesis 1 stays read after remount', () => {
    const view = render(<App/>);

    fireEvent.click(genesisChapter(1));

    expect(localStorage.getItem('Genesis_1')).toBe('true');
    expect(localStorage.getItem('Genesis_2')).toBe('false');
    expect(screen.getByText('1 of 1189 chapters read')).toBeInTheDocument();
    expect(genesisChapter(1)).toHaveClass('MuiButton-contained');

    view.unmount();
    render(<App/>);

    expect(genesisChapter(1)).toHaveClass('MuiButton-contained');
    expect(screen.getByText('1 of 1189 chapters read')).toBeInTheDocument();
});

function loadRecord(contents) {
    const file = new File([contents], 'record.json', {type: 'application/json'});
    const input = document.querySelector('input[type="file"]');
    fireEvent.change(input, {target: {files: [file]}});
    return input;
}

test('clear all marks every stored chapter unread', () => {
    writeRecord({Genesis_1: true});
    render(<App/>);

    fireEvent.click(screen.getByRole('button', {name: 'Clear All'}));

    expect(localStorage.getItem('Genesis_1')).toBe('false');
    expect(screen.getByText('0 of 1189 chapters read')).toBeInTheDocument();
    expect(genesisChapter(1)).toHaveClass('MuiButton-outlined');
});

test('a partial import marks omitted chapters unread', async () => {
    writeRecord({Genesis_2: true});
    render(<App/>);

    loadRecord(JSON.stringify([{readStatus: {Genesis_1: true}}]));

    await waitFor(() => {
        expect(localStorage.getItem('Genesis_1')).toBe('true');
    });
    expect(localStorage.getItem('Genesis_2')).toBe('false');
    expect(screen.getByText('1 of 1189 chapters read')).toBeInTheDocument();
});

test('an empty import clears every chapter', async () => {
    writeRecord({Genesis_1: true});
    render(<App/>);

    loadRecord(JSON.stringify([{readStatus: {}}]));

    await waitFor(() => {
        expect(screen.getByText('0 of 1189 chapters read')).toBeInTheDocument();
    });
    expect(localStorage.getItem('Genesis_1')).toBe('false');
});

test.each([
    '{',
    '{}',
    '[{"note": true}]',
    '[{"readStatus": {"Genesis_1": "true"}}]',
    '[{"readStatus": {"NotABook_1": true}}]',
])('rejects a bad record without changing stored chapters: %s', async (contents) => {
    writeRecord({Genesis_1: true});
    render(<App/>);

    loadRecord(contents);

    await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(IMPORT_ERROR);
    });
    expect(localStorage.getItem('Genesis_1')).toBe('true');
    expect(screen.getByText('1 of 1189 chapters read')).toBeInTheDocument();
});

test('the file input can load the same record again', async () => {
    render(<App/>);
    const contents = JSON.stringify([{readStatus: {Genesis_1: true}}]);

    const input = loadRecord(contents);
    await waitFor(() => {
        expect(localStorage.getItem('Genesis_1')).toBe('true');
    });
    expect(input.value).toBe('');

    writeRecord({});
    loadRecord(contents);
    await waitFor(() => {
        expect(localStorage.getItem('Genesis_1')).toBe('true');
    });
});
