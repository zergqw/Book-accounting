import sql from './db.js';

const inRange = (columnName, range) => {
  if (range === null) {
    return sql``;
  }
  const [begin, end] = range;
  return sql`and ${sql(columnName)} >= ${begin} and ${sql(columnName)} <= ${end}`;
};

const startsWith = (columnName, prefix) => {
  if (prefix === null) {
    return sql``;
  }
  return sql`and ${sql(columnName)} like ${`${prefix}%`}`;
};

const getColumnNameByTable = (table) => {
  const columnNames = {
    authors: 'author_id',
    categories: 'category_id',
    publishers: 'publisher_id',
  };
  return columnNames[table];
};

export { inRange, startsWith, getColumnNameByTable };
