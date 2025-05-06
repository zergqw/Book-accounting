const express = require('express');
const BookController = require('../controllers/bookController');

const router = express.Router();

router.get('/', BookController.getBooks)
router.get('/search', BookController.searchBooks)
router.get('/:id', BookController.getBookById)
router.post('/', BookController.addBook)
router.put('/:id', BookController.updateBook)
router.delete('/:id', BookController.deleteBook)

module.exports = router;