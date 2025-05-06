const knex = require('knex')({
    client: 'sqlite3',
    connection: {
      filename: './library.db'
    },
    useNullAsDefault: true
  });
  
  // Создание таблицы для хранения книг, если она не существует
  knex.schema.hasTable('books').then(exists => {
    if (!exists) {
      return knex.schema.createTable('books', table => {
        table.increments('id').primary();
        table.string('title');
        table.string('author');
        table.string('genre');
        table.integer('year');
      }).then(() => {
        console.log('Таблица "books" создана');
      }).catch(err => {
        console.error('Ошибка при создании таблицы "books":', err);
      });
    }
  }).catch(err => {
    console.error('Ошибка при проверке существования таблицы "books":', err);
  });
  
  module.exports = knex;