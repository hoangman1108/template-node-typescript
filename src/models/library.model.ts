/* eslint-disable func-names */
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
  idNotExists: (id: string) => Promise<boolean>;
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

libSchema.statics.isNameTaken = async function (name: string): Promise<boolean> {
  const user = await this.findOne({ name });
  return !!user;
};

libSchema.statics.idNotExists = async function (id: string): Promise<boolean> {
  const lib = await this.findById(id);
  return !lib;
};

export const LibCollection = model<ILibraryDocument, ILibraryModel>('library', libSchema);
