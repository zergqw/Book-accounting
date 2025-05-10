import sql from './db.js';
import Authors from './authors.js';
import Categories from './categories.js';
import Publishers from './publishers.js';
import { inRange, startsWith } from './queryFragments.js';

const deleteById = async (id) => sql` delete from books where id = ${id}`;

const add = async (title, authors, categories, year, pages, publisher) => {
  await sql`
    insert into books (title, year, pages) values (${title}, ${year}, ${pages})`;
  const ids = await sql`select id from books 
    where title = ${title} and year = ${year} and pages = ${pages}`;
  console.log(ids);
  const { id: bookId } = ids.shift(0);
  await Promise.all(ids.map(async ({ id }) => deleteById(id)));
  const bookAuthors = (await Authors.add(authors)).map(({ id }) => ({
    book_id: bookId,
    author_id: id,
  }));
  const bookCategories = (await Categories.add(categories)).map(({ id }) => ({
    book_id: bookId,
    category_id: id,
  }));
  const bookPublishers = (await Publishers.add([publisher])).map(({ id }) => ({
    book_id: bookId,
    publisher_id: id,
  }));
  await sql`insert into book_authors ${sql(bookAuthors)}`;
  await sql`insert into book_categories ${sql(bookCategories)}`;
  await sql`insert into book_publishers ${sql(bookPublishers)}`;
  return bookId;
};

const getById = async (id) => {
  const [book = null] = await sql`select id, title, year, pages from books where id = ${id}`;
  if (book === null) {
    return null;
  }
  const authors = [...(await Authors.getByBookId(id))];
  const categories = [...(await Categories.getByBookId(id))];
  const publishers = [...(await Publishers.getByBookId(id))];
  return {
    ...book,
    authors,
    categories,
    publishers,
  };
};

const get = async () => {
  const ids = await sql`select id from books`;
  console.log(ids[0]);
  return Promise.all(ids.map(async ({ id }) => getById(id)));
};

const find = async (findObj) => {
  const haveMatchingPrefixes = (words, prefixes) => {
    if (prefixes.length === 0) {
      return true;
    }
    return words.every((word) => prefixes.some((pref) => word.startsWith(pref)));
  };
  const {
    title = null,
    authorNames = [],
    categoryNames = [],
    yearRange = null,
    pagesRange = null,
    publisherNames = [],
  } = findObj;
  const ids = await sql`
  select id from books where id is not null
  ${startsWith('title', title)}
  ${inRange('year', yearRange)}
  ${inRange('pages', pagesRange)}
  `;
  const books = await Promise.all(ids.map(async ({ id }) => getById(id)));
  return books.filter(
    (book) => haveMatchingPrefixes(
      book.authors.map(({ name }) => name),
      authorNames,
    )
      && haveMatchingPrefixes(
        book.categories.map(({ name }) => name),
        categoryNames,
      )
      && haveMatchingPrefixes(
        book.publishers.map(({ name }) => name),
        publisherNames,
      ),
  );
};

const update = async (book) => {
  try {
    await sql`
    update books set ${sql(book, 'title', 'year', 'pages')}
    where id = ${book.id}
    `;
    return true;
  } catch (e) {
    return false;
  }
};

export default {
  add,
  get,
  getById,
  deleteById,
  find,
  update,
};
