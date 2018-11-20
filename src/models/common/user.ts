import { Maybe } from 'models';

export interface User {
  id: number;
  firstName: Maybe<string>;
  lastName: Maybe<string>;
  username: Maybe<string>;
  isPrimary: boolean;
}
