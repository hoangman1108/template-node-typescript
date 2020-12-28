import { PaginateOptions } from '../interfaces/mongose.interface';
import { EnglishCollection, IEnglishDocument } from '../models/english.model';
import ApiError from '../utils/ApiError';

export default class EnglishService {
  create(data: IEnglishDocument): Promise<IEnglishDocument> {
    return EnglishCollection.create(data).then((result: IEnglishDocument | null) => {
      if (!result) throw new ApiError(422, 'Language created failed');
      return result;
    });
  }

  list(filter: any, options: PaginateOptions) {
    return EnglishCollection.paginate(filter, options);
  }

  find(request: string) {
    return EnglishCollection.find({ $text: { $search: request } });
  }
}
