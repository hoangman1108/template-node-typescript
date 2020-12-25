import { Request, Response } from 'express';
import httpStatus from 'http-status';
import LibraryService from '../services/library.service';
import { catchAsync } from '../utils/catchAsync';
import { pick } from '../utils/pick';

export default class LibraryController {
  private libService: LibraryService;

  constructor() {
    this.libService = new LibraryService();
  }

  createLib = catchAsync(async (req: Request, res: Response) => {
    const user = await this.libService.create(req.body);
    res.status(httpStatus.CREATED).send(user);
  });

  listLib = catchAsync(async (req: Request, res: Response) => {
    const filter = pick(req.body, ['name', 'amount']);
    const options = pick(req.body, ['sortBy', 'typeSort', 'limit', 'page']);
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
    const result = await this.libService.list(filter, options);
    res.status(httpStatus.OK).send(result);
  });
}
