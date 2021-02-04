import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { PaginateOptions } from '../interfaces/mongose.interface';
import EnglishService from '../services/english.service';
import { catchAsync } from 'catch-async-express';
import { pick } from '../utils/pick';

export default class EnglishController {
  private englishService: EnglishService;

  constructor() {
    this.englishService = new EnglishService();
  }

  createEnglish = catchAsync(async (req: Request, res: Response) => {
    const english = await this.englishService.create(req.body);
    res.status(httpStatus.CREATED).send(english);
  });

  listEnglish = catchAsync(async (req: Request, res: Response) => {
    const filter = pick(req.body, ['request']);
    const options: PaginateOptions = pick(req.body, ['sortBy', 'typeSort', 'limit', 'page']);
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
    const result = await this.englishService.list(filter, options);
    res.status(httpStatus.OK).send(result);
  });

  findEnglish = catchAsync(async (req: Request, res: Response) => {
    const result = await this.englishService.find(req.body.request);
    res.send(result);
  });
}
