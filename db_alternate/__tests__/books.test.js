import Books from '../src/models/books.js';
import sql from '../src/models/db.js';

afterAll(() => sql.end());

const title = 'God Created the Integers';
const year = 2000;
const pages = 197;
const author = 'Hawking; Stephen';
const category = 'mathematics';
const publisher = 'Penguin';
let id = -1;

beforeEach(async () => {
  id = await Books.add(title, [author], [category], year, pages, publisher);
});

afterEach(async () => {
  await Books.deleteById(id);
});

test('add book', async () => {
  const id = await Books.add(
    title,
    [author],
    [category],
    year,
    pages,
    publisher,
  );
  expect(
    await sql`select id, title from books where title = ${title} and year = ${year} and pages=${pages}`,
  ).toMatchObject([{ id, title }]);
});

test('get book by id', async () => {
  expect(await Books.getById(id)).toMatchObject({ title });
});

test('delete book by id', async () => {
  await Books.deleteById(id);
  expect(await Books.getById(id)).toBeNull();
});

test('update book by id', async () => {
  const newTitle = 'God Created the Integers Test';
  const newYear = 2001;
  const newPages = 190;
  const updatedBook = {
    id,
    title: newTitle,
    year: newYear,
    pages: newPages,
  };
  await Books.update(updatedBook);
  expect(await Books.getById(id)).toMatchObject(updatedBook);
});

test('get all books', async () => {
  expect(await Books.getAll()).not.toHaveLength(0);
});

test('find books by find object', async () => {
  const findObj = {
    yearRange: [1950, 1970],
    pagesRange: [0, 500],
  };
  const result1 = await Books.find(findObj);
  expect(result1).not.toHaveLength(0);
  findObj.title = 'A';
  const result2 = await Books.find(findObj);
  expect(result2).not.toHaveLength(0);
  expect(result1).toMatchObject(result1);
});
