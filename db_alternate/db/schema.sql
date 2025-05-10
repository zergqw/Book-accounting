DROP TABLE IF EXISTS authors;
DROP TABLE IF EXISTS books CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS publishers;
DROP TABLE IF EXISTS book_authors;
DROP TABLE IF EXISTS book_categories;
DROP TABLE IF EXISTS book_publishers;

CREATE TABLE authors (
	id SERIAL PRIMARY KEY,
	name VARCHAR(200) NOT NULL UNIQUE
);

CREATE TABLE categories (
	id SERIAL PRIMARY KEY,
	name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE publishers (
	id SERIAL PRIMARY KEY,
	name VARCHAR(500) NOT NULL UNIQUE
);

CREATE TABLE books (
	id SERIAL PRIMARY KEY,
	title VARCHAR(500) NOT NULL,
	year INT,
	pages INT
);

CREATE TABLE book_authors (
	book_id SERIAL,
	author_id SERIAL,
	PRIMARY KEY (book_id, author_id),
	FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
	FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE CASCADE
);

CREATE TABLE book_categories (
	book_id SERIAL,
	category_id SERIAL,
	PRIMARY KEY (book_id, category_id),
	FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
	FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

CREATE TABLE book_publishers (
	book_id SERIAL,
	publisher_id SERIAL,
	PRIMARY KEY (book_id, publisher_id),
	FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
	FOREIGN KEY (publisher_id) REFERENCES publishers(id) ON DELETE CASCADE
);
