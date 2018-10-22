import { get, isFunction, isNumber } from 'lodash';
import { showErrorAlert } from './utils';
import { Queue, Services } from '../utilities/apiWrapper';

export const GET_APPOINTMENT = 'appointmentDetails/GET_APPOINTMENT';
export const GET_APPOINTMENT_SUCCESS = 'appointmentDetails/GET_APPOINTMENT_SUCCESS';
export const GET_APPOINTMENT_FAILED = 'appointmentDetails/GET_APPOINTMENT_FAILED';
export const GET_SERVICE_CHECK = 'appointmentDetails/GET_SERVICE_CHECK';
export const GET_SERVICE_CHECK_SUCCESS = 'appointmentDetails/GET_SERVICE_CHECK_SUCCESS';
export const GET_SERVICE_CHECK_FAILED = 'appointmentDetails/GET_SERVICE_CHECK_FAILED';
export const UPDATE_APPOINTMENT = 'appointmentDetails/UPDATE_APPOINTMENT';
export const UPDATE_APPOINTMENT_SUCCESS = 'appointmentDetails/UPDATE_APPOINTMENT_SUCCESS';
export const UPDATE_APPOINTMENT_FAILED = 'appointmentDetails/UPDATE_APPOINTMENT_FAILED';

const setAppointment = appointmentId => (dispatch) => {
  dispatch({ type: GET_APPOINTMENT });
  Queue.getQueueById(appointmentId)
    .then(appointment => dispatch({ type: GET_APPOINTMENT_SUCCESS, data: { appointment } }))
    .catch(error => dispatch({ type: GET_APPOINTMENT_FAILED, data: { error } }));
};

const updateAppointment = (clientId, serviceEmployeeClientQueues, productEmployeeClientQueues, onSuccess, onFailed) =>
  async (dispatch, getState) => {
    const { appointment } = getState().queueDetailReducer;
    const apptId = get(appointment, 'id', null);
    dispatch({ type: UPDATE_APPOINTMENT });
    const req = {
      clientId,
      serviceEmployeeClientQueues,
      productEmployeeClientQueues,
    };
    return Queue.putQueue(apptId, req)
      .then((appt) => {
        dispatch({
          type: UPDATE_APPOINTMENT_SUCCESS,
          data: { appt },
        });
        if (isFunction(onSuccess)) {
          onSuccess();
        }
      })
      .catch((error) => {
        showErrorAlert(error);
        dispatch({ type: UPDATE_APPOINTMENT_FAILED });
        if (isFunction(onFailed)) {
          onFailed(error);
        }
      });
  };

const getServiceCheck = (employee, service) => async (dispatch, getState) => {
  dispatch({ type: GET_SERVICE_CHECK });
  const employeeId = isNumber(employee) ? employee : get(employee, 'id', false);
  const serviceId = isNumber(service) ? service : get(service, 'id', false);
  return Services.getServiceEmployeeCheck({ employeeId, serviceId })
    .then(result => dispatch({
      type: GET_SERVICE_CHECK_SUCCESS,
      data: { result },
    }))
    .catch((error) => {
      showErrorAlert(error);
      dispatch({
        type: GET_SERVICE_CHECK_FAILED,
        data: { error },
      });
    });
};
const queueDetailActions = {
  setAppointment,
  getServiceCheck,
  updateAppointment,
};

export default queueDetailActions;
