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
  UPDATE_GROUPS
} from './constants';
import apiWrapper from '../utilities/apiWrapper';

const queueData = require('./queueNew.json');

export const receiveQueue = () => async (dispatch: Object => void) => {

  dispatch({type: QUEUE});
  console.log('receiveQueue begin');


  // try {
  //   // let data = await apiWrapper.doRequest('getQueue', {});
  //   // console.log('receiveQueue', data);
  //   const cookie = await axios.request({
  //     url: 'https://zenithnew.dev.cicd.salondev.net/api/Cookie?storeId=1',
  //     method: 'post',
  //     withCredentials: true
  //   });

    // const cookie = await fetch('https://zenithnew.dev.cicd.salondev.net/api/Cookie?storeId=1', {
    //   method: 'POST',
    //   credentials: 'include',
    //   withCredentials: true
      // headers: {
      //   Accept: 'application/json',
      //   'Content-Type': 'application/json',
      // },
      // body: JSON.stringify({
      //   firstParam: 'yourValue',
      //   secondParam: 'yourOtherValue',
      // }),
    // });
    // console.log('cookie', JSON.stringify(cookie, null, 2));

    // const data = await axios.request({
    //   url: 'https://zenithnew.dev.cicd.salondev.net/api/Queue',
    //   method: 'get',
    //   withCredentials: true
    // });
    // const data = await fetch('https://zenithnew.dev.cicd.salondev.net/api/Queue', {
    //   method: 'GET',
    //   credentials: 'include',
    //   withCredentials: true
    // });
    // console.log('queue', JSON.stringify(data, null, 2));

  // 
  //   dispatch({type: QUEUE_RECEIVED, data: data.response});
  // } catch (error) {
  //   console.log('receiveQueue error', JSON.stringify(error, null, 2));
  //   dispatch({type: QUEUE_FAILED, error});
  // }

  // apiWrapper.doRequest('getQueue', {
  // }).then(({ response }) => {
  //   // console.log(responseJson);
  //   dispatch({type: QUEUE_RECEIVED, data: response});
  // }).catch((error) => {
  //   // console.log(error);
  //   dispatch({type: QUEUE_FAILED, error});
  // });

  // api.get(`Queue`)
  //   .then(({response}) => {
  //   // .then((response: any) => {
  //     dispatch({type: QUEUE_RECEIVED, data: response});
  //   //   dispatch({type: QUEUE_RECEIVED, data: response.data.response});
  //   })
  //   .catch((error) => {
  //     dispatch({type: QUEUE_FAILED, error});
  //   });


  // console.log('receiveQueue');
  // dispatch({type: QUEUE});
  dispatch({type: QUEUE_RECEIVED, data: queueData.response});
  //axios.get('http://192.168.1.134:4000/api/queue')
  // axios.get('queue.json')
  //   .then(({data}) => {
  //     dispatch({type: QUEUE_RECEIVED, data: data.data});
  //   })
  //   .catch((error) => {
  //     dispatch({type: QUEUE_FAILED, error});
  //   });
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
