import Authors from '../src/models/authors.js';
import sql from '../src/models/db.js';

afterAll(() => sql.end());

test('add authors', async () => {
  const name = 'Feynman, Richard';
  const [{ id }] = await Authors.add([name]);
  expect(
    await sql`select id, name from authors where name = ${name}`,
  ).toMatchObject([{ id, name }]);
});

test('add authors without duplicates', async () => {
  const name = 'Feynman, Richard';
  await Authors.add([name, name]);
  expect(
    await sql`select id, name from authors where name = ${name}`,
  ).toHaveLength(1);
});

test('get author by id', async () => {
  const authorName = 'Feynman, Richard';
  const [{ id, name }] = await sql`select id, name from authors where name = ${authorName}`;
  expect(await Authors.getById(id)).toMatchObject([{ name }]);
});

test('delete author by id', async () => {
  const name = 'Feynman, Richard FROM TEST';
  const [{ id }] = await Authors.add([name]);
  expect(
    await sql`select id, name from authors where name = ${name}`,
  ).toMatchObject([{ name }]);
  await Authors.deleteById(id);
  expect(
    await sql`select id, name from authors where name = ${name}`,
  ).toHaveLength(0);
});

test('find authors by name prefix', async () => {
  const namePrefixes = ['Feynman'];
  expect(await Authors.find(namePrefixes)).toHaveLength(1);
});
