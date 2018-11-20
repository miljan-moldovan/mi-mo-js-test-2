import { AnyAction,  } from 'redux';
import { ErrorApi, ErrorApiResponse } from 'models';

export interface CustomAction extends AnyAction {
  data?: any;
  error?: (ErrorApi & ErrorApiResponse) | null;
}
