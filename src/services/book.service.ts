import httpStatus from 'http-status';
import { Types } from 'mongoose';

import { PaginateOptions } from '../interfaces/mongose.interface';
import { BookCollection, IBookDocument } from '../models/book.model';
import { LibCollection } from '../models/library.model';
import ApiError from '../utils/ApiError';

export default class BookService {
  async create(data: IBookDocument): Promise<IBookDocument> {
    if (await LibCollection.idNotExists(data.libId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'libId is not exist');
    }
    if (await BookCollection.isNameTaken(data.name, data.libId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Name book is already taken');
    }
    return BookCollection.create(data).then((book: IBookDocument | null) => {
      if (book) return book;

      throw new ApiError(422, 'Book cannot be created');
    });
  }

  async list(filter: any, query: PaginateOptions) {
    await LibCollection.aggregate([
      { $match: { _id: null } },
      {
        $group: {
          _id: null,
          total: {
            $sum: '$amount',
          },
          average_transaction_amount: {
            $avg: '$amount',
          },
          min_transaction_amount: {
            $min: '$amount',
          },
          max_transaction_amount: {
            $max: '$amount',
          },
        },
      },
    ]).then((value: any) => {
      console.log(value);
    });
    return BookCollection.paginate(filter, query);
  }
}
