const db = require('../../backend/config/db');

const up = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS books (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      author VARCHAR(255) NOT NULL,
      year INTEGER NOT NULL,
      genre VARCHAR(100),
    );
    
    CREATE INDEX IF NOT EXISTS idx_books_title ON books(title);
    CREATE INDEX IF NOT EXISTS idx_books_author ON books(author);
    CREATE INDEX IF NOT EXISTS idx_books_year ON books(year);
    CREATE INDEX IF NOT EXISTS idx_books_genre ON books(genre);
  `;

  try {
    await db.query(createTableQuery);
    console.log('Миграция "001_create_books" выполнена успешно');
    return true;
  } catch (error) {
    console.error('Ошибка выполнения миграции "001_create_books":', error);
    throw error;
  }
};

const down = async () => {
  const dropTableQuery = `
    DROP TABLE IF EXISTS books CASCADE;
    DROP INDEX IF EXISTS idx_books_title;
    DROP INDEX IF EXISTS idx_books_author;
    DROP INDEX IF EXISTS idx_books_year;
    DROP INDEX IF EXISTS idx_books_genre;
  `;

  try {
    await db.query(dropTableQuery);
    console.log('Откат миграции "001_create_books" выполнен успешно');
    return true;
  } catch (error) {
    console.error('Ошибка отката миграции "001_create_books":', error);
    throw error;
  }
};

module.exports = {
  up,
  down,
};
