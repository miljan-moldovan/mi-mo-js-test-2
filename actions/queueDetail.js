import { get } from 'lodash';
import { showErrorAlert } from './utils';
import { Queue } from '../utilities/apiWrapper';

export const GET_APPOINTMENT = 'appointmentDetails/GET_APPOINTMENT';
export const GET_APPOINTMENT_SUCCESS = 'appointmentDetails/GET_APPOINTMENT_SUCCESS';
export const GET_APPOINTMENT_FAILED = 'appointmentDetails/GET_APPOINTMENT_FAILED';
export const UPDATE_APPOINTMENT = 'appointmentDetails/UPDATE_APPOINTMENT';
export const UPDATE_APPOINTMENT_SUCCESS = 'appointmentDetails/UPDATE_APPOINTMENT_SUCCESS';
export const UPDATE_APPOINTMENT_FAILED = 'appointmentDetails/UPDATE_APPOINTMENT_FAILED';

const setAppointment = appointmentId => (dispatch) => {
  dispatch({ type: GET_APPOINTMENT });
  Queue.getQueueById(appointmentId)
    .then(appointment => dispatch({ type: GET_APPOINTMENT_SUCCESS, data: { appointment } }))
    .catch(error => dispatch({ type: GET_APPOINTMENT_FAILED, data: { error } }));
};

const updateAppointment = (clientId, serviceEmployeeClientQueues, productEmployeeClientQueues) =>
  (dispatch, getState) => {
    const { appointment } = getState().queueDetailReducer;
    const apptId = get(appointment, 'id', null);
    dispatch({ type: UPDATE_APPOINTMENT });
    const req = {
      clientId,
      serviceEmployeeClientQueues,
      productEmployeeClientQueues,
    };
    Queue.putQueue(apptId, req)
      .then(appt => dispatch({
        type: UPDATE_APPOINTMENT_SUCCESS,
        data: { appt },
      }))
      .catch((error) => {
        showErrorAlert(error);
        dispatch({ type: UPDATE_APPOINTMENT_FAILED });
      });
  };

const queueDetailActions = {
  setAppointment,
  updateAppointment,
};

export default queueDetailActions;
