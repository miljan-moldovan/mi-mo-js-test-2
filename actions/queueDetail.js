import { Queue } from '../utilities/apiWrapper';

export const GET_APPOINTMENT = 'appointmentDetails/GET_APPOINTMENT';
export const GET_APPOINTMENT_SUCCESS = 'appointmentDetails/GET_APPOINTMENT_SUCCESS';
export const GET_APPOINTMENT_FAILED = 'appointmentDetails/GET_APPOINTMENT_FAILED';

const setAppointment = appointmentId => (dispatch) => {
  dispatch({ type: GET_APPOINTMENT });
  Queue.getQueueById(appointmentId)
    .then(appointment => dispatch({ type: GET_APPOINTMENT_SUCCESS, data: { appointment } }))
    .catch(error => dispatch({ type: GET_APPOINTMENT_FAILED, data: { error } }));
};

const queueDetailActions = {
  setAppointment,
};

export default queueDetailActions;
