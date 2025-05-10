import sql from './db.js'

const insertUniqueNames = async (table, names) => {
  const present = await sql`
    select id, name from ${ sql(table) } where name in ${ sql(names) }
  `
  const presentNames = present.map(({name}) => name)
  const absentNames = names.filter(name => !presentNames.includes(name)).map(name => ({ name }))
  if (absentNames.length == 0) {
    return present
  }
  try {
    await sql`
      insert into ${ sql(table) } ${ sql(absentNames, 'name') }
    `
  } catch(e) {
    console.log(e)
  }
  return await sql`
    select id, name from ${ sql(table) } where name in ${ sql(names) }
  `
}

const inRange = (columnName, range) => {
  if (range === null) {
    return sql ``
  }
  const [begin, end] = range
  return sql`and ${ sql(columnName) } >= ${ begin } and ${ sql(columnName) } <= ${ end }`
}

const startsWith = (columnName, prefix) =>
{
  if (prefix === null) {
    return sql ``
  }
  return sql`and ${ sql(columnName) } like ${ prefix + '%' }`
}

const getColumnNameByTable = (table) => {
  const columnNames = {
    authors: 'author_id',
    categories: 'category_id',
    publishers: 'publisher_id',
  }
  return columnNames[table]
}

const nameOnlyTable = (table) => {
  const add = async (names) => await insertUniqueNames(table, names)
  const get = async (namePrefix='') => await sql`
  select name from ${ sql(table) } 
  where name like ${ namePrefix + '%' }
  `
  const getById = async (id) => await sql` select name from ${ sql(table) } where id = ${ id }`
  const getByBookId = async (id) => await sql`
  select t.id, t.name from 
  ${ sql(table) } t, ${ sql('book_' + table) } bt where 
  bt.book_id = ${ id } and ${ sql(getColumnNameByTable(table)) } = t.id
  `
  const find = async (namePrefixes) => {
    return Promise.all(namePrefixes.map(async prefix => await sql`
    select id, name from ${ sql(table) } where id is not null
    ${ startsWith('name', prefix) }
    `
    ))
  }
  const deleteById = async (id) => await sql` delete from ${ sql(table) } where id = ${ id }`
  return { add, get, getById, getByBookId, deleteById, find }
}

const Authors = nameOnlyTable('authors')
const Categories = nameOnlyTable('categories')
const Publishers = nameOnlyTable('publishers')

const add = async (title, authors, categories, year, pages, publisher) => {
  await sql`
    insert into books (title, year, pages) values (${ title }, ${ year }, ${ pages })`
  const ids = await sql`select id from books 
    where title = ${ title } and year = ${ year } and pages = ${ pages }`
  console.log(ids)
  const {id: bookId} = ids.shift(0)
  await Promise.all(ids.map(async ({ id }) => await deleteById(id)))
  const bookAuthors = (await Authors.add(authors)).map(({id}) => ({book_id: bookId, author_id: id}))
  const bookCategories = (await Categories.add(categories)).map(({id}) => ({book_id: bookId, category_id: id}))
  const bookPublishers = (await Publishers.add([publisher])).map(({id}) => ({book_id: bookId, publisher_id: id}))
  await sql`insert into book_authors ${ sql(bookAuthors) }`
  await sql`insert into book_categories ${ sql(bookCategories) }`
  await sql`insert into book_publishers ${ sql(bookPublishers) }`
  return bookId
}

const get = async () => {
  const ids = await sql`select id from books`
  console.log(ids[0])
  return Promise.all(ids.map(async ({ id }) => await getById(id)))
}

const getById = async (id) => {
  const [book=null] = await sql`select id, title, year, pages from books where id = ${ id }` 
  if (book === null) {
    return null
  }
  const authors = [...(await Authors.getByBookId(id))]
  const categories = [...(await Categories.getByBookId(id))]
  const publishers = [...(await Publishers.getByBookId(id))]
  return {...book, authors, categories, publishers}
}

const deleteById = async (id) => await sql` delete from books where id = ${ id }`

const find = async (findObj) => {
  const haveMatchingPrefixes = (words, prefixes) => {
    if (prefixes.length === 0) {
      return true
    }
    return words.every(word => prefixes.some(pref => word.startsWith(pref)))
  }
  const {title=null, authorNames=[], categoryNames=[], yearRange=null, pagesRange=null, publisherNames=[]} = findObj
  const ids = await sql`
  select id from books where id is not null
  ${ startsWith('title', title) }
  ${ inRange('year', yearRange) }
  ${ inRange('pages', pagesRange) }
  `
  const books = await Promise.all(ids.map(async ({id}) => await getById(id)))
  return books.filter(book => {
    return haveMatchingPrefixes(book.authors.map(({name}) => name), authorNames)
    && haveMatchingPrefixes(book.categories.map(({name}) => name), categoryNames)
    && haveMatchingPrefixes(book.publishers.map(({name}) => name), publisherNames)
  })
}

const update = async (book) => {
  try {
    await sql`
    update books set ${
      sql(book, 'title', 'year', 'pages')
    }
    where id = ${ book.id }
    `
    return true
  } catch(e) {
    return false
  }
}

export default { add, get, getById, deleteById, find, update }
