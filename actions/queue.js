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
} from './constants';
import apiWrapper from '../utilities/apiWrapper';

const queueData = require('./queueNew.json');

export const receiveQueue = () => async (dispatch: Object => void) => {
  dispatch({ type: QUEUE });
  console.log('receiveQueue begin');
  try {
    const data = await apiWrapper.doRequest('getQueue', {});
    console.log('receiveQueue', data);
    dispatch({ type: QUEUE_RECEIVED, data });
  } catch (error) {
    console.log('receiveQueue error', JSON.stringify(error, null, 2));
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

// export function checkInClient(id) {
//   return {
//     type: CLIENT_CHECKED_IN,
//     data: {id}
//   }
// }


export const startService = id => async (dispatch: Object => void) => {
  console.log('startService');
  dispatch({ type: CLIENT_START_SERVICE, data: { id } });
  console.log('startService begin');
  try {
    const data = await apiWrapper.doRequest('putStartService', { path: { clientQueueItemId: id } });
    console.log('startService', data);
    dispatch({ type: CLIENT_START_SERVICE_RECEIVED, data });
  } catch (error) {
    console.log('startService error', JSON.stringify(error, null, 2));
    dispatch({ type: CLIENT_START_SERVICE_FAILED, error });
  }
};


export const checkInClient = id => async (dispatch: Object => void) => {
  console.log('checkInClient');
  dispatch({ type: CLIENT_CHECKED_IN, data: { id } });
  console.log('checkInClient begin');
  try {
    const data = await apiWrapper.doRequest('putCheckIn', { path: { clientQueueItemId: id } });
    console.log('checkInClient', data);
    dispatch({ type: CLIENT_CHECKED_IN_RECEIVED, data });
  } catch (error) {
    console.log('checkInClient error', JSON.stringify(error, null, 2));
    dispatch({ type: CLIENT_CHECKED_IN_FAILED, error });
  }
};


// export function returnLater(id) {
//   return {
//     type: CLIENT_RETURNED_LATER,
//     data: { id },
//   };
// }

export const returnLater = id => async (dispatch: Object => void) => {
  console.log('returnLater');
  dispatch({ type: CLIENT_RETURNED_LATER, data: { id } });
  console.log('returnLater begin');
  try {
    const data = await apiWrapper.doRequest('putReturnLater', { path: { clientQueueItemId: id } });
    console.log('returnLater', data);
    dispatch({ type: CLIENT_RETURNED_LATER_RECEIVED, data });
  } catch (error) {
    console.log('returnLater error', JSON.stringify(error, null, 2));
    dispatch({ type: CLIENT_RETURNED_LATER_FAILED, error });
  }
};


export const returned = id => async (dispatch: Object => void) => {
  console.log('returned');
  dispatch({ type: CLIENT_RETURNED, data: { id } });
  console.log('returned begin');
  try {
    const data = await apiWrapper.doRequest('putReturned', { path: { clientQueueItemId: id } });
    console.log('returned', data);
    dispatch({ type: CLIENT_RETURNED_RECEIVED, data });
  } catch (error) {
    console.log('returned error', JSON.stringify(error, null, 2));
    dispatch({ type: CLIENT_RETURNED_FAILED, error });
  }
};

// export function walkOut(id) {
//   return {
//     type: CLIENT_WALKED_OUT,
//     data: { id },
//   };
// }

export const walkOut = id => async (dispatch: Object => void) => {
  console.log('walkOut');
  dispatch({ type: CLIENT_WALKED_OUT, data: { id } });
  console.log('walkOut begin');
  try {
    const data = await apiWrapper.doRequest('putWalkOut', { path: { clientQueueItemId: id } });
    console.log('walkOut', data);
    dispatch({ type: CLIENT_WALKED_OUT_RECEIVED, data });
  } catch (error) {
    console.log('walkOut error', JSON.stringify(error, null, 2));
    dispatch({ type: CLIENT_WALKED_OUT_FAILED, error });
  }
};

export const noShow = id => async (dispatch: Object => void) => {
  console.log('noShow');
  dispatch({ type: CLIENT_NO_SHOW, data: { id } });
  console.log('noShow begin');
  try {
    const data = await apiWrapper.doRequest('putNoShow', { path: { clientQueueItemId: id } });
    console.log('noShow', data);
    dispatch({ type: CLIENT_NO_SHOW_RECEIVED, data });
  } catch (error) {
    console.log('noShow error', JSON.stringify(error, null, 2));
    dispatch({ type: CLIENT_NO_SHOW_FAILED, error });
  }
};

// export function startService(id) {
//   return {
//     type: CLIENT_START_SERVICE,
//     data: { id },
//   };
// }

// export function finishService(id) {
//   return {
//     type: CLIENT_FINISH_SERVICE,
//     data: { id },
//   };
// }

export const finishService = id => async (dispatch: Object => void) => {
  console.log('finishService');
  dispatch({ type: CLIENT_FINISH_SERVICE, data: { id } });
  console.log('finishService begin');
  try {
    const data = await apiWrapper.doRequest('putFinish', { path: { clientQueueItemId: id } });
    console.log('finishService', data);
    dispatch({ type: CLIENT_FINISH_SERVICE_RECEIVED, data });
  } catch (error) {
    console.log('finishService error', JSON.stringify(error, null, 2));
    dispatch({ type: CLIENT_FINISH_SERVICE_FAILED, error });
  }
};


export const undoFinishService = id => async (dispatch: Object => void) => {
  console.log('undoFinishService');
  dispatch({ type: CLIENT_UNDOFINISH_SERVICE, data: { id } });
  console.log('undoFinishService begin');
  try {
    const data = await apiWrapper.doRequest('putUndoFinish', { path: { clientQueueItemId: id } });
    console.log('undoFinishService', data);
    dispatch({ type: CLIENT_UNDOFINISH_SERVICE_RECEIVED, data });
  } catch (error) {
    console.log('undoFinishService error', JSON.stringify(error, null, 2));
    dispatch({ type: CLIENT_UNDOFINISH_SERVICE_FAILED, error });
  }
};

// export function toWaiting(id) {
//   return {
//     type: CLIENT_TO_WAITING,
//     data: { id },
//   };
// }


export const toWaiting = id => async (dispatch: Object => void) => {
  console.log('toWaiting');
  dispatch({ type: CLIENT_TO_WAITING, data: { id } });
  console.log('toWaiting begin');
  try {
    const data = await apiWrapper.doRequest('putToWaiting', { path: { clientQueueItemId: id } });
    console.log('toWaiting', data);
    dispatch({ type: CLIENT_TO_WAITING_RECEIVED, data });
  } catch (error) {
    console.log('toWaiting error', JSON.stringify(error, null, 2));
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
    console.log('finishCombine1', data);
    const response = await apiWrapper.doRequest('postQueueGroup', {
      body: JSON.stringify(data),
    });
    console.log('finishCombine response', response);
    dispatch(receiveQueue());
  } catch (error) {
    console.log(error);
    dispatch({ type: QUEUE_FAILED, error });
  }
};
export const updateGroupLeaders = (groups: Object) => async (dispatch: Object => void) => {
  try {
    dispatch({ type: QUEUE });
    console.log('updateGroupLeaders', groups);
    for (const groupId in groups) {
      const clientQueueId = groups[groupId];
      const response = await apiWrapper.doRequest('putQueueGroupLeader', { // putQueueGroupLeader
        path: { groupId, clientQueueId },
      });
    }
    console.log('updateGroupLeaders done');
    dispatch(receiveQueue());
  } catch (error) {
    console.log(error);
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
    console.log('uncombine', groupId);
    const response = await apiWrapper.doRequest('deleteQueueGroup', {
      path: { groupId },
    });
    console.log('uncombine response', response);
    dispatch(receiveQueue());
    // setTimeout(()=>dispatch(receiveQueue()), 1000);
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
  return apiWrapper.doRequest('putQueue', {
    path: {
      queueId,
    },
    body: queue,
  })
    .then(response => dispatch(putQueueSuccess(response)))
    .catch(error => dispatch(putQueueFailed(error)));
};
