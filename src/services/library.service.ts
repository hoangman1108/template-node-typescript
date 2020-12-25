import httpStatus from 'http-status';
import { ILibraryDocument, LibCollection } from '../models/library.model';
import ApiError from '../utils/ApiError';
import { PaginateOptions } from '../interfaces/mongose.interface';

export default class LibraryService {
  async create(data: ILibraryDocument): Promise<ILibraryDocument> {
    if (await LibCollection.isNameTaken(data.name)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Name is already taken');
    }
    return LibCollection.create(data).then((library) => {
      if (library) return library;

      throw new ApiError(422, 'Library cannot be created');
    });
  }

  list(filter: any, options: PaginateOptions): Promise<ILibraryDocument[]> {
    return LibCollection.paginate(filter, options);
  }

  delete(id: string): Promise<string> {
    return LibCollection.findByIdAndDelete(id).then((result) => {
      if (result) return 'Delete Success';
      throw new ApiError(httpStatus.BAD_REQUEST, 'Library cannot deleted');
    });
  }
}
