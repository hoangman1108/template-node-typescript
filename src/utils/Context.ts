import { Request } from 'express';
import { IGenerateAuthTokens } from '../interfaces/auth.interface';

export type CoolRequest = Request & {
  session: {
    userId: string;
    tokens: IGenerateAuthTokens;
  };
};
