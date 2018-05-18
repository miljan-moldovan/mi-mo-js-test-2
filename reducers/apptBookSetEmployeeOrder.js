import apptBookSetEmployeeOrderActions, {
  SET_EMPLOYEES,
  SET_FILTERED_EMPLOYEES,
  SET_SHOW_CATEGORY_EMPLOYEES,
  GET_EMPLOYEES,
  GET_EMPLOYEES_SUCCESS,
  GET_EMPLOYEES_FAILED,
  GET_SHOW_CATEGORY_EMPLOYEES,
  SET_CATEGORY_EMPLOYEES,
  GET_CATEGORY_EMPLOYEES,
  SET_SELECTED_EMPLOYEE,
  SET_ORDER_INITIALS,
} from '../actions/apptBookSetEmployeeOrder';

const initialState = {
  filtered: [],
  employees: [],
  showCategoryEmployees: false,
  categoryEmployees: [],
  selectedEmployee: {},
  orderInitials: '',
};

export default function employeeReducer(state = initialState, action) {
  const { type, data } = action;
  switch (type) {
    case SET_ORDER_INITIALS:
      return {
        ...state,
        orderInitials: data.orderInitials,
      };
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
    case GET_SHOW_CATEGORY_EMPLOYEES:
      return {
        ...state,
        isLoading: true,
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
    default:
      return state;
  }
}
