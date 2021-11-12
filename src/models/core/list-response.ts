import { Maybe } from '@/models';

export interface ListResponse<T> {
  total: number;
  totalReturned: number;
  response: T;
  result: number;
  userMessage: Maybe<string>;
}
