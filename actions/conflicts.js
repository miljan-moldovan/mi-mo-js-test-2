import { AppointmentBook, ScheduleBlocks } from '../utilities/apiWrapper';

export const getConflicts = ({
  actionName, actionNameSuccess, actionNameFailed, conflictData,
}) => (dispatch) => {
  dispatch({
    type: actionName,
  });

  return AppointmentBook.postCheckConflicts(conflictData)
    .then(conflicts => dispatch({
      type: actionNameSuccess,
      data: { conflicts },
    }))
    .catch(() => dispatch({
      type: actionNameFailed,
    }));
};

export const getConflictsBlocks = ({
  actionName, actionNameSuccess, actionNameFailed, conflictData,
}) => (dispatch) => {
  dispatch({
    type: actionName,
  });

  return ScheduleBlocks.postCheckConflictsBlocks(conflictData)
    .then(conflicts => dispatch({
      type: actionNameSuccess,
      data: { conflicts },
    }))
    .catch(() => dispatch({
      type: actionNameFailed,
    }));
};

export default {
  getConflicts,
  getConflictsBlocks,
};
