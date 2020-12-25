import express from 'express';
import BookController from '../controllers/book.controller';
import validate from '../middlewares/validate';
import bookValidator from '../validations/book.validation';

const router = express.Router();
const bookController = new BookController();

router.route('/')
  .post(validate(bookValidator.createBook), bookController.createBook)
  .get(validate(bookValidator.getBooks), bookController.listBooks);

export default router;
