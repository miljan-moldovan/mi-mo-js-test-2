import { QueueStatus, Queue, Employees } from '../utilities/apiWrapper';
import { showErrorAlert } from './utils';

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
export const SET_LOADING = 'queue/SET_LOADING';
export const QUEUE_EMPLOYEES = 'queue/QUEUE_EMPLOYEES';
export const QUEUE_EMPLOYEES_SUCCESS = 'queue/QUEUE_EMPLOYEES_SUCCESS';
export const QUEUE_EMPLOYEES_FAILED = 'queue/QUEUE_EMPLOYEES_FAILED';

export const setLoading = loading => ({
  type: SET_LOADING,
  data: { loading },
});

const getQueueEmployeesSuccess = data => ({
  type: QUEUE_EMPLOYEES_SUCCESS,
  data: { data },
});

const getQueueEmployeesFailed = error => ({
  type: QUEUE_EMPLOYEES_FAILED,
  data: { error },
});


export const getQueueEmployees = callback => (dispatch) => {
  dispatch({ type: QUEUE_EMPLOYEES });

  return Employees.getQueueEmployees()
    .then((resp) => {
      dispatch(getQueueEmployeesSuccess(resp)); callback(true);
    })
    .catch((error) => {
      showErrorAlert(error);
      dispatch(getQueueEmployeesFailed(error)); callback(false, error);
    });
};


const startServiceSuccess = data => ({
  type: CLIENT_START_SERVICE_RECEIVED,
  data: { data },
});

const startServiceFailed = error => ({
  type: CLIENT_START_SERVICE_FAILED,
  data: { error },
});


export const startService = (id, serviceData, callback) => (dispatch) => {
  dispatch({ type: CLIENT_START_SERVICE, data: { id } });

  return QueueStatus.putStartService(id, serviceData)
    .then((resp) => {
      dispatch(startServiceSuccess(resp)); callback(true);
    })
    .catch((error) => {
      showErrorAlert(error);
      dispatch(startServiceFailed(error)); callback(false, error);
    });
};


const receiveQueueSuccess = resp => ({
  type: QUEUE_RECEIVED,
  data: { resp },
});

const receiveQueueFailed = error => ({
  type: QUEUE_FAILED,
  data: { error },
});


