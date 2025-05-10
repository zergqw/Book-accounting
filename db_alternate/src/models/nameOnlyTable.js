import sql from './db.js';
import { startsWith, getColumnNameByTable } from './queryFragments.js';

const insertUniqueNames = async (table, names) => {
  const present = await sql`
    select id, name from ${sql(table)} where name in ${sql(names)}
  `;
  const presentNames = present.map(({ name }) => name);
  const absentNames = names
    .filter((name) => !presentNames.includes(name))
    .map((name) => ({ name }));
  if (absentNames.length === 0) {
    return present;
  }
  try {
    await sql`
      insert into ${sql(table)} ${sql(absentNames, 'name')}
    `;
  } catch (e) {
    console.log(e);
  }
  return sql`
    select id, name from ${sql(table)} where name in ${sql(names)}
  `;
};

const nameOnlyTable = (table) => {
  const add = async (names) => insertUniqueNames(table, names);
  const get = async (namePrefix = '') => sql`
  select name from ${sql(table)} 
  where name like ${`${namePrefix}%`}
  `;
  const getById = async (id) => sql` select name from ${sql(table)} where id = ${id}`;
  const getByBookId = async (id) => sql`
  select t.id, t.name from 
  ${sql(table)} t, ${sql(`book_${table}`)} bt where 
  bt.book_id = ${id} and ${sql(getColumnNameByTable(table))} = t.id
  `;
  const find = async (namePrefixes) => Promise.all(
    namePrefixes.map(
      async (prefix) => sql`
    select id, name from ${sql(table)} where id is not null
    ${startsWith('name', prefix)}
    `,
    ),
  );
  const deleteById = async (id) => sql` delete from ${sql(table)} where id = ${id}`;
  return {
    add,
    get,
    getById,
    getByBookId,
    deleteById,
    find,
  };
};

export default nameOnlyTable;
