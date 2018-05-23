import apiWrapper from '../utilities/apiWrapper';

export const ADD_APPOINTMENT = 'appointment/ADD_APPOINTMENT';
export const GET_APPOINTMENTS = 'appointment/GET_APPOINTMENTS';
export const GET_APPOINTMENTS_SUCCESS = 'appointment/GET_APPOINTMENTS_SUCCESS';
export const GET_APPOINTMENTS_FAILED = 'appointment/GET_APPOINTMENTS_FAILED';
export const POST_APPOINTMENT_MOVE = 'appointment/POST_APPOINTMENT_MOVE';
export const POST_APPOINTMENT_MOVE_SUCCESS = 'appointment/POST_APPOINTMENT_MOVE_SUCCESS';
export const POST_APPOINTMENT_MOVE_FAILED = 'appointment/POST_APPOINTMENT_MOVE_FAILED';
export const POST_APPOINTMENT_RESIZE = 'appointment/POST_APPOINTMENT_RESIZE';
export const POST_APPOINTMENT_RESIZE_SUCCESS = 'appointment/POST_APPOINTMENT_RESIZE_SUCCESS';
export const POST_APPOINTMENT_RESIZE_FAILED = 'appointment/POST_APPOINTMENT_RESIZE_FAILED';
export const UNDO_MOVE = 'appointment/UNDO_MOVE';
export const UNDO_MOVE_SUCCESS = 'appointment/UNDO_MOVE_SUCCESS';

const addAppointment = appointment => ({
  type: ADD_APPOINTMENT,
  data: { appointment },
});

const getAppointmentsSuccess = appointmentResponse => ({
  type: GET_APPOINTMENTS_SUCCESS,
  data: { appointmentResponse },
});

const getAppointmentsFailed = error => ({
  type: GET_APPOINTMENTS_FAILED,
  data: { error },
});

const postAppointmentMoveSuccess = (appointment, oldAppointment) => ({
  type: POST_APPOINTMENT_MOVE_SUCCESS,
  data: { appointment, oldAppointment },
});

const postAppointmentMoveFailed = error => ({
  type: POST_APPOINTMENT_MOVE_FAILED,
  data: { error },
});

const postAppointmentResizeSuccess = response => ({
  type: POST_APPOINTMENT_RESIZE_SUCCESS,
  data: { response },
});

const postAppointmentResizeFailed = error => ({
  type: POST_APPOINTMENT_RESIZE_FAILED,
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

const postAppointmentMove = (appointmentId, params, oldAppointment) => (dispatch) => {
  dispatch({ type: POST_APPOINTMENT_MOVE });
  return apiWrapper.doRequest('postAppointmentMove', {
    path: {
      appointmentId,
    },
    body: {
      ...params,
    },
  })
    .then(response => apiWrapper.doRequest('getAppointmentsById', {
      path: {
        id: appointmentId,
      }}).then(resp => dispatch(postAppointmentMoveSuccess(resp, oldAppointment))))
    .catch(error => dispatch(postAppointmentMoveFailed(error)));
};

const undoMove = () => (dispatch, getState) => {
  const { oldAppointmet } = getState().appointmentScreenReducer;
  const params = {
    date: oldAppointmet.date,
    newTime: oldAppointmet.fromTime,
    employeeId: oldAppointmet.employee.id,
  };
  dispatch({ type: UNDO_MOVE });
  return dispatch(postAppointmentMove(oldAppointmet.id, params, null));
};

const postAppointmentResize = (appointmentId, params) => (dispatch) => {
  dispatch({ type: POST_APPOINTMENT_RESIZE });
  return apiWrapper.doRequest('postAppointmentResize', {
    path: {
      appointmentId,
    },
    body: {
      ...params,
    },
  })
    .then(response => dispatch(postAppointmentResizeSuccess(response)))
    .catch(error => dispatch(postAppointmentResizeFailed(error)));
};

const appointmentActions = {
  addAppointment,
  getAppoinments,
  postAppointmentMove,
  postAppointmentResize,
  undoMove,
};

export default appointmentActions;
