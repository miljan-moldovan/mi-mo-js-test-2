import apiWrapper from '../utilities/apiWrapper';
import { storeForm, purgeForm } from './formCache';

export const SET_EMPLOYEES = 'employees/SET_EMPLOYEES';
export const SET_FILTERED_EMPLOYEES = 'employees/SET_FILTERED_EMPLOYEES';
export const SET_SHOW_CATEGORY_EMPLOYEES = 'employees/SET_SHOW_CATEGORY_EMPLOYEES';
export const SET_CATEGORY_EMPLOYEES = 'employees/SET_CATEGORY_EMPLOYEES';

export const GET_EMPLOYEES = 'employees/GET_EMPLOYEES';
export const GET_EMPLOYEES_SUCCESS = 'employees/GET_EMPLOYEES_SUCCESS';
export const GET_EMPLOYEES_FAILED = 'employees/GET_EMPLOYEES_FAILED';
export const GET_CATEGORY_EMPLOYEES = 'employees/GET_CATEGORY_EMPLOYEES';
export const SET_SELECTED_EMPLOYEE = 'employees/SET_SELECTED_EMPLOYEE';

export const POST_EMPLOYEES_APPOINTMENT_ORDER = 'employees/POST_EMPLOYEES_APPOINTMENT_ORDER';
export const POST_EMPLOYEES_APPOINTMENT_ORDER_SUCCESS = 'employees/POST_EMPLOYEES_APPOINTMENT_ORDER_SUCCESS';
export const POST_EMPLOYEES_APPOINTMENT_ORDER_FAILED = 'employees/POST_EMPLOYEES_APPOINTMENT_ORDER_FAILED';

const getEmployeesSuccess = employees => ({
  type: GET_EMPLOYEES_SUCCESS,
  data: { employees },
});

const getEmployeesFailed = error => ({
  type: GET_EMPLOYEES_FAILED,
  data: { error },
});

const getEmployees = () => (dispatch) => {
  dispatch({ type: GET_EMPLOYEES });
  return apiWrapper.doRequest('getEmployeesAppointmentOrder', {})
    .then(response => dispatch(getEmployeesSuccess(response)))
    .catch(error => dispatch(getEmployeesFailed(error)));
};

function setEmployees(employees) {
  return {
    type: SET_EMPLOYEES,
    data: { employees },
  };
}


function setSelectedEmployee(selectedEmployee) {
  return {
    type: SET_SELECTED_EMPLOYEE,
    data: { selectedEmployee },
  };
}

function setShowCategoryEmployees(showCategoryEmployees) {
  return {
    type: SET_SHOW_CATEGORY_EMPLOYEES,
    data: { showCategoryEmployees },
  };
}

function setCategoryEmployees(categoryEmployees) {
  return {
    type: SET_CATEGORY_EMPLOYEES,
    data: { categoryEmployees },
  };
}

function setFilteredEmployees(filtered) {
  return {
    type: SET_FILTERED_EMPLOYEES,
    data: { filtered },
  };
}


const postEmployeesAppointmentOrderSuccess = notes => ({
  type: POST_EMPLOYEES_APPOINTMENT_ORDER_SUCCESS,
  data: { notes },
});

const postEmployeesAppointmentOrderFailed = error => ({
  type: POST_EMPLOYEES_APPOINTMENT_ORDER_FAILED,
  data: { error },
});

const postEmployeesAppointmentOrder = appointmentOrders => (dispatch) => {
  dispatch({ type: POST_EMPLOYEES_APPOINTMENT_ORDER });
  return apiWrapper.doRequest('postEmployeesAppointmentOrder', {
    body: appointmentOrders,
  })
    .then((response) => {
      dispatch(purgeForm('AppointmentNoteScreenNew'));
      return dispatch(postEmployeesAppointmentOrderSuccess(response));
    })
    .catch((error) => {
      if (error.responseCode === apiConstants.responsesCodes.NetworkError) {
        dispatch(storeForm('AppointmentNoteScreenNew'));
      }
      return dispatch(postEmployeesAppointmentOrderFailed(error));
    });
};

const apptBookSetEmployeeOrderActions = {
  setEmployees,
  setFilteredEmployees,
  getEmployees,
  setShowCategoryEmployees,
  setCategoryEmployees,
  setSelectedEmployee,
  postEmployeesAppointmentOrder,
};

export default apptBookSetEmployeeOrderActions;
