import {fireEvent, render, screen, within} from '@testing-library/react';
import App from './App';
import {readRecord, writeRecord} from './bible/readingRecord';

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
