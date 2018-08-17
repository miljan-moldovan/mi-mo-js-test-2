// @flow
// queue constants from webend redux

import axios from 'axios';

import {
  QUEUE,
  QUEUE_RECEIVED,
  QUEUE_FAILED,
  QUEUE_DELETE_ITEM,
  QUEUE_UPDATE_ITEM,
  CLIENT_CHECKED_IN,
  CLIENT_CHECKED_IN_FAILED,
  CLIENT_CHECKED_IN_RECEIVED,
  CLIENT_NO_SHOW,
  CLIENT_NO_SHOW_RECEIVED,
  CLIENT_NO_SHOW_FAILED,
  CLIENT_RETURNED_LATER,
  CLIENT_RETURNED_LATER_FAILED,
  CLIENT_RETURNED_LATER_RECEIVED,
  CLIENT_RETURNED,
  CLIENT_RETURNED_RECEIVED,
  CLIENT_RETURNED_FAILED,
  CLIENT_WALKED_OUT,
  CLIENT_START_SERVICE,
  CLIENT_START_SERVICE_FAILED,
  CLIENT_START_SERVICE_RECEIVED,
  CLIENT_FINISH_SERVICE,
  CLIENT_FINISH_SERVICE_FAILED,
  CLIENT_FINISH_SERVICE_RECEIVED,
  CLIENT_UNDOFINISH_SERVICE,
  CLIENT_UNDOFINISH_SERVICE_FAILED,
  CLIENT_UNDOFINISH_SERVICE_RECEIVED,
  CLIENT_TO_WAITING,
  CLIENT_TO_WAITING_RECEIVED,
  CLIENT_TO_WAITING_FAILED,
  TIME_UPDATE,
  ROW_EXPANDED,
  START_COMBINE,
  CANCEL_COMBINE,
  FINISH_COMBINE,
  COMBINE_CLIENT,
  GROUP_LEAD_UPDATE,
  UNCOMBINE,
  UPDATE_GROUPS,
  PUT_QUEUE,
  PUT_QUEUE_SUCCESS,
  PUT_QUEUE_FAILED,
  GET_QUEUE_STATE,
  GET_QUEUE_STATE_SUCCESS,
  GET_QUEUE_STATE_FAILED,

} from './constants';
import { QueueStatus, Queue } from '../utilities/apiWrapper';

const queueData = require('./queueNew.json');

export const receiveQueue = () => async (dispatch: Object => void) => {
  dispatch({ type: QUEUE });
  try {
    const data = await Queue.getQueue();
    dispatch({ type: QUEUE_RECEIVED, data });
  } catch (error) {
    dispatch({ type: QUEUE_FAILED, error });
  }
};
export function deleteQueueItem(id) {
  return {
    type: QUEUE_DELETE_ITEM,
    data: { id },
  };
}
export function saveQueueItem(queueItem) {
  return {
    type: QUEUE_UPDATE_ITEM,
    data: { queueItem },
  };
}

export const startService = id => async (dispatch: Object => void) => {
  dispatch({ type: CLIENT_START_SERVICE, data: { id } });
  try {
    const data = await QueueStatus.putStartService(id);
    dispatch({ type: CLIENT_START_SERVICE_RECEIVED, data });
  } catch (error) {
    dispatch({ type: CLIENT_START_SERVICE_FAILED, error });
  }
};


export const checkInClient = id => async (dispatch: Object => void) => {
  dispatch({ type: CLIENT_CHECKED_IN, data: { id } });
  try {
    const data = await QueueStatus.putCheckIn(id);
    dispatch({ type: CLIENT_CHECKED_IN_RECEIVED, data });
  } catch (error) {
    dispatch({ type: CLIENT_CHECKED_IN_FAILED, error });
  }
};

export const returnLater = id => async (dispatch: Object => void) => {
  dispatch({ type: CLIENT_RETURNED_LATER, data: { id } });

  try {
    const data = await QueueStatus.putReturnLater(id);

    dispatch({ type: CLIENT_RETURNED_LATER_RECEIVED, data });
  } catch (error) {
    dispatch({ type: CLIENT_RETURNED_LATER_FAILED, error });
  }
};


export const returned = id => async (dispatch: Object => void) => {
  dispatch({ type: CLIENT_RETURNED, data: { id } });

  try {
    const data = await QueueStatus.putReturned(id);

    dispatch({ type: CLIENT_RETURNED_RECEIVED, data });
  } catch (error) {
    dispatch({ type: CLIENT_RETURNED_FAILED, error });
  }
};

export const walkOut = id => async (dispatch: Object => void) => {
  dispatch({ type: CLIENT_WALKED_OUT, data: { id } });

  try {
    const data = await QueueStatus.putWalkOut(id);

    dispatch({ type: CLIENT_WALKED_OUT_RECEIVED, data });
  } catch (error) {
    dispatch({ type: CLIENT_WALKED_OUT_FAILED, error });
  }
};

