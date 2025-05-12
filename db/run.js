require('dotenv').config();
const fs = require('fs');
const path = require('path');
const db = require('../backend/config/db');

const runMigrations = async () => {
  const migrationFiles = fs
    .readdirSync(__dirname)
    .filter((file) => file.endsWith('.js') && file !== 'run.js')
    .sort();

  await createMigrationsTable();

  const completedMigrations = await getCompletedMigrations();

  console.log('Начало выполнения миграций...');

  for (const file of migrationFiles) {
    const migrationName = path.parse(file).name;

    if (completedMigrations.includes(migrationName)) {
      console.log(`Миграция ${migrationName} уже выполнена. Пропуск.`);
      continue;
    }

    const migration = require(`./${file}`);

    try {
      await migration.up();
      await recordMigration(migrationName);

      console.log(`Миграция ${migrationName} успешно выполнена`);
    } catch (error) {
      console.error(
        `Ошибка выполнения миграции ${migrationName}:`,
        error
      );
      process.exit(1);
    }
  }

  console.log('Все миграции успешно выполнены');
  process.exit(0);
};

const createMigrationsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await db.query(query);
  } catch (error) {
    console.error('Ошибка создания таблицы migrations:', error);
    throw error;
  }
};

const getCompletedMigrations = async () => {
  const query = 'SELECT name FROM migrations ORDER BY id ASC';

  try {
    const { rows } = await db.query(query);
    return rows.map((row) => row.name);
  } catch (error) {
    console.error('Ошибка получения списка выполненных миграций:', error);
    throw error;
  }
};

const recordMigration = async (name) => {
  const query = {
    text: 'INSERT INTO migrations (name) VALUES ($1)',
    values: [name],
  };

  try {
    await db.query(query.text, query.values);
  } catch (error) {
    console.error(`Ошибка записи миграции ${name}:`, error);
    throw error;
  }
};

runMigrations().catch((error) => {
  console.error('Критическая ошибка при выполнении миграций:', error);
  process.exit(1);
});
