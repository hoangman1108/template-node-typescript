import {
  Document, model, Model, Schema,
} from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { LibCollection } from './library.model';

enum Status{
  DONE,
  READING
}
export interface IBookDocument extends Document{
  lib_id: Schema.Types.ObjectId;
  ord_date: Date;
  page: number;
  status: Status;
  name: string;
}

interface IBookModel extends Model<IBookDocument>{
  paginate: any;
}

const bookSchema = new Schema({
  lib_id: {
    type: Schema.Types.ObjectId,
    ref: LibCollection,
    required: true,
  },
  ord_date: {
    type: Date,
    required: true,
  },
  page: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: Status,
    default: 'READING',
  },
  name: {
    type: String,
    required: true,
  },
});

bookSchema.plugin(mongoosePaginate);

export const BookCollection = model<IBookDocument, IBookModel>('book', bookSchema);
