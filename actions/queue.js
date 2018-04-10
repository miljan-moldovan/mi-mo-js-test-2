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
  CLIENT_RETURNED_LATER,
  CLIENT_WALKED_OUT,
  CLIENT_START_SERVICE,
  CLIENT_FINISH_SERVICE,
  CLIENT_TO_WAITING,
  TIME_UPDATE,
  ROW_EXPANDED,
  START_COMBINE,
  CANCEL_COMBINE,
  FINISH_COMBINE,
  COMBINE_CLIENT,
  GROUP_LEAD_UPDATE,
  UNCOMBINE,
  UPDATE_GROUPS,
} from './constants';
import apiWrapper from '../utilities/apiWrapper';

const queueData = require('./queueNew.json');

export const receiveQueue = () => async (dispatch: Object => void) => {
  dispatch({type: QUEUE});
  console.log('receiveQueue begin');
  try {
    let data = await apiWrapper.doRequest('getQueue', {});
    console.log('receiveQueue', data);
    dispatch({type: QUEUE_RECEIVED, data });
  } catch (error) {
    console.log('receiveQueue error', JSON.stringify(error, null, 2));
    dispatch({type: QUEUE_FAILED, error});
  }
}
export function deleteQueueItem(id) {
  return {
    type: QUEUE_DELETE_ITEM,
    data: {id}
  }
}
export function saveQueueItem(queueItem) {
  return {
    type: QUEUE_UPDATE_ITEM,
    data: {queueItem}
  }
}

export function checkInClient(id) {
  return {
    type: CLIENT_CHECKED_IN,
    data: {id}
  }
}

export function returnLater(id) {
  return {
    type: CLIENT_RETURNED_LATER,
    data: {id}
  }
}

export function walkOut(id) {
  return {
    type: CLIENT_WALKED_OUT,
    data: {id}
  }
}

export function startService(id) {
  return {
    type: CLIENT_START_SERVICE,
    data: {id}
  }
}

export function finishService(id) {
  return {
    type: CLIENT_FINISH_SERVICE,
    data: {id}
  }
}

export function toWaiting(id) {
  return {
    type: CLIENT_TO_WAITING,
    data: {id}
  }
}

export function updateTime() {
  return {
    type: TIME_UPDATE
  }
}

export function expandRow(id) {
  return {
    type: ROW_EXPANDED,
    data: {id}
  }
}

export function startCombine() {
  return {
    type: START_COMBINE
  }
}

export function cancelCombine() {
  return {
    type: CANCEL_COMBINE
  }
}
export const finishCombine = (combiningClients: Array<Object>) => async (dispatch: Object => void) => {
  try {
    dispatch({type: QUEUE});
    const data = {
      clientQueueIdList: [],
      payingClientQueueId: null
    };
    combiningClients.map((item) => {
      data.clientQueueIdList.push(item.id);
      if (item.groupLead) {
        data.payingClientQueueId = item.id;
      }
    });
    console.log('finishCombine1', data);
    let response = await apiWrapper.doRequest('postQueueGroup', {
      body: JSON.stringify(data)
    });
    console.log('finishCombine response', response);
    dispatch(receiveQueue());
  } catch (error) {
    console.log(error);
    dispatch({type: QUEUE_FAILED, error});
  }
}
export const updateGroupLeaders = (groups: Object) => async (dispatch: Object => void) => {
  try {
    dispatch({type: QUEUE});
    console.log('updateGroupLeaders', groups);
    for (let groupId in groups) {
      let clientQueueId = groups[groupId];
      let response = await apiWrapper.doRequest('putQueueGroupLeader', { //putQueueGroupLeader
        path: { groupId, clientQueueId }
      });
    }
    console.log('updateGroupLeaders done');
    dispatch(receiveQueue());
  } catch (error) {
    console.log(error);
    dispatch({type: QUEUE_FAILED, error});
  }
}


export function combineClient(data) {
  return {
    type: COMBINE_CLIENT,
    data
  }
}

export const uncombine = (groupId: number) => async (dispatch: Object => void) => {
  try {
    dispatch({type: QUEUE});
    console.log('uncombine', groupId);
    let response = await apiWrapper.doRequest('deleteQueueGroup', {
      path: { groupId }
    });
    console.log('uncombine response', response);
    dispatch(receiveQueue());
    // setTimeout(()=>dispatch(receiveQueue()), 1000);
  } catch (error) {
    dispatch({type: QUEUE_FAILED, error});
  }
}

export function updateGroups() {
  return {
    type: UPDATE_GROUPS
  }
}
