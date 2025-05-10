import Categories from '../src/models/categories.js';
import sql from '../src/models/db.js';

afterAll(() => sql.end());

test('add categories', async () => {
  const name = 'economics';
  const [{ id }] = await Categories.add([name]);
  expect(
    await sql`select id, name from categories where name = ${name}`,
  ).toMatchObject([{ id, name }]);
});

test('add categories without duplicates', async () => {
  const name = 'economics';
  await Categories.add([name, name]);
  expect(
    await sql`select id, name from categories where name = ${name}`,
  ).toHaveLength(1);
});

test('get category by id', async () => {
  const categoryName = 'economics';
  const [{ id, name }] = await sql`select id, name from categories where name = ${categoryName}`;
  expect(await Categories.getById(id)).toMatchObject([{ name }]);
});

test('delete category by id', async () => {
  const name = 'economics FROM TEST';
  const [{ id }] = await Categories.add([name]);
  expect(
    await sql`select id, name from categories where name = ${name}`,
  ).toMatchObject([{ name }]);
  await Categories.deleteById(id);
  expect(
    await sql`select id, name from categories where name = ${name}`,
  ).toHaveLength(0);
});

test('find categories by name prefix', async () => {
  const namePrefixes = ['economic'];
  expect(await Categories.find(namePrefixes)).toHaveLength(1);
});
