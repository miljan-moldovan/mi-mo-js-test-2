// @flow
// queue constants from webend redux

import axios from 'axios';
import {
  QUEUE,
  QUEUE_RECEIVED,
  QUEUE_FAILED,
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
  UPDATE_GROUPS
} from './constants';

const queueData = require('./queue.json');

export const receiveQueue = () => (dispatch) => {
  console.log('receiveQueue');
  dispatch({type: QUEUE});
  dispatch({type: QUEUE_RECEIVED, data: queueData.data});
  //axios.get('http://192.168.1.134:4000/api/queue')
  // axios.get('queue.json')
  //   .then(({data}) => {
  //     dispatch({type: QUEUE_RECEIVED, data: data.data});
  //   })
  //   .catch((error) => {
  //     dispatch({type: QUEUE_FAILED, error});
  //   });
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

export function finishCombine() {
  return {
    type: FINISH_COMBINE
  }
}

export function combineClient(data) {
  return {
    type: COMBINE_CLIENT,
    data
  }
}

export function updateGroupLead(data) {
  return {
    type: GROUP_LEAD_UPDATE,
    data
  }
}

export function uncombine(groupId) {
  return {
    type: UNCOMBINE,
    data: {groupId}
  }
}

export function updateGroups() {
  return {
    type: UPDATE_GROUPS
  }
}
