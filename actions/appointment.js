import moment from 'moment';
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

const postAppointmentResizeSuccess = (appointment, oldAppointment) => ({
  type: POST_APPOINTMENT_RESIZE_SUCCESS,
  data: { appointment, oldAppointment },
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

const postAppointmentResize = (appointmentId, params, oldAppointment) => (dispatch) => {
  dispatch({ type: POST_APPOINTMENT_RESIZE });
  return apiWrapper.doRequest('postAppointmentResize', {
    path: {
      appointmentId,
    },
    body: {
      ...params,
    },
  }).then(response => apiWrapper.doRequest('getAppointmentsById', {
    path: {
      id: appointmentId,
    }
  }).then(resp => dispatch(postAppointmentResizeSuccess(resp, oldAppointment))))
    .catch(error => dispatch(postAppointmentResizeFailed(error)));
};

const undoMove = () => (dispatch, getState) => {
  const { oldAppointment, undoType, apptGridSettings } = getState().appointmentScreenReducer;
  let params;
  switch (undoType) {
    case 'move': {
      params = {
        date: oldAppointment.date,
        newTime: oldAppointment.fromTime,
        employeeId: oldAppointment.employee.id,
      };
      dispatch({ type: UNDO_MOVE });
      return dispatch(postAppointmentMove(oldAppointment.id, params, null));
    }
    case 'resize': {
      const toTime = moment(oldAppointment.toTime, 'HH:mm');
      const fromTime = moment(oldAppointment.fromTime, 'HH:mm');
      const newLength = toTime.diff(fromTime, 'minutes') / apptGridSettings.step;
      params = {
        newLength,
      };
      dispatch({ type: UNDO_MOVE });
      return dispatch(postAppointmentResize(oldAppointment.id, params, null));
    }
    default:
      break;
  }

};


const appointmentActions = {
  addAppointment,
  getAppoinments,
  postAppointmentMove,
  postAppointmentResize,
  undoMove,
};

export default appointmentActions;
