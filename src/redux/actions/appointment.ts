import moment from 'moment';
import { Appointment } from '../../utilities/apiWrapper';
import { appointmentCalendarActions } from './appointmentBook';

export const POST_APPOINTMENT_MOVE = 'appointment/POST_APPOINTMENT_MOVE';
export const POST_APPOINTMENT_MOVE_SUCCESS = 'appointment/POST_APPOINTMENT_MOVE_SUCCESS';
export const POST_APPOINTMENT_MOVE_FAILED = 'appointment/POST_APPOINTMENT_MOVE_FAILED';
export const POST_APPOINTMENT_RESIZE = 'appointment/POST_APPOINTMENT_RESIZE';
export const POST_APPOINTMENT_RESIZE_SUCCESS = 'appointment/POST_APPOINTMENT_RESIZE_SUCCESS';
export const POST_APPOINTMENT_RESIZE_FAILED = 'appointment/POST_APPOINTMENT_RESIZE_FAILED';
export const POST_APPOINTMENT_CANCEL = 'appointment/POST_APPOINTMENT_CANCEL';
export const POST_APPOINTMENT_CANCEL_SUCCESS = 'appointment/POST_APPOINTMENT_CANCEL_SUCCESS';
export const POST_APPOINTMENT_CANCEL_FAILED = 'appointment/POST_APPOINTMENT_CANCEL_FAILED';
export const POST_APPOINTMENT_CHECKIN = 'appointment/POST_APPOINTMENT_CHECKIN';
export const POST_APPOINTMENT_CHECKIN_SUCCESS = 'appointment/POST_APPOINTMENT_CHECKIN_SUCCESS';
export const POST_APPOINTMENT_CHECKIN_FAILED = 'appointment/POST_APPOINTMENT_CHECKIN_FAILED';
export const POST_APPOINTMENT_CHECKOUT = 'appointment/POST_APPOINTMENT_CHECKOUT';
export const POST_APPOINTMENT_CHECKOUT_SUCCESS = 'appointment/POST_APPOINTMENT_CHECKOUT_SUCCESS';
export const POST_APPOINTMENT_CHECKOUT_FAILED = 'appointment/POST_APPOINTMENT_CHECKOUT_FAILED';
export const UNDO_MOVE = 'appointment/UNDO_MOVE';
export const UNDO_MOVE_SUCCESS = 'appointment/UNDO_MOVE_SUCCESS';
export const CHECK_APPT_CONFLICTS = 'appointment/CHECK_APPT_CONFLICTS';
export const CHECK_APPT_CONFLICTS_SUCCESS = 'appointment/CHECK_APPT_CONFLICTS_SUCCESS';
export const CHECK_APPT_CONFLICTS_FAILED = 'appointment/CHECK_APPT_CONFLICTS_FAILED';

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

const postAppointmentCancelSuccess = () => ({
  type: POST_APPOINTMENT_CANCEL_SUCCESS,
});

const postAppointmentCancelFailed = error => ({
  type: POST_APPOINTMENT_CANCEL_FAILED,
  data: { error },
});

const postAppointmentMove = (appointmentId, params, oldAppointment) => (dispatch) => {
  dispatch({ type: POST_APPOINTMENT_MOVE });

  return Appointment.postAppointmentMove(appointmentId, params)
    .then(resp =>
      dispatch(appointmentCalendarActions.setGridView()).then(() =>
        dispatch(postAppointmentMoveSuccess(resp, oldAppointment))))
    .catch(error => dispatch(postAppointmentMoveFailed(error)));
};

const postAppointmentResize = (appointmentId, params, oldAppointment) => (dispatch) => {
  dispatch({ type: POST_APPOINTMENT_RESIZE });
  return Appointment.postAppointmentResize(appointmentId, params)
    .then(resp => dispatch(appointmentCalendarActions.setGridView())
      .then(() => dispatch(postAppointmentResizeSuccess(resp, oldAppointment))))
    .catch(error => dispatch(postAppointmentResizeFailed(error)));
};

const postAppointmentCancel = ({
  appointmentIds, appointmentCancellation,
}) => (dispatch) => {
  dispatch({ type: POST_APPOINTMENT_CANCEL });
  return Appointment.postAppointmentCancel({
    appointmentIds, appointmentCancellation,
  })
    .then(() => {
      dispatch(appointmentCalendarActions.setGridView());
      return dispatch(postAppointmentCancelSuccess());
    })
    .catch(error => dispatch(postAppointmentCancelFailed(error)));
};

const undoMove = () => (dispatch, getState) => {
  const { oldAppointment, undoType, apptGridSettings } = getState().appointmentBookReducer;
  let params;
  switch (undoType) {
    case 'move': {
      const resourceId = oldAppointment.resource ? oldAppointment.resource.id : null;
      const resourceOrdinal = oldAppointment.resource ? oldAppointment.resourceOrdinal : null;
      const roomId = oldAppointment.room ? oldAppointment.room.id : null;
      const roomOrdinal = oldAppointment.room ? oldAppointment.roomOrdinal : null;
      params = {
        date: oldAppointment.date,
        newTime: oldAppointment.fromTime,
        employeeId: oldAppointment.employee.id,
        resourceId,
        resourceOrdinal,
        roomId,
        roomOrdinal,
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
      return null;
  }
};

const postAppointmentCheckinFailed = error => ({
  type: POST_APPOINTMENT_CHECKIN_FAILED,
  data: { error },
});

const postAppointmentCheckinSuccess = () => ({
  type: POST_APPOINTMENT_CHECKIN_SUCCESS,
});

const postAppointmentCheckin = appointmentId => (dispatch) => {
  dispatch({ type: POST_APPOINTMENT_CHECKIN });
  return Appointment.postCheckin(appointmentId)
    .then(() => dispatch(appointmentCalendarActions.setGridView())
        .then(() => dispatch(postAppointmentCheckinSuccess())),
    )
    .catch(error => dispatch(postAppointmentCheckinFailed(error)));
};

const postAppointmentCheckoutFailed = error => ({
  type: POST_APPOINTMENT_CHECKOUT_FAILED,
  data: { error },
});

const postAppointmentCheckoutSuccess = () => ({
  type: POST_APPOINTMENT_CHECKOUT_SUCCESS,
});

const postAppointmentCheckout = appointmentId => (dispatch) => {
  dispatch({ type: POST_APPOINTMENT_CHECKOUT });
  return Appointment.postAppointmentCheckout(appointmentId)
    .then(() => {
      return dispatch(appointmentCalendarActions.setGridView())
        .then(() => dispatch(postAppointmentCheckoutSuccess()));
    })
    .catch(error => dispatch(postAppointmentCheckoutFailed(error)));
};


const appointmentActions = {
  postAppointmentCancel,
  postAppointmentMove,
  postAppointmentResize,
  postAppointmentCheckin,
  postAppointmentCheckout,
  undoMove,
};

export interface AppointmentActions {
  addAppointment: (appt: any) => void;
  getAppoinments: (date: string) => void;
  postAppointmentCancel: (data: { appointmentIds: any, appointmentCancelation: any }) => void;
  postAppointmentMove: (id: any, params: any, oldAppt: any) => void;
  postAppointmentResize: (id: any, params: any, oldAppt: any) => void;
  postAppointmentCheckin: (id: any) => void;
  postAppointmentCheckout: (id: any) => void;
  undoMove: () => void;
}

export default appointmentActions;
