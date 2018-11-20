import { Maybe } from 'models';

export interface SelectValue {
  label: string;
  id: Maybe<number>;
}

export interface SelectOption {
  label?: string;
  value: Maybe<number>;
}
