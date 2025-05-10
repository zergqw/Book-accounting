import fs from 'fs';
import { argv, cwd } from 'node:process';

const { promises: fsp } = fs;

const SAMPLEDATA = argv[2] || `${cwd()}/db/sampledata/books.json`;
const data = await fsp.readFile(SAMPLEDATA, 'utf-8');
const rows = JSON.parse(data);

const addRow = (row) => {
  const {
    title, author, category, pages, publisher, year,
  } = row;
  return {
    title,
    authors: [author],
    categories: [category],
    year,
    pages,
    publishers: [publisher],
  };
};

const db = rows.map((row) => addRow(row));

const add = async (title, authors, categories, year, pages, publisher) => db.push({
  title,
  authors,
  categories,
  year,
  pages,
  publisher,
});

const get = async () => db;

const getById = async (id) => db.find(({ id: bookId }) => bookId === id);

const deleteById = async (id) => {
  const pos = db.findIndex(({ id: bookId }) => bookId === id);
  db[pos] = null;
};

const find = async (findObj) => findObj;

const update = async (book) => {
  const pos = db.findIndex(({ id: bookId }) => bookId === book.id);
  db[pos] = book;
};

export default {
  add,
  get,
  getById,
  deleteById,
  find,
  update,
};
