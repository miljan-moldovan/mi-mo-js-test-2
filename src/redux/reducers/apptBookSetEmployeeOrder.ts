import apptBookSetEmployeeOrderActions, {
  SET_EMPLOYEES,
  SET_FILTERED_EMPLOYEES,
  SET_SHOW_CATEGORY_EMPLOYEES,
  GET_EMPLOYEES,
  GET_EMPLOYEES_SUCCESS,
  GET_EMPLOYEES_FAILED,
  SET_CATEGORY_EMPLOYEES,
  GET_CATEGORY_EMPLOYEES,
  SET_SELECTED_EMPLOYEE,
  POST_EMPLOYEES_APPOINTMENT_ORDER_SUCCESS,
} from '../actions/apptBookSetEmployeeOrder';
import { PureProvider, Maybe } from '@/models';

const initialState: EmployeeOrderReducer = {
  isLoading: false,
  filtered: [],
  employees: [],
  showCategoryEmployees: false,
  categoryEmployees: [],
  selectedEmployee: null,
  orderInitials: '',
  error: null,
};

export interface EmployeeOrderReducer {
  isLoading: boolean;
  error: Maybe<any>;
  filtered: PureProvider[];
  employees: PureProvider[];
  showCategoryEmployees: boolean;
  categoryEmployees: any[];
  selectedEmployee: Maybe<PureProvider>;
  orderInitials: string;
}

export default function employeeOrderReducer(state: EmployeeOrderReducer = initialState, action): EmployeeOrderReducer {
  const { type, data } = action;
  switch (type) {
    case GET_CATEGORY_EMPLOYEES:
      return {
        ...state,
        isLoading: true,
      };
    case SET_CATEGORY_EMPLOYEES:
      return {
        ...state,
        error: null,
        categoryEmployees: data.categoryEmployees,
      };
    case SET_SHOW_CATEGORY_EMPLOYEES:
      return {
        ...state,
        error: null,
        showCategoryEmployees: data.showCategoryEmployees,
      };
    case GET_EMPLOYEES:
      return {
        ...state,
        isLoading: true,
      };
    case GET_EMPLOYEES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        employees: data.employees,
        orderInitials: data.orderInitials,
        error: null,
      };
    case GET_EMPLOYEES_FAILED:
      return {
        ...state,
        isLoading: false,
        error: data.error,
        employees: [],
      };
    case SET_EMPLOYEES:
      return {
        ...state,
        error: null,
        employees: data.employees,
      };
    case SET_SELECTED_EMPLOYEE:
      return {
        ...state,
        error: null,
        selectedEmployee: data.selectedEmployee,
      };
    case SET_FILTERED_EMPLOYEES:
      return {
        ...state,
        error: null,
        filtered: data.filtered,
      };
    case POST_EMPLOYEES_APPOINTMENT_ORDER_SUCCESS:
      return {
        ...state,
        employees: data.employees,
        orderInitials: data.orderInitials,
      };
    default:
      return state;
  }
}
