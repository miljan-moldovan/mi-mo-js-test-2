import { QueueStatus, Queue } from '../utilities/apiWrapper';

export const QUEUE = 'queue/QUEUE';
export const QUEUE_RECEIVED = 'queue/QUEUE_RECEIVED';
export const QUEUE_FAILED = 'queue/QUEUE_FAILED';
export const QUEUE_DELETE_ITEM = 'queue/QUEUE_DELETE_ITEM';
export const QUEUE_UPDATE_ITEM = 'queue/QUEUE_UPDATE_ITEM';
export const CLIENT_CHECKED_IN = 'queue/CLIENT_CHECKED_IN';
export const CLIENT_CHECKED_IN_FAILED = 'queue/CLIENT_CHECKED_IN_FAILED';
export const CLIENT_CHECKED_IN_RECEIVED = 'queue/CLIENT_CHECKED_IN_RECEIVED';
export const CLIENT_UNCHECKED_IN = 'queue/CLIENT_UNCHECKED_IN';
export const CLIENT_UNCHECKED_IN_FAILED = 'queue/CLIENT_UNCHECKED_IN_FAILED';
export const CLIENT_UNCHECKED_IN_RECEIVED = 'queue/CLIENT_UNCHECKED_IN_RECEIVED';
export const CLIENT_NO_SHOW = 'queue/CLIENT_NO_SHOW';
export const CLIENT_NO_SHOW_RECEIVED = 'queue/CLIENT_NO_SHOW_RECEIVED';
export const CLIENT_NO_SHOW_FAILED = 'queue/CLIENT_NO_SHOW_FAILED';
export const CLIENT_RETURNED_LATER = 'queue/CLIENT_RETURNED_LATER';
export const CLIENT_RETURNED_LATER_FAILED = 'queue/CLIENT_RETURNED_LATER_FAILED';
export const CLIENT_RETURNED_LATER_RECEIVED = 'queue/CLIENT_RETURNED_LATER_RECEIVED';
export const CLIENT_RETURNED = 'queue/CLIENT_RETURNED';
export const CLIENT_RETURNED_RECEIVED = 'queue/CLIENT_RETURNED_RECEIVED';
export const CLIENT_RETURNED_FAILED = 'queue/CLIENT_RETURNED_FAILED';
export const CLIENT_WALKED_OUT = 'queue/CLIENT_WALKED_OUT';
export const CLIENT_WALKED_OUT_RECEIVED = 'queue/CLIENT_WALKED_OUT_RECEIVED';
export const CLIENT_WALKED_OUT_FAILED = 'queue/CLIENT_WALKED_OUT_FAILED';
export const CLIENT_START_SERVICE = 'queue/CLIENT_START_SERVICE';
export const CLIENT_START_SERVICE_FAILED = 'queue/CLIENT_START_SERVICE_FAILED';
export const CLIENT_START_SERVICE_RECEIVED = 'queue/CLIENT_START_SERVICE_RECEIVED';
export const CLIENT_FINISH_SERVICE = 'queue/CLIENT_FINISH_SERVICE';
export const CLIENT_FINISH_SERVICE_FAILED = 'queue/CLIENT_FINISH_SERVICE_FAILED';
export const CLIENT_FINISH_SERVICE_RECEIVED = 'queue/CLIENT_FINISH_SERVICE_RECEIVED';
export const CLIENT_UNDOFINISH_SERVICE = 'queue/CLIENT_UNDOFINISH_SERVICE';
export const CLIENT_UNDOFINISH_SERVICE_FAILED = 'queue/CLIENT_UNDOFINISH_SERVICE_FAILED';
export const CLIENT_UNDOFINISH_SERVICE_RECEIVED = 'queue/CLIENT_UNDOFINISH_SERVICE_RECEIVED';
export const CLIENT_TO_WAITING = 'queue/CLIENT_TO_WAITING';
export const CLIENT_TO_WAITING_RECEIVED = 'queue/CLIENT_TO_WAITING_RECEIVED';
export const CLIENT_TO_WAITING_FAILED = 'queue/CLIENT_TO_WAITING_FAILED';
export const TIME_UPDATE = 'queue/TIME_UPDATE';
export const ROW_EXPANDED = 'queue/ROW_EXPANDED';
export const START_COMBINE = 'queue/START_COMBINE';
export const CANCEL_COMBINE = 'queue/CANCEL_COMBINE';
export const FINISH_COMBINE = 'queue/FINISH_COMBINE';
export const COMBINE_CLIENT = 'queue/COMBINE_CLIENT';
export const GROUP_LEAD_UPDATE = 'queue/GROUP_LEAD_UPDATE';
export const UNCOMBINE = 'queue/UNCOMBINE';
export const UPDATE_GROUPS = 'queue/UPDATE_GROUPS';
export const PUT_QUEUE = 'queue/PUT_QUEUE';
export const PUT_QUEUE_SUCCESS = 'queue/PUT_QUEUE_SUCCESS';
export const PUT_QUEUE_FAILED = 'queue/PUT_QUEUE_FAILED';
export const GET_QUEUE_STATE = 'queue/GET_QUEUE_STATE';
export const GET_QUEUE_STATE_SUCCESS = 'queue/GET_QUEUE_STATE_SUCCESS';
export const GET_QUEUE_STATE_FAILED = 'queue/GET_QUEUE_STATE_FAILED';

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

export const startService = (id, serviceData) => async (dispatch: Object => void) => {
  dispatch({ type: CLIENT_START_SERVICE, data: { id } });
  try {
    const data = await QueueStatus.putStartService(id, serviceData);
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

export const uncheckInClient = id => async (dispatch: Object => void) => {
  dispatch({ type: CLIENT_UNCHECKED_IN, data: { id } });
  try {
    const data = await QueueStatus.putUncheckIn(id);
    dispatch({ type: CLIENT_UNCHECKED_IN_RECEIVED, data });
  } catch (error) {
    dispatch({ type: CLIENT_UNCHECKED_IN_FAILED, error });
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
