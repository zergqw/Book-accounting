const BookService = require('../services/bookService');

class BookController {
  static async getBooks(req, res, next) {
    try {
      const limit = parseInt(req.query.limit) || 100;
      const offset = parseInt(req.query.offset) || 0;

      const books = await BookService.getBooks(limit, offset);

      res.status(200).json({
        success: true,
        count: books.length,
        data: books,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getBookById(req, res, next) {
    try {
      const { id } = req.params;
      const book = await BookService.getBookById(id);

      res.status(200).json({
        success: true,
        data: book
      })
    } catch (error) {
      if(error.message === 'Книга не найдена') {
        res.status(404).json({
          success: false,
          error: 'Книга не найдена'
        })
      } else {
        next(error);
      }
    }
  }

  static async addBook(req, res, next) {
    try {
      const bookData = req.body;
      const newBook = await BookService.addBook(bookData);

      res.status(201).json({
        success: true,
        data: newBook
      });
    } catch (error) {
      if(error.message.includes('обязательно') || error.message.includes('должно быть')) {
        res.status(400).json({
          success: false,
          error: error.message
        });
      } else {
        next(error);
      }
    }
  }

  static async updateBook(req, res, next) {
    try {
      const {id} = req.params;
      const bookData = req.body;

      const updatedBook = await BookService.updateBook(id, bookData);

      res.status(200).json({
        success: true,
        data: updatedBook
      });
    } catch (error) {
      if(error.message === 'Книга не найдена') {
        res.status(400).json({
          success: false,
          error: 'Книга не найдена'
        });
      } else if(error.message.includes('должно быть')) {
        res.status(400).json({
          success: false,
          error: error.message
        });
      } else {
        next(error);
      }
    }
  }

  static async deleteBook(req, res, next) {
    try {
      const { id } = req.params;
      await BookService.deleteBook(id);

      res.status(200).json({
        success: true,
        data: {}
      });
    } catch (error) {
      if(error.message === 'Книга не найдена') {
        res.status(404).json({
          success: false,
          error: 'Книга не найдена'
        });
      } else {
        next(error);
      }
    }
  }

  static async searchBooks(req, res, next) {
    try {
      const { query } = req.query;
      const limit = parseInt(req.query.limit) || 100;
      const offset = parseInt(req.query.offset) || 0;

      const books = await BookService.searchBooks({ 
        query, 
        limit, 
        offset 
      });

      res.status(200).json({
        success: true,
        count: books.length,
        data: books
      });
    } catch (error) {
      next(error);
    }
  }
    
}

module.exports = BookController;