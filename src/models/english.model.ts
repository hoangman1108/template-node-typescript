import { Document, model, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export interface IEnglishDocument extends Document {
  request: string[];
  response: string;
}

// interface IEnglishModel extends Model<IEnglishDocument>{
// }

const englishSchema = new Schema({
  request: {
    type: [String],
    required: true,
  },
  response: {
    type: String,
    required: true,
  },
});

// englishSchema.index({ request: 'text' });
englishSchema.plugin(mongoosePaginate);

export const EnglishCollection = model<IEnglishDocument>('english', englishSchema);
