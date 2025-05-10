import postgres from 'postgres';

const sql = postgres({
  host: 'localhost',
  database: 'booksdb',
  username: 'postgres',
});

export default sql;
