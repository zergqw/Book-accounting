import fs from 'fs';
import { argv, cwd } from 'node:process';
import Books from './books.js';
import sql from './db.js';

const { promises: fsp } = fs;

const SAMPLEDATA_JSON = argv[2] || `${cwd()}/db/sampledata/books.json`;
const data = await fsp.readFile(SAMPLEDATA_JSON, 'utf-8');
const rows = JSON.parse(data);

const addRow = async (row) => {
  const {
    title, author, category, pages, publisher, year,
  } = row;
  return Books.add(title, [author], [category], year, pages, publisher);
};

await Promise.all(rows.map(async (row) => addRow(row)));
sql.end();
