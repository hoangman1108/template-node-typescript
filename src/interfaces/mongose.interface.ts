import {
  CollationOptions, CustomLabels, QueryFindOptions, QueryPopulateOptions, ReadOptions,
} from 'mongoose';

export interface PaginateOptions {
  select?: object | string;
  sort?: object | string;
  customLabels?: CustomLabels;
  collation?: CollationOptions;
  populate?: object[] | string[] | object | string | QueryPopulateOptions;
  lean?: boolean;
  leanWithId?: boolean;
  offset?: number;
  page?: number;
  limit?: number;
  read?: ReadOptions;
  /* If pagination is set to `false`, it will return all docs without adding limit condition. (Default: `true`) */
  pagination?: boolean;
  projection?: any;
  options?: QueryFindOptions;
}
