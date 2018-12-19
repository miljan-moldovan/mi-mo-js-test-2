import {
  GET_SESSION_DATA,
  GET_SESSION_DATA_SUCCESS,
  GET_SESSION_DATA_FAILED,
  GET_EMPLOYEE_DATA,
  GET_EMPLOYEE_DATA_SUCCESS,
  GET_EMPLOYEE_DATA_FAILED,
} from '../actions/user';
import { Maybe, PureProvider } from '@/models';

const initialState: UserInfoReducer = {
  isLoading: false,
  userId: null,
  guardUserId: 0,
  centralEmployeeId: 0,
  employeeId: 0,
  storeKey: 0,
  baseHost: '',
  currentEmployee: null,
};

export interface UserInfoReducer {
  isLoading: boolean;
  userId: Maybe<number>;
  guardUserId: Maybe<number>;
  centralEmployeeId: Maybe<number>;
  employeeId: Maybe<number>;
  storeKey: Maybe<number>;
  baseHost: string;
  currentEmployee: Maybe<PureProvider>;
}

const userInfoReducer = (state: UserInfoReducer = initialState, action): UserInfoReducer => {
  const { type, data = {} } = action;
  switch (type) {
    case GET_SESSION_DATA:
      return {
        ...state,
        isLoading: true,
      };
    case GET_SESSION_DATA_SUCCESS:
      return {
        ...state,
        isLoading: false,
        userId: data.info.userId,
        employeeId: data.info.employeeId,
        currentEmployee: data.employee,
      };
    case GET_EMPLOYEE_DATA:
      return {
        ...state,
        isLoading: true,
      };
    case GET_EMPLOYEE_DATA_SUCCESS:
      return {
        ...state,
        isLoading: false,
        currentEmployee: data.employee,
      };
    default:
      break;
  }
  return state;
};
export default userInfoReducer;
