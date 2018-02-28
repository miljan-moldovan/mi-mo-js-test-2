import * as helpers from './helpers';

import {
  QUEUE,
  QUEUE_RECEIVED,
  QUEUE_FAILED,
  QUEUE_UPDATE_ITEM,
  QUEUE_DELETE_ITEM,
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
} from '../actions/constants';

const initialState = {
  loading: false,
  error: null,
  queueLength: 0,
  expandedRow: null,
  waitingQueue: [],
  serviceQueue: [],
  combining: false,
  combiningClients: [],
  groups: {},
  lastGroupId: 0,
  updatedGroups: []
};

export default (state = initialState, action) => {
  const {type, data, error} = action;
  console.log('***** queue.reducer', type, data, error);

  switch(type) {
    case QUEUE:
      return {
        ...state,
        error: null,
        queueLength: 0,
        loading: true
      };
    case QUEUE_RECEIVED:
      const waitingQueue = [];
      const serviceQueue = [];
      console.log(data);
      data.map((item) => {
        item.background = helpers.getLabelColor(item);
        if (item.status < 6 && item.status !== 4) {
          item.startTime = item.start_time;
          item.processTime = helpers.getWaitTime(item);
          item.estimatedTime = helpers.getEstimatedWaitTime(item);
          item.expectedStartTime = helpers.getExpectedStartTime(item);
          waitingQueue.push(item);
        } else {
          item.startTime = helpers.formatServiceStartTime(item.servicedTime);
          item.processTime = helpers.getWorkingTime(item);
          item.estimatedTime = helpers.getEstimatedServiceTime(item);
          item.completed = helpers.getProcentCompleted(item);
          serviceQueue.push(item);
        }
        return item;
      });

      return {
        ...state,
        loading: false,
        queueLength: data.length,
        waitingQueue,
        serviceQueue
      };
    case QUEUE_FAILED:
      return {
        ...state,
        loading: false,
        queueLength: 0,
        error
      }
    case QUEUE_DELETE_ITEM:
      const waitingQueueDeletedIndex = state.waitingQueue.findIndex((item) => item.queueId == data.id);
      if (waitingQueueDeletedIndex !== -1) {
        state.waitingQueue.splice(waitingQueueDeletedIndex, 1);
      }
      const serviceQueueDeletedIndex = state.serviceQueue.findIndex((item) => item.queueId == data.id);
      if (serviceQueueDeletedIndex !== -1) {
        state.serviceQueue.splice(serviceQueueDeletedIndex, 1);
      }
      console.log('QUEUE_DELETE_ITEM', waitingQueueDeletedIndex, serviceQueueDeletedIndex, state.waitingQueue, state.serviceQueue);
      return {
        ...state,
        waitingQueue: waitingQueueIndex !== -1 ? [ ...state.waitingQueue ] : state.waitingQueue,
        serviceQueue: serviceQueueIndex !== -1 ? [ ...state.serviceQueue ] : state.serviceQueue,
      }
    case QUEUE_UPDATE_ITEM:
      const { queueItem } = data;
      const waitingQueueIndex = state.waitingQueue.findIndex((item) => item.queueId == queueItem.queueId);
      if (waitingQueueIndex !== -1) {
        state.waitingQueue[waitingQueueIndex] = queueItem;
      }
      const serviceQueueIndex = state.serviceQueue.findIndex((item) => item.queueId == queueItem.queueId);
      if (serviceQueueIndex !== -1) {
        state.serviceQueue[serviceQueueIndex] = queueItem;
      }
      console.log('QUEUE_UPDATE_ITEM', waitingQueueIndex, serviceQueueIndex, state.waitingQueue, state.serviceQueue);
      return {
        ...state,
        waitingQueue: waitingQueueIndex !== -1 ? [ ...state.waitingQueue ] : state.waitingQueue,
        serviceQueue: serviceQueueIndex !== -1 ? [ ...state.serviceQueue ] : state.serviceQueue,
      }
    case ROW_EXPANDED:
      return {
        ...state,
        expandedRow: state.expandedRow === data.id ? null : data.id
      }
    case CLIENT_CHECKED_IN:
      const itemsCheckedIn = state.waitingQueue.map((item) => {
        if (item.queueId === data.id) {
          item.status = 0;
          item.checked_in = true;
          item.enteredTime = helpers.getSecondsPassedSinceMidnight();
          item.background = helpers.getLabelColor(item);
          item.processTime = helpers.getWaitTime(item);
          item.estimatedTime = helpers.getEstimatedWaitTime(item);
          item.expectedStartTime = helpers.getExpectedStartTime(item);
          item = {...item};
        }
        return item;
      });

      return {
        ...state,
        waitingQueue: itemsCheckedIn
      };
    case CLIENT_RETURNED_LATER:
      const itemsReturnLater = state.waitingQueue.map((item) => {
        if (item.queueId === data.id) {
          item.status = item.status === 0 ? 5 : 0;
          item = {...item};
        }
        return item;
      });

      return {
        ...state,
        waitingQueue: itemsReturnLater
      };
    case CLIENT_WALKED_OUT:
      const itemsWalkOut = state.waitingQueue.filter((item) => {
        return item.queueId !== data.id;
      });

      return {
        ...state,
        expandedRow: null,
        waitingQueue: itemsWalkOut
      };
    case CLIENT_START_SERVICE:
      const newServicedItem = state.waitingQueue.find((item) => item.queueId === data.id);

      newServicedItem.servicedTime = helpers.getSecondsPassedSinceMidnight();
      newServicedItem.startTime = helpers.formatServiceStartTime(newServicedItem.servicedTime);
      newServicedItem.checked_in = false;
      newServicedItem.serviced = true;
      newServicedItem.status = 6;
      newServicedItem.background = helpers.getLabelColor(newServicedItem);
      newServicedItem.processTime = helpers.getWorkingTime(newServicedItem);
      newServicedItem.estimatedTime = helpers.getEstimatedServiceTime(newServicedItem);
      newServicedItem.completed = helpers.getProcentCompleted(newServicedItem);

      const waitingItemsStartService = state.waitingQueue.filter((item) => item.queueId !== data.id);
      const serviceItemsStartService = state.serviceQueue.concat(newServicedItem);

      return {
        ...state,
        expandedRow: null,
        waitingQueue: waitingItemsStartService,
        serviceQueue: serviceItemsStartService
      };
    case CLIENT_FINISH_SERVICE:
      const itemsFinishService = state.serviceQueue.map((item) => {
        if (item.queueId === data.id) {
          if (item.status === 6) {
            item.status = 7;
            item.finishService = helpers.getSecondsPassedSinceMidnight();
            item = {...item};
          } else {
            item.status = 6;
            item.finishService = null;
            item = {...item};
          }
        }
        return item;
      });

      return {
        ...state,
        serviceQueue: itemsFinishService
      };
    case CLIENT_TO_WAITING:
      const newWaitingItem = state.serviceQueue.find((item) => item.queueId === data.id);

      newWaitingItem.checked_in = true;
      newWaitingItem.serviced = false;
      newWaitingItem.status = 0;
      newWaitingItem.background = helpers.getLabelColor(newWaitingItem);
      newWaitingItem.processTime = helpers.getWaitTime(newWaitingItem);
      newWaitingItem.estimatedTime = helpers.getEstimatedWaitTime(newWaitingItem);
      newWaitingItem.expectedStartTime = helpers.getExpectedStartTime(newWaitingItem);

      const serviceItemsToWaiting = state.serviceQueue.filter((item) => item.queueId !== data.id);
      const waitingItemsToWaiting = state.waitingQueue.concat(newWaitingItem);

      return {
        ...state,
        waitingQueue: waitingItemsToWaiting,
        serviceQueue: serviceItemsToWaiting
      };
    case START_COMBINE:
      return {
        ...state,
        combining: true,
        expandedRow: null
      };
    case CANCEL_COMBINE:
      const groupsNew = {...state.groups};
      state.updatedGroups.map((groupId) => {
        const groupOld = state.waitingQueue.filter((queue) => queue.groupId === groupId)
          .concat(state.serviceQueue.filter((queue) => queue.groupId === groupId));

        groupsNew[groupId] = groupOld.map((client) => {
          return {
            queueId: client.queueId,
            clientName: client.client.name + ' ' + client.client.lastName,
            groupLead: client.groupLead
          };
        });

        return groupId;
      });

      return {
        ...state,
        combiningClients: [],
        updatedGroups: [],
        groups: groupsNew,
        combining: false
      };
    case COMBINE_CLIENT:
      let newCombiningClints = [];
      if (state.combiningClients.find((client) => client.queueId === data.id)) {
        newCombiningClints = state.combiningClients.filter((client) => client.queueId !== data.id);
      } else {
        newCombiningClints = state.combiningClients.concat({
          queueId: data.id,
          clientName: data.clientName
        });
      }
      const isGroupLeadExist = newCombiningClints.find((item) => item.groupLead);
      if (!isGroupLeadExist && newCombiningClints.length) {
        newCombiningClints[0]['groupLead'] = true;
      }
      return {
        ...state,
        combiningClients: newCombiningClints
      };
    case GROUP_LEAD_UPDATE:
      if (data.groupId) {
        const groupsEdit = {...state.groups};
        groupsEdit[data.groupId].map((client) => {
          if (client.queueId === data.id) {
            client.groupLead = true;
          } else {
            client.groupLead = false;
          }
          return client;
        });

        const updatedGroupsNew = state.updatedGroups.concat(data.groupId)
        return {
          ...state,
          groups: groupsEdit,
          updatedGroups: updatedGroupsNew
        };
      } else {
        const updatedCombiningClints = state.combiningClients.map((client) => {
          client.groupLead = false;
          client = {...client};
          return client;
        });
        const payingClient = updatedCombiningClints.find((client) => client.queueId === data.id);

        payingClient.groupLead = true;

        return {
          ...state,
          combiningClients: updatedCombiningClints
        };
      }
    case FINISH_COMBINE:
      const newLastGroupId = state.lastGroupId + 1;
      const updatedGroups = {...state.groups};
      updatedGroups[newLastGroupId] = state.combiningClients;

      const groupLeadName = state.combiningClients.find((client) => client.groupLead).clientName;

      const addToGroup = (queue, client) => {
        if (queue.queueId === client.queueId) {
          queue.groupId = newLastGroupId;
          queue.groupLead = client.groupLead;
          queue.groupLeadName = groupLeadName;
          queue = {...queue};
        }
        return queue;
      };

      let updatedWaitingQueue = [], updatedServiceQueue = [];

      state.combiningClients.map((client) => {
        updatedWaitingQueue = state.waitingQueue.map((queue) => addToGroup(queue, client));
        updatedServiceQueue = state.serviceQueue.map((queue) => addToGroup(queue, client));
        return client;
      });

      return {
        ...state,
        combiningClients: [],
        groups: updatedGroups,
        lastGroupId: newLastGroupId,
        waitingQueue: updatedWaitingQueue,
        serviceQueue: updatedServiceQueue,
        combining: false
      };
    case UNCOMBINE:
      const filtredGroups = {...state.groups};
      delete filtredGroups[data.groupId];

      const removeGroup = (queue) => {
        if (queue.groupId == data.groupId) {
          queue.groupId = null;
          queue.groupLead = null;
          queue.groupLeadName = null;
          queue = {...queue};
        }
        return queue;
      };

      const filtredWaitingQueue = state.waitingQueue.map(removeGroup);
      const filtredServiceQueue = state.serviceQueue.map(removeGroup);

      return {
        ...state,
        groups: filtredGroups,
        waitingQueue: filtredWaitingQueue,
        serviceQueue: filtredServiceQueue,
        combining: false
      };
    case UPDATE_GROUPS:
      let newWaitingQueue = [], newServiceQueue = [];
      state.updatedGroups.map((groupId) => {
        const group = state.groups[groupId];
        const groupLead = group.find((client) => client.groupLead);

        const updateGroup = (queue) => {
          if (queue.groupId === groupId) {
            queue.groupLead = queue.queueId === groupLead.queueId;
            queue.groupLeadName = groupLead.clientName;
            queue = {...queue};
          }
          return queue;
        };

        newWaitingQueue = state.waitingQueue.map(updateGroup);
        newServiceQueue = state.serviceQueue.map(updateGroup);

        return groupId;
      });

      return {
        ...state,
        combining: false,
        updatedGroups: [],
        waitingQueue: newWaitingQueue,
        serviceQueue: newServiceQueue
      };
    case TIME_UPDATE:
      const updatedWaitingItems = state.waitingQueue.map((item) => {
        item.background = helpers.getLabelColor(item);
        item.processTime = helpers.getWaitTime(item);
        item.expectedStartTime = helpers.getExpectedStartTime(item);
        item = {...item};
        return item;
      });

      const updatedServiceItems = state.serviceQueue.map((item) => {
        item.background = helpers.getLabelColor(item);
        item.processTime = helpers.getWorkingTime(item);
        item.completed = helpers.getProcentCompleted(item);
        item = {...item};
        return item;
      });

      return {
        ...state,
        waitingQueue: updatedWaitingItems,
        serviceQueue: updatedServiceItems
      };
    default:
      return state;
  }

}
