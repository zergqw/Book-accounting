import Publishers from '../src/models/publishers.js';
import sql from '../src/models/db.js';

afterAll(() => sql.end());

test('add publishers', async () => {
  const name = 'Springer';
  const [{ id }] = await Publishers.add([name]);
  expect(
    await sql`select id, name from publishers where name = ${name}`,
  ).toMatchObject([{ id, name }]);
});

test('add publishers without duplicates', async () => {
  const name = 'Springer';
  await Publishers.add([name, name]);
  expect(
    await sql`select id, name from publishers where name = ${name}`,
  ).toHaveLength(1);
});

test('get publisher by id', async () => {
  const publisherName = 'Springer';
  const [{ id, name }] = await sql`select id, name from publishers where name = ${publisherName}`;
  expect(await Publishers.getById(id)).toMatchObject([{ name }]);
});

test('delete publisher by id', async () => {
  const name = 'Springer FROM TEST';
  const [{ id }] = await Publishers.add([name]);
  expect(
    await sql`select id, name from publishers where name = ${name}`,
  ).toMatchObject([{ name }]);
  await Publishers.deleteById(id);
  expect(
    await sql`select id, name from publishers where name = ${name}`,
  ).toHaveLength(0);
});

test('find publishers by name prefix', async () => {
  const namePrefixes = ['Spring'];
  expect(await Publishers.find(namePrefixes)).toHaveLength(1);
});
