import {
  Document, model, Model, Schema,
} from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { toJSON } from './plugins/toJSON.plugin';

export interface ILibraryDocument extends Document {
  name: string;
  amount: number;
}

interface ILibraryModel extends Model<ILibraryDocument> {
  paginate: any;
  isNameTaken: (name: string) => Promise<boolean>;
}

const libSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});
libSchema.plugin(toJSON);
libSchema.plugin(mongoosePaginate);

// check email exists
// eslint-disable-next-line func-names
libSchema.statics.isNameTaken = async function (name: string): Promise<boolean> {
  const user = await this.findOne({ name });
  return !!user;
};

export const LibCollection = model<ILibraryDocument, ILibraryModel>('library', libSchema);