export const receiveQueue = (callback, showError) => (dispatch) => {
  dispatch({ type: QUEUE });

  return Queue.getQueue()
    .then((resp) => {
      dispatch(receiveQueueSuccess(resp)); callback(true);
    })
    .catch((error) => {
      if (showError) {
        showErrorAlert(error);
      }
      dispatch(receiveQueueFailed(error)); callback(false, error);
    });
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


const checkInClientSuccess = data => ({
  type: CLIENT_CHECKED_IN_RECEIVED,
  data: { data },
});

const checkInClientFailed = error => ({
  type: CLIENT_CHECKED_IN_FAILED,
  data: { error },
});


export const checkInClient = (id, callback) => (dispatch) => {
  dispatch({ type: CLIENT_CHECKED_IN, data: { id } });
  return QueueStatus.putCheckIn(id)
    .then((resp) => {
      dispatch(checkInClientSuccess(resp)); callback(true);
    })
    .catch((error) => {
      showErrorAlert(error);
      dispatch(checkInClientFailed(error)); callback(false, error);
    });
};

const uncheckInClientSuccess = data => ({
  type: CLIENT_UNCHECKED_IN_RECEIVED,
  data: { data },
});

const uncheckInClientFailed = error => ({
  type: CLIENT_UNCHECKED_IN_FAILED,
  data: { error },
});

export const uncheckInClient = (id, callback) => (dispatch) => {
  dispatch({ type: CLIENT_UNCHECKED_IN, data: { id } });
  return QueueStatus.putUncheckIn(id)
    .then((resp) => {
      dispatch(uncheckInClientSuccess(resp)); callback(true);
    })
    .catch((error) => {
      showErrorAlert(error);
      dispatch(uncheckInClientFailed(error)); callback(false, error);
    });
};


const returnLaterSuccess = data => ({
  type: CLIENT_RETURNED_LATER_RECEIVED,
  data: { data },
});

const returnLaterFailed = error => ({
  type: CLIENT_RETURNED_LATER_FAILED,
  data: { error },
});

export const returnLater = (id, callback) => (dispatch) => {
  dispatch({ type: CLIENT_RETURNED_LATER, data: { id } });
  return QueueStatus.putReturnLater(id)
    .then((resp) => {
      dispatch(returnLaterSuccess(resp)); callback(true);
    })
    .catch((error) => {
      showErrorAlert(error);
      dispatch(returnLaterFailed(error)); callback(false, error);
    });
};


const returnedSuccess = data => ({
  type: CLIENT_RETURNED_RECEIVED,
  data: { data },
});

const returnedFailed = error => ({
  type: CLIENT_RETURNED_FAILED,
  data: { error },
});

export const returned = (id, callback) => (dispatch) => {
  dispatch({ type: CLIENT_RETURNED, data: { id } });
  return QueueStatus.putReturned(id)
    .then((resp) => {
      dispatch(returnedSuccess(resp)); callback(true);
    })
    .catch((error) => {
      showErrorAlert(error);
      dispatch(returnedFailed(error)); callback(false, error);
    });
};


const walkOutSuccess = data => ({
  type: CLIENT_WALKED_OUT_RECEIVED,
  data: { data },
});

const walkOutFailed = error => ({
  type: CLIENT_WALKED_OUT_FAILED,
  data: { error },
});

export const walkOut = (id, params, callback) => (dispatch) => {
  dispatch({ type: CLIENT_WALKED_OUT, data: { id } });
  return QueueStatus.putWalkOut(id, params)
    .then((resp) => {
      dispatch(walkOutSuccess(resp)); callback(true);
    })
    .catch((error) => {
      showErrorAlert(error);
      dispatch(walkOutFailed(error)); callback(false, error);
    });
};


const noShowSuccess = data => ({
  type: CLIENT_NO_SHOW_RECEIVED,
  data: { data },
});

const noShowFailed = error => ({
  type: CLIENT_NO_SHOW_FAILED,
  data: { error },
});

export const noShow = (id, params, callback) => (dispatch) => {
  dispatch({ type: CLIENT_NO_SHOW, data: { id } });
  return QueueStatus.putNoShow(id, params)
    .then((resp) => {
      dispatch(noShowSuccess(resp)); callback(true);
    })
    .catch((error) => {
      showErrorAlert(error);
      dispatch(noShowFailed(error)); callback(false, error);
    });
};


const finishServiceSuccess = data => ({
  type: CLIENT_FINISH_SERVICE_RECEIVED,
  data: { data },
});

const finishServiceFailed = error => ({
  type: CLIENT_FINISH_SERVICE_FAILED,
  data: { error },
});

export const finishService = (id, callback) => (dispatch) => {
  dispatch({ type: CLIENT_FINISH_SERVICE, data: { id } });
  return QueueStatus.putFinish(id)
    .then((resp) => {
      dispatch(finishServiceSuccess(resp)); callback(true);
    })
    .catch((error) => {
      showErrorAlert(error);
      dispatch(finishServiceFailed(error)); callback(false, error);
    });
};


const undoFinishServiceSuccess = data => ({
  type: CLIENT_UNDOFINISH_SERVICE_RECEIVED,
  data: { data },
});

const undoFinishServiceFailed = error => ({
  type: CLIENT_UNDOFINISH_SERVICE_FAILED,
  data: { error },
});

export const undoFinishService = (id, callback) => (dispatch) => {
  dispatch({ type: CLIENT_UNDOFINISH_SERVICE, data: { id } });
  return QueueStatus.putUndoFinish(id)
    .then((resp) => {
      dispatch(undoFinishServiceSuccess(resp)); callback(true);
    })
    .catch((error) => {
      showErrorAlert(error);
      dispatch(undoFinishServiceFailed(error)); callback(false, error);
    });
};


const toWaitingSuccess = data => ({
  type: CLIENT_TO_WAITING_RECEIVED,
  data: { data },
});

const toWaitingFailed = error => ({
  type: CLIENT_TO_WAITING_FAILED,
  data: { error },
});

export const toWaiting = (id, callback) => (dispatch) => {
  dispatch({ type: CLIENT_TO_WAITING, data: { id } });
  return QueueStatus.putToWaiting(id)
    .then((resp) => {
      dispatch(toWaitingSuccess(resp)); callback(true);
    })
    .catch((error) => {
      showErrorAlert(error);
      dispatch(toWaitingFailed(error)); callback(false, error);
    });
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
