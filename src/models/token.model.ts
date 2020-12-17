import { Document, Schema, model } from 'mongoose';
import moment from 'moment';
import { toJSON } from './plugins/toJSON.plugin';
import { tokenTypes } from '../config/tokens';

export type IToken = Document & {
  token: string;
  user: Schema.Types.ObjectId;
  type: string;
  expires: moment.Moment;
  blacklisted: Boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

const tokenSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: [tokenTypes.REFRESH, tokenTypes.RESET_PASSWORD],
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
    blacklisted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
tokenSchema.plugin(toJSON);

export const TokenCollection = model<IToken>('Token', tokenSchema);
