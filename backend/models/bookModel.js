const db = require("../config/db");

class Book {
    static async getAll(limit = 100, offset = 0) {
        const query = {
            text: `
                SELECT 
                    id, title, author, year, genre, description, isbn, created_at, updated_at
                FROM books
                ORDER BY title ASC
                LIMIT $1 OFFSET $2
            `,
            values: [limit, offset],
        };

        const { rows } = await db.query(query.text, query.values);
        return rows;
    }

    static async getById(id) {
        const query = {
            text: `
                SELECT 
                    id, title, author, year, genre, description, isbn, created_at, updated_at
                FROM books
                WHERE id = $1
            `,
            values: [id],
        };

        const { rows } = await db.query(query.text, query.values);
        return rows[0] || null;
    }

    static async create(book) {
        const { title, author, year, genre, description, isbn } = book;

        const query = {
            text: `
                INSERT INTO books (
                    title, author, year, genre, description, isbn, created_at, updated_at
                ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
                RETURNING 
                    id, title, author, year, genre, description, isbn, created_at, updated_at 
            `,
            values: [title, author, year, genre, description, isbn],
        };

        const { rows } = await db.query(query.text, query.values);
        return rows[0];
    }

    static async update(id, book) {
        const { title, author, year, genre, description, isbn } = book;

        const query = {
            text: `
                UPDATE books
                SET
                    title = COALESCE($1, title),
                    author = COALESCE($2, author),
                    year = COALESCE($3, year),
                    genre = COALESCE($4, genre),
                    description = COALESCE($5, description),
                    isbn = COALESCE($6, isbn),
                    updated_at = NOW()
                WHERE id = $7
                RETURNING
                    id, title, author, year, genre, description, isbn, created_at, updated_at 
            `,
            values: [title, author, year, genre, description, isbn, id],
        };

        const { rows } = await db.query(query.text, query.values);
        return rows[0] || null;
    }

    static async delete(id) {
        const query = {
            text: `DELETE FROM books WHERE id = $1 RETURNING id`,
            values: [id],
        };

        const { rows } = await db.query(query.text, query.values);
        return rows.length > 0;
    }

    static async search(searchParams) {
        const { title, author, year, genre } = searchParams;

        const conditions = [];
        const values = [];
        let paramCounter = 1;

        if (title) {
            conditions.push(`title ILIKE $${paramCounter}`);
            values.push(`%${title}%`);
            paramCounter++;
        }

        if (author) {
            conditions.push(`author ILIKE $${paramCounter}`);
            values.push(`%${author}%`);
            paramCounter++;
        }

        if (year) {
            conditions.push(`year = $${paramCounter}`);
            values.push(year);
            paramCounter++;
        }

        if (genre) {
            conditions.push(`
                genre ILIKE $${paramCounter} OR
                genre ILIKE $${paramCounter + 1} OR
                genre ILIKE $${paramCounter + 2} OR
                genre ILIKE $${paramCounter + 3}
              `);

            values.push(`${genre}`, `${genre} %`, `% ${genre}`, `% ${genre} %`);
            paramCounter += 4;

            paramCounter++;
        }

        if (conditions.length === 0) {
            return this.getAll();
        }

        const query = {
            text: `
                SELECT 
                    id, title, author, year, genre, description, isbn, created_at, updated_at
                FROM books
                WHERE ${conditions.join(" AND ")}
                ORDER BY title ASC
            `,
            values,
        };

        const { rows } = await db.query(query.text, query.values);
        return rows;
    }
}

module.exports = Book;
