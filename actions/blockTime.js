import moment from 'moment';

import { AppointmentBook } from '../utilities/apiWrapper';
import { appointmentCalendarActions } from './appointmentBook';

export const POST_BLOCKTIME = 'appointmentBook/POST_BLOCKTIME';
export const POST_BLOCKTIME_SUCCESS = 'appointmentBook/POST_BLOCKTIME_SUCCESS';
export const POST_BLOCKTIME_FAILED = 'appointmentBook/POST_BLOCKTIME_FAILED';
export const PUT_BLOCKTIME_MOVE = 'appointmentBook/PUT_BLOCKTIME_MOVE';
export const PUT_BLOCKTIME_MOVE_SUCCESS = 'appointmentBook/PUT_BLOCKTIME_MOVE_SUCCESS';
export const PUT_BLOCKTIME_MOVE_FAILED = 'appointmentBook/PUT_BLOCKTIME_MOVE_FAILED';
export const PUT_BLOCKTIME_RESIZE = 'appointmentBook/PUT_BLOCKTIME_RESIZE';
export const PUT_BLOCKTIME_RESIZE_SUCCESS = 'appointmentBook/PUT_BLOCKTIME_RESIZE_SUCCESS';
export const PUT_BLOCKTIME_RESIZE_FAILED = 'appointmentBook/PUT_BLOCKTIME_RESIZE_FAILED';
export const UNDO_MOVE_BLOCK = 'appointmentBook/UNDO_MOVE_BLOCK';
export const UNDO_MOVE_BLOCK_SUCCESS = 'appointmentBook/UNDO_MOVE_BLOCK_SUCCESS';

const postBlockTimeSuccess = blockTime => ({
  type: POST_BLOCKTIME_SUCCESS,
  data: { blockTime },
});

const postBlockTimeFailed = error => ({
  type: POST_BLOCKTIME_FAILED,
  data: { error },
});

const postBlockTime = (data, callback) => (dispatch) => {
  dispatch({ type: POST_BLOCKTIME });

  return AppointmentBook.postAppointmentBookBlockTime(data)
    .then((resp) => { dispatch(postBlockTimeSuccess(resp)); callback(true); })
    .catch((error) => { dispatch(postBlockTimeFailed(error)); callback(false, error); });
};

const putBlockTimeMoveSuccess = (blockTime, oldBlockTime) => {
  const newTime = moment(blockTime.fromTime, 'HH:mm').format('h:mm a');
  const newDate = moment(blockTime.date, 'YYYY-MM-DD').format('MMM DD, YYYY');
  const description = `Moved to - ${newTime} ${newDate}`;
  const undoType = 'move';
  const toast = oldBlockTime ? {
    description,
    type: 'success',
    btnRightText: 'OK',
    btnLeftText: 'UNDO',
    isBlockTime: true,
  } : null;
  return {
    type: PUT_BLOCKTIME_MOVE_SUCCESS,
    data: {
      blockTime, oldBlockTime, toast, undoType,
    },
  };
};

const putBlockTimeResizeSuccess = (blockTime, oldBlockTime) => {
  const newTime = moment(blockTime.fromTime, 'HH:mm').format('h:mm a');
  const newToTime = moment(blockTime.toTime, 'HH:mm').format('h:mm a');
  const description = `Moved to - ${newTime} to ${newToTime}`;
  const undoType = 'resize';
  const toast = oldBlockTime ? {
    description,
    type: 'success',
    btnRightText: 'OK',
    btnLeftText: 'UNDO',
    isBlockTime: true,
  } : null;
  return {
    type: PUT_BLOCKTIME_RESIZE_SUCCESS,
    data: {
      blockTime, oldBlockTime, toast, undoType,
    },
  };
};

const putBlockTimeMoveFailed = error => ({
  type: PUT_BLOCKTIME_MOVE_FAILED,
  data: { error },
});

const putBlockTimeResizeFailed = error => ({
  type: PUT_BLOCKTIME_RESIZE_FAILED,
  data: { error },
});

export const putBlockTimeMove = (id, {
  date, employeeId, newTime, roomId, roomOrdinal, resourceId, resourceOrdinal,
}, oldBlock) => (dispatch) => {
  dispatch({ type: PUT_BLOCKTIME_MOVE });
  return AppointmentBook.putBlockTimeMove(id, {
    date, employeeId, newTime, roomId, roomOrdinal, resourceId, resourceOrdinal,
  })
    .then(resp => dispatch(appointmentCalendarActions.setGridView())
      .then(() => dispatch(putBlockTimeMoveSuccess(resp, oldBlock))))
    .catch((error) => { dispatch(putBlockTimeMoveFailed(error)); });
};

export const putBlockTimeResize = (id, { newLength }, oldBlock) => (dispatch) => {
  dispatch({ type: PUT_BLOCKTIME_RESIZE });
  return AppointmentBook.putBlockTimeResize(id, { newLength })
    .then(resp => dispatch(appointmentCalendarActions.setGridView())
      .then(() => dispatch(putBlockTimeResizeSuccess(resp, oldBlock))))
    .catch((error) => { dispatch(putBlockTimeResizeFailed(error)); });
};

const undoMove = () => (dispatch, getState) => {
  const { oldBlockTime, undoType, apptGridSettings } = getState().appointmentBookReducer;
  let params;
  switch (undoType) {
    case 'move': {
      const resourceId = oldBlockTime.resource ? oldBlockTime.resource.id : null;
      const resourceOrdinal = oldBlockTime.resource ? oldBlockTime.resourceOrdinal : null;
      const roomId = oldBlockTime.room ? oldBlockTime.room.id : null;
      const roomOrdinal = oldBlockTime.room ? oldBlockTime.roomOrdinal : null;
      params = {
        date: oldBlockTime.date,
        newTime: oldBlockTime.fromTime,
        employeeId: oldBlockTime.employee.id,
        resourceId,
        resourceOrdinal,
        roomId,
        roomOrdinal,
      };
      dispatch({ type: UNDO_MOVE_BLOCK });
      return dispatch(putBlockTimeMove(oldBlockTime.id, params, null));
    }
    case 'resize': {
      const toTime = moment(oldBlockTime.toTime, 'HH:mm');
      const fromTime = moment(oldBlockTime.fromTime, 'HH:mm');
      const newLength = toTime.diff(fromTime, 'minutes') / apptGridSettings.step;
      params = {
        newLength,
      };
      dispatch({ type: UNDO_MOVE_BLOCK });
      return dispatch(putBlockTimeResize(oldBlockTime.id, params, null));
    }
    default:
      return null;
  }
};

const blockTimeActions = {
  postBlockTime,
  putBlockTimeMove,
  putBlockTimeResize,
  undoMove,
};

export default blockTimeActions;
