import apiWrapper from '../utilities/apiWrapper';

export const GET_APPOINTMENTS = 'appointment/GET_APPOINTMENTS';
export const GET_APPOINTMENTS_SUCCESS = 'appointment/GET_APPOINTMENTS_SUCCESS';
export const GET_APPOINTMENTS_FAILED = 'appointment/GET_APPOINTMENTS_FAILED';

const getAppointmentsSuccess = appointmentResponse => ({
  type: GET_APPOINTMENTS_SUCCESS,
  data: { appointmentResponse },
});

const getAppointmentsFailed = error => ({
  type: GET_APPOINTMENTS_FAILED,
  data: { error },
});

const getAppoinments = date => (dispatch) => {
  dispatch({ type: GET_APPOINTMENTS });
  return apiWrapper.doRequest('getAppointmentsByDate', {
    path: {
      date,
    },
  })
    .then(response => dispatch(getAppointmentsSuccess(response)))
    .catch(error => dispatch(getAppointmentsFailed(error)));
};

const appointmentActions = {
  getAppoinments,
};

export default appointmentActions;
