import httpStatus from 'http-status';
// import { PaginateOptions } from '../interfaces/mongose.interface';
import { ILibraryDocument, LibCollection } from '../models/library.model';
import ApiError from '../utils/ApiError';

export default class LibraryService {
  async create(data: ILibraryDocument) {
    if (await LibCollection.isNameTaken(data.name)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Name is already taken');
    }
    return LibCollection.create(data).then((library) => {
      if (library) return library;

      throw new ApiError(422, 'Library cannot be created');
    });
  }

  list(filter: any, options: any) {
    return LibCollection.paginate(filter, options);
  }
}