export const noShow = id => async (dispatch: Object => void) => {
  dispatch({ type: CLIENT_NO_SHOW, data: { id } });

  try {
    const data = QueueStatus.putNoShow(id);

    dispatch({ type: CLIENT_NO_SHOW_RECEIVED, data });
  } catch (error) {
    dispatch({ type: CLIENT_NO_SHOW_FAILED, error });
  }
};

export const finishService = id => async (dispatch: Object => void) => {
  dispatch({ type: CLIENT_FINISH_SERVICE, data: { id } });

  try {
    const data = await QueueStatus.putFinish(id);

    dispatch({ type: CLIENT_FINISH_SERVICE_RECEIVED, data });
  } catch (error) {
    dispatch({ type: CLIENT_FINISH_SERVICE_FAILED, error });
  }
};


export const undoFinishService = id => async (dispatch: Object => void) => {
  dispatch({ type: CLIENT_UNDOFINISH_SERVICE, data: { id } });

  try {
    const data = await QueueStatus.putUndoFinish(id);

    dispatch({ type: CLIENT_UNDOFINISH_SERVICE_RECEIVED, data });
  } catch (error) {
    dispatch({ type: CLIENT_UNDOFINISH_SERVICE_FAILED, error });
  }
};

export const toWaiting = id => async (dispatch: Object => void) => {
  dispatch({ type: CLIENT_TO_WAITING, data: { id } });

  try {
    const data = await QueueStatus.putToWaiting(id);

    dispatch({ type: CLIENT_TO_WAITING_RECEIVED, data });
  } catch (error) {
    dispatch({ type: CLIENT_TO_WAITING_FAILED, error });
  }
};

export function updateTime() {
  return {
    type: TIME_UPDATE,
  };
}

export function expandRow(id) {
  return {
    type: ROW_EXPANDED,
    data: { id },
  };
}

export function startCombine() {
  return {
    type: START_COMBINE,
  };
}

export function cancelCombine() {
  return {
    type: CANCEL_COMBINE,
  };
}
export const finishCombine = (combiningClients: Array<Object>) => async (dispatch: Object => void) => {
  try {
    dispatch({ type: QUEUE });
    const data = {
      clientQueueIdList: [],
      payingClientQueueId: null,
    };
    combiningClients.map((item) => {
      data.clientQueueIdList.push(item.id);
      if (item.groupLead) {
        data.payingClientQueueId = item.id;
      }
    });

    const response = await Queue.postQueueGroup(data);

    dispatch(receiveQueue());
  } catch (error) {
    dispatch({ type: QUEUE_FAILED, error });
  }
};
export const updateGroupLeaders = (groups: Object) => async (dispatch: Object => void) => {
  try {
    dispatch({ type: QUEUE });

    for (const groupId in groups) {
      const clientQueueId = groups[groupId];
      const response = await Queue.putQueueGroupLeader({ groupId, clientQueueId });
    }

    dispatch(receiveQueue());
  } catch (error) {
    dispatch({ type: QUEUE_FAILED, error });
  }
};


export function combineClient(data) {
  return {
    type: COMBINE_CLIENT,
    data,
  };
}

export const uncombine = (groupId: number) => async (dispatch: Object => void) => {
  try {
    dispatch({ type: QUEUE });

    const response = await Queue.deleteQueueGroup(groupId);

    dispatch(receiveQueue());
  } catch (error) {
    dispatch({ type: QUEUE_FAILED, error });
  }
};

export function updateGroups() {
  return {
    type: UPDATE_GROUPS,
  };
}


export const putQueueSuccess = notes => ({
  type: PUT_QUEUE_SUCCESS,
  data: { notes },
});

export const putQueueFailed = error => ({
  type: PUT_QUEUE_FAILED,
  data: { error },
});

export const putQueue = (queueId, queue) => (dispatch) => {
  dispatch({ type: PUT_QUEUE });
  return Queue.putQueue(queueId, queue)
    .then(response => dispatch(putQueueSuccess(response)))
    .catch(error => dispatch(putQueueFailed(error)));
};


export const getQueueStateSuccess = response => ({
  type: GET_QUEUE_STATE_SUCCESS,
  data: { response },
});

export const getQueueStateFailed = error => ({
  type: GET_QUEUE_STATE_FAILED,
  data: { error },
});

export const getQueueState = callback => (dispatch) => {
  callback = callback || (() => {});
  dispatch({ type: GET_QUEUE_STATE });
  return Queue.getQueueState()
    .then((response) => { dispatch(getQueueStateSuccess(response)); callback(true); })
    .catch((error) => { dispatch(getQueueStateFailed(error)); callback(false); });
};
