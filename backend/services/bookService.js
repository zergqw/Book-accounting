const Book = require('../models/bookModel');


class BookService {
  static async getBooks(limit, offset) {
    try {
      return await Book.getAll(limit, offset);
    } catch(error) {
      console.error('Ошибка получения списка книг: ', error);
      throw new Error('Не удалось получить список книг');
    }
  }

  static async getBookById(id) {
    try {
      const book = await Book.getById(id);
      if(!book) {
        throw new Error('Книга не найдена');
      }
      return book;
    } catch(error) {
      console.error(`Ошибка получени книги по ID ${id}: `, error);
      throw error;
    }
  }

  static async addBook(bookData) {
    try {
      this._validateBookData(bookData);

      return await Book.create(bookData);
    } catch(error) {
      console.error('Ошибка при добавлении книги: ', error);
      throw error;
    }
  }

  static async updateBook(id, bookData) {
    try {
      const existingBook = await Book.getById(id);
      if (!existingBook) {
        throw new Error('Книга не найдена');
      }

      this._validateBookData(bookData, false);

      const updatedBook = await Book.update(id, bookData);
      return updatedBook;
    } catch(error) {
      console.error(`Ошибка обновления книги по ID ${id}: `, error);
      throw error;
    }
  }

  static async deleteBook(id) {
    try {
      const existingBook = await Book.getById(id);
      if (!existingBook) {
        throw new Error('Книга не найдена');
      }

      return await Book.delete(id);
    } catch(error) {
      console.error(`Ошибка удаления книги по ID ${id}: `, error);
      throw error;
    }
  }

  static async searchBooks(searchParams) {
    try {
      return await Book.search(searchParams);  
    } catch(error) {
      console.error('Ошибка поиска книг: ', error);
      throw new Error('Не удалось выполнить поиск книг');
    }
  }

  static _validateBookData(bookData, requireAll = true) {
    const {title, author, year} = bookData;

    if(requireAll) {
      if (!title || typeof title !== 'string') {
        throw new Error('Название книги обязательно и должно быть строкой');
      }

      if (!author || typeof author !== 'string') {
        throw new Error('Автор книги обязателен и должен быть строкой');
      }

      if (!year || isNaN(parseInt(year))) {
        throw new Error('Год издания обязателен и должен быть числом');
      }
    } else {
      if(title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
        throw new Error('Название книги должно быть непустой строкой')
      }

      if(author !== undefined && (typeof author !== 'string' || author.trim() === '')) {
        throw new Error('Автор книги должен бть непустой строкой')
      }

      if(year !== undefined && isNaN(parseInt(year))) {
        throw new Error('Год издания должен быть числом');
      }
    }

    if(year && (parseInt(year) < 0 || parseInt(year) > new Date().getFullYear())) {
      throw new Error('Указан некорректный год издания');
    }

    return true;
  }
}

module.exports = BookService;