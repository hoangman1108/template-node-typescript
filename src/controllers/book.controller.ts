import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { PaginateOptions } from '../interfaces/mongose.interface';
import { IBookDocument } from '../models/book.model';
import BookService from '../services/book.service';
import { catchAsync } from '../utils/catchAsync';
import { pick } from '../utils/pick';

export default class BookController {
  private bookService: BookService;

  constructor() {
    this.bookService = new BookService();
  }

  createBook = catchAsync(async (req: Request, res: Response) => {
    const book:IBookDocument = await this.bookService.create(req.body);
    res.status(httpStatus.CREATED).send(book);
  });

  listBooks = catchAsync(async (req: Request, res: Response) => {
    const filter = pick(req.body, ['libId', 'author', 'status', 'name']);
    const options: PaginateOptions = pick(req.body, ['sortBy', 'typeSort', 'limit', 'page', 'populate']);
    if (options.sortBy) {
      if (options.sortBy === 'name') {
        options.sort = {
          name: 1,
        };
      } else if (options.sortBy === 'amount') {
        options.sort = {
          amount: 1,
        };
      }
      if (options.typeSort === 'desc') {
        options.sort[options.sortBy] = -1;
      }
      delete options.sortBy;
      delete options.typeSort;
    }
    const books = await this.bookService.list(filter, options);
    res.send(books);
  });
}
