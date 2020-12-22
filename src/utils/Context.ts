import { Request } from 'express';

export type CoolRequest = Request & {
  session: {
    userId: string;
  };
};
