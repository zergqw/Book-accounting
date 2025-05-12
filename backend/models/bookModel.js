const db = require('../config/db');

class Book {
  static async getAll(limit = 100, offset = 0) {
    const query = {
      text: `
                SELECT 
                    id, 
                    title, 
                    author, 
                    year, 
                    genre
                FROM books
                ORDER BY title ASC
                LIMIT $1 OFFSET $2
            `,
      values: [limit, offset],
    };

    const { rows } = await db.query(query);
    return rows;
  }

  static async getById(id) {
    const query = {
      text: `
                SELECT 
                    id, 
                    title, 
                    author, 
                    year, 
                    genre
                FROM books
                WHERE id = $1
            `,
      values: [id],
    };

    const { rows } = await db.query(query);
    return rows[0] || null;
  }

  static async create({ title, author, year, genre }) {
    const query = {
      text: `
                INSERT INTO books (
                    title, 
                    author, 
                    year, 
                    genre
                ) VALUES ($1, $2, $3, $4)
                RETURNING id, title, author, year, genre
            `,
      values: [title, author, year, genre],
    };

    const { rows } = await db.query(query);
    return rows[0];
  }

  static async update(id, { title, author, year, genre }) {
    const query = {
      text: `
                UPDATE books
                SET
                    title = COALESCE($1, title),
                    author = COALESCE($2, author),
                    year = COALESCE($3, year),
                    genre = COALESCE($4, genre)
                WHERE id = $5
                RETURNING id, title, author, year, genre
            `,
      values: [title, author, year, genre, id],
    };

    const { rows } = await db.query(query);
    return rows[0] || null;
  }

  static async delete(id) {
    const query = {
      text: 'DELETE FROM books WHERE id = $1 RETURNING id',
      values: [id],
    };

    const { rows } = await db.query(query);
    return rows.length > 0;
  }

  static async search({ query, limit = 100, offset = 0 }) {
    if (!query) return this.getAll(limit, offset);

    const searchQuery = {
      text: `
                SELECT 
                    id, 
                    title, 
                    author, 
                    year, 
                    genre
                FROM books
                WHERE 
                    title ILIKE $1 OR
                    author ILIKE $1 OR
                    genre ILIKE $1 OR
                    CAST(year AS TEXT) LIKE $1
                ORDER BY 
                    CASE 
                        WHEN title ILIKE $1 THEN 1
                        WHEN author ILIKE $1 THEN 2
                        ELSE 3
                    END,
                    title ASC
                LIMIT $2 OFFSET $3
            `,
      values: [`%${query}%`, limit, offset],
    };

    const { rows } = await db.query(searchQuery);
    return rows;
  }
}

module.exports = Book;