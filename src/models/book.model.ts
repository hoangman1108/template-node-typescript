import {
  Document, model, Model, Schema,
} from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { LibCollection } from './library.model';

enum Status {
  DONE,
  READING
}
export interface IBookDocument extends Document {
  libId: string;
  ordDate?: Date;
  author: string;
  status: Status;
  name: string;
}

interface IBookModel extends Model<IBookDocument> {
  paginate: any;
  isNameTaken: (name: string, libId: string) => Promise<boolean>;
}

const bookSchema = new Schema({
  libId: {
    type: Schema.Types.ObjectId,
    ref: LibCollection,
    required: true,
  },
  ordDate: {
    type: Date,
    required: true,
    default: new Date(),
  },
  author: {
    type: String,
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

// eslint-disable-next-line func-names
bookSchema.statics.isNameTaken = async function (name: string, libId: string): Promise<boolean> {
  const user = await this.findOne({ name, libId });
  return !!user;
};

export const BookCollection = model<IBookDocument, IBookModel>('book', bookSchema);
