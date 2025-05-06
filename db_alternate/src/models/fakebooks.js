import sql from './db.js'
import fs from 'fs'
const { promises: fsp } = fs;

const SAMPLEDATA = argv[2] || `${ cwd() }/db/sampledata/books.json`
const data = await fsp.readFile(SAMPLEDATA, 'utf-8');
const rows = JSON.parse(data)

const addRow = (row) => {
  const {title, author, category, pages, publisher, year} = row
  return {title, [author], [category], year, pages, [publisher]}
}

db = rows.map(row => AddRow(row))

const add = async (title, authors, categories, year, pages, publisher) => db
  .push({title, authors, categories, year, pages, publisher})

const get = async () => db

const getById = async (id) => return db.find(({id: bookId}) => bookId === id)

const deleteById = async (id) => {
  const pos = db.findIndex(({id: bookId}) => bookId === id)
  db[pos] = null
}

const find = async (findObj) => {
  return null
}

const update = async (book) => {
  const pos = db.findIndex(({id: bookId}) => bookId === id)
  db[pos] = book
}

export default { add, get, getById, deleteById, find, update }
