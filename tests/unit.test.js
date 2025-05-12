const Book = require('../backend/models/bookModel');
const db = require('../backend/config/db');

jest.mock('../backend/config/db');

describe('Book Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('должен быть возвращен список книг', async () => {
      const mockBooks = [
        { id: 1, title: 'Book 1', author: 'Author 1', year: 2000, genre: 'Fantasy' },
      ];

      db.query.mockResolvedValue({ rows: mockBooks });

      const books = await Book.getAll();
      expect(books).toEqual(mockBooks);
    
      // Проверяем только ключевые части SQL
      expect(db.query).toHaveBeenCalledWith({
        text: expect.stringMatching(/SELECT[\s\S]*id,[\s\S]*title[\s\S]*FROM books/),
        values: [100, 0],
      });
   
    });
  });

  describe('getById', () => {
    it('должен вернуть книгу по идентификатору', async () => {
      const mockBook = { id: 1, title: 'Book 1', author: 'Author 1', year: 2000, genre: 'Fantasy' };

      db.query.mockResolvedValue({ rows: [mockBook] });

      const book = await Book.getById(1);
      expect(book).toEqual(mockBook);
      expect(db.query).toHaveBeenCalledWith({
        text: expect.stringContaining('WHERE id = $1'),
        values: [1],
      });
    });

    it('должен возвращать значение null, если книга не найдена', async () => {
      db.query.mockResolvedValue({ rows: [] });

      const book = await Book.getById(999);
      expect(book).toBeNull();
    });
  });

  describe('create', () => {
    it('должен создать новую книгу', async () => {
      const newBook = { title: 'New Book', author: 'New Author', year: 2023, genre: 'Mystery' };
      const mockResult = { id: 3, ...newBook };

      db.query.mockResolvedValue({ rows: [mockResult] });

      const createdBook = await Book.create(newBook);
      expect(createdBook).toEqual(mockResult);
      expect(db.query).toHaveBeenCalledWith({
        text: expect.stringContaining('INSERT INTO books'),
        values: [newBook.title, newBook.author, newBook.year, newBook.genre],
      });
    });
  });

  describe('update', () => {
    it('должен обновить книгу', async () => {
      const updates = { title: 'Updated Title', year: 2024 };
      const mockResult = { id: 1, title: 'Updated Title', author: 'Old Author', year: 2024, genre: 'Old Genre' };

      db.query.mockResolvedValue({ rows: [mockResult] });

      const updatedBook = await Book.update(1, updates);
      expect(updatedBook).toEqual(mockResult);
      expect(db.query).toHaveBeenCalledWith({
        text: expect.stringContaining('UPDATE books'),
        values: [updates.title, undefined, updates.year, undefined, 1],
      });
    });

    it('должен возвращать значение null, если книга не найдена', async () => {
      db.query.mockResolvedValue({ rows: [] });

      const result = await Book.update(999, { title: 'Nonexistent' });
      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('должен удалить книгу и вернуть значение true', async () => {
      db.query.mockResolvedValue({ rows: [{ id: 1 }] });

      const isDeleted = await Book.delete(1);
      expect(isDeleted).toBe(true);
      expect(db.query).toHaveBeenCalledWith({
        text: expect.stringContaining('DELETE FROM books'),
        values: [1],
      });
    });

    it('должен возвращать значение false, если книга не найдена', async () => {
      db.query.mockResolvedValue({ rows: [] });

      const isDeleted = await Book.delete(999);
      expect(isDeleted).toBe(false);
    });
  });

  describe('search', () => {
    it('должны быть возвращены книги, соответствующие запросу', async () => {
      const mockBooks = [
        { id: 1, title: 'Book 1', author: 'Author 1', year: 2000, genre: 'Fantasy' },
      ];

      db.query.mockResolvedValue({ rows: mockBooks });

      const books = await Book.search({ query: 'Book' });
      expect(books).toEqual(mockBooks);
      expect(db.query).toHaveBeenCalledWith({
        text: expect.stringMatching(/WHERE[\s\S]*title\s+ILIKE\s+\$1/),
        values: ['%Book%', 100, 0],
      });
    });

    it('должен возвращать все книги, если запрос пуст', async () => {
      const mockBooks = [
        { id: 1, title: 'Book 1', author: 'Author 1', year: 2000, genre: 'Fantasy' },
      ];

      db.query.mockResolvedValue({ rows: mockBooks });

      const books = await Book.search({ query: '' });
      expect(books).toEqual(mockBooks);
      expect(db.query).toHaveBeenCalledWith({
        text: expect.stringMatching(/SELECT[\s\S]*id[\s\S]*title[\s\S]*FROM books/),
        values: [100, 0]
      });
    });
  });
});