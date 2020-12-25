import httpStatus from 'http-status';
import { PaginateOptions } from '../interfaces/mongose.interface';
import { BookCollection, IBookDocument } from '../models/book.model';
import { LibCollection } from '../models/library.model';
import ApiError from '../utils/ApiError';

export default class BookService {
  async create(data: IBookDocument): Promise<IBookDocument> {
    console.log(await LibCollection.idNotExists(data.libId));
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

  list(filter: any, query: PaginateOptions) {
    return BookCollection.paginate(filter, query);
  }
}
