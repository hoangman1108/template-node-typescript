/* eslint-disable func-names */
import validator from 'validator';
import bcrypt from 'bcryptjs';
import mongoosePaginate from 'mongoose-paginate-v2';

import {
  Document, model, Schema, Model,
} from 'mongoose';
import { toJSON } from './plugins/toJSON.plugin';

import roles from '../config/roles';

export interface IUserDocument extends Document {
  name: string;
  email: string;
  password: string;
  roles: string;
  salt?: string;
  createdAt?: Date;
  updatedAt?: Date;
  isPasswordMatch: (password: string) => Promise<boolean>;
}
interface IUserModel extends Model<IUserDocument> {
  paginate: any;
  isEmailTaken: (email: string, excludeUserId?: Schema.Types.ObjectId) => Promise<boolean>;
}

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value: string) {
      if (!validator.isEmail(value)) {
        throw new Error('Invalid email');
      }
    },
  },
  salt: {
    type: String,
    trim: true,
    minlength: 8,
    private: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
},
{
  timestamps: true,
});

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(mongoosePaginate);

// check email exists
userSchema.statics.isEmailTaken = async function (email: string, excludeUserId?: Schema.Types.ObjectId): Promise<boolean> {
  let condition: any = {
    email,
  };
  if (excludeUserId) {
    condition = {
      ...condition,
      _id: { $ne: excludeUserId },
    };
  }
  const user = await this.findOne(condition);
  return !!user;
};

// compare password
userSchema.methods.isPasswordMatch = async function (password: string): Promise<boolean> {
  const user = this as IUserDocument;
  return bcrypt.compare(password, user.password);
};

// auto hash password when create account
userSchema.pre('save', async function (next) {
  const user = this as IUserDocument;
  if (user.isModified('password')) {
    const salt = await bcrypt.genSalt();
    user.salt = salt;
    user.password = await bcrypt.hash(user.password, user.salt);
  }
  next();
});

export const UserCollection = model<IUserDocument, IUserModel>('User', userSchema);
