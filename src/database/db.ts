import sqlite3 from 'sqlite3';
import type { INoteData } from '../shared/types';

const db = new sqlite3.Database('notes.sql');

const create_notes_table = () => {
  db.run('CREATE TABLE IF NOT EXISTS notes (id INTEGER UNIQUE PRIMARY KEY AUTOINCREMENT, note TEXT)');
};

export const set_note = (data: INoteData, callback: (rows: INoteData[]) => void) => {
  db.serialize(() => {
    create_notes_table();
    const stmt = db.prepare(
      'INSERT OR REPLACE INTO notes (id, note) VALUES ((SELECT id FROM notes WHERE id = ?), ?)'
    );
    stmt.run(data.id, data.note);
    stmt.finalize();
    get_all_notes(callback);
  });
};

export const get_all_notes = (callback: (rows: INoteData[]) => void) => {
  db.serialize(() => {
    create_notes_table();
    db.all('SELECT * FROM notes ORDER BY id DESC', (_err, data) => {
      callback((data as INoteData[]) || []);
    });
  });
};

export const delete_note = (id: number, callback: (rows: INoteData[]) => void) => {
  db.serialize(() => {
    create_notes_table();
    const stmt = db.prepare('DELETE FROM notes WHERE id = ?');
    stmt.run(id);
    stmt.finalize();
    get_all_notes(callback);
  });
};

export const get_note = (id: number, callback: (row: INoteData | null) => void) => {
  db.serialize(() => {
    create_notes_table();
    db.get('SELECT * FROM notes WHERE id = ?', id, (_err, row) => {
      callback((row as INoteData) || null);
    });
  });
};
