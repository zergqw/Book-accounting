require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  password: '1234',
  host: 'localhost',
  port: 5432,
  database: 'books_db',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('connect', () => {
  console.log('Успешное подключение к БД.');
});

pool.on('error', () => {
  console.log('Ошибка подключения к БД.');
});

const query = async (text, params) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Выполнен запрос', {
      text,
      duration,
      rows: result.rowCount,
    });
    return result;
  } catch (error) {
    console.error('Ошибка выполнения запроса: ', error);
    throw error;
  }
};

module.exports = {
  query,
  pool,
};
