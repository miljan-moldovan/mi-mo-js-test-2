// @flow
import * as helpers from './helpers';
import {QueueItem} from '../../models';

import {
  QUEUE,
  QUEUE_RECEIVED,
  QUEUE_FAILED,
  QUEUE_UPDATE_ITEM,
  QUEUE_DELETE_ITEM,
  CLIENT_CHECKED_IN,
  CLIENT_CHECKED_IN_FAILED,
  CLIENT_CHECKED_IN_RECEIVED,
  CLIENT_UNCHECKED_IN,
  CLIENT_UNCHECKED_IN_FAILED,
  CLIENT_UNCHECKED_IN_RECEIVED,
  CLIENT_RETURNED_LATER,
  CLIENT_RETURNED_LATER_FAILED,
  CLIENT_RETURNED_LATER_RECEIVED,
  CLIENT_RETURNED,
  CLIENT_RETURNED_RECEIVED,
  CLIENT_RETURNED_FAILED,
  CLIENT_WALKED_OUT,
  CLIENT_WALKED_OUT_RECEIVED,
  CLIENT_WALKED_OUT_FAILED,
  CLIENT_NO_SHOW,
  CLIENT_NO_SHOW_RECEIVED,
  CLIENT_NO_SHOW_FAILED,
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
  SET_LOADING,
  QUEUE_EMPLOYEES,
  QUEUE_EMPLOYEES_SUCCESS,
  QUEUE_EMPLOYEES_FAILED,
} from '../actions/queue';

import {POST_WALKIN_CLIENT_SUCCESS} from '../actions/walkIn';

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
  updatedGroups: [],
  queueState: null,
  providers: [],
};

export default (state = initialState, action) => {
  const {type, data, error} = action;

  switch (type) {
    case QUEUE:
      return {
        ...state,
        error: null,
        loading: true,
      };
    case QUEUE_RECEIVED:
      const waitingQueue = [];
      const serviceQueue = [];
      const initialGroups = {};
      data.resp.map ((item: QueueItem) => {
        item.client.fullName = `${item.client.name ? item.client.name[0].toUpperCase () + item.client.name
                .toLowerCase ()
                .slice (
                  1,
                  item.client.name.length
                ) : ''} ${item.client.lastName ? item.client.lastName[0].toUpperCase () + item.client.lastName
                .toLowerCase ()
                .slice (1, item.client.lastName.length) : ''}`;

        if (item.groupId) {
          if (!initialGroups[item.groupId]) {
            initialGroups[item.groupId] = {
              clients: [],
              groupLeadName: null,
            };
          }
          initialGroups[item.groupId].clients.push ({
            id: item.id,
            isGroupLeader: item.isGroupLeader,
          });
          if (item.isGroupLeader) {
            initialGroups[item.groupId].groupLeadName = item.client.fullName;
          }
        }

        if (!item.startTime) {
          item.startTime = '10:51:48';
        }

        item.background = helpers.getLabelColor (item);
        if (item.status < 6 && item.status !== 4) {
          item.processTime = item.progressTime;
          //   item.estimatedTime = helpers.getEstimatedWaitTime(item);
          //   item.expectedStartTime = helpers.getExpectedStartTime(item);
          waitingQueue.push (item);
        } else {
          //   item.startTime = helpers.formatServiceStartTime(item.servicedTimeAt);
          item.processTime = item.progressTime;
          //   item.estimatedTime = helpers.getEstimatedServiceTime(item);
          item.completed = helpers.getProcentCompleted (item);
          serviceQueue.push (item);
        }
        return item;
      });

      helpers.generateColorsForGroups (initialGroups);

      return {
        ...state,
        loading: false,
        queueLength: data.resp.length,
        groups: initialGroups,
        waitingQueue,
        serviceQueue,
        combiningClients: [],
        combining: false,
      };
    case QUEUE_FAILED:
      return {
        ...state,
        loading: false,
        error,
      };
    case QUEUE_DELETE_ITEM:
      const waitingQueueDeletedIndex = state.waitingQueue.findIndex (
        item => item.id == data.id
      );
      if (waitingQueueDeletedIndex !== -1) {
        state.waitingQueue.splice (waitingQueueDeletedIndex, 1);
      }
      const serviceQueueDeletedIndex = state.serviceQueue.findIndex (
        item => item.id == data.id
      );
      if (serviceQueueDeletedIndex !== -1) {
        state.serviceQueue.splice (serviceQueueDeletedIndex, 1);
      }

      return {
        ...state,
        waitingQueue: waitingQueueIndex !== -1
          ? [...state.waitingQueue]
          : state.waitingQueue,
        serviceQueue: serviceQueueIndex !== -1
          ? [...state.serviceQueue]
          : state.serviceQueue,
      };
    case QUEUE_UPDATE_ITEM:
      const {queueItem} = data;
      const waitingQueueIndex = state.waitingQueue.findIndex (
        item => item.id == queueItem.id
      );
      if (waitingQueueIndex !== -1) {
        state.waitingQueue[waitingQueueIndex] = queueItem;
      }
      const serviceQueueIndex = state.serviceQueue.findIndex (
        item => item.id == queueItem.id
      );
      if (serviceQueueIndex !== -1) {
        state.serviceQueue[serviceQueueIndex] = queueItem;
      }

      return {
        ...state,
        waitingQueue: waitingQueueIndex !== -1
          ? [...state.waitingQueue]
          : state.waitingQueue,
        serviceQueue: serviceQueueIndex !== -1
          ? [...state.serviceQueue]
          : state.serviceQueue,
      };
    case ROW_EXPANDED:
      return {
        ...state,
        expandedRow: state.expandedRow === data.id ? null : data.id,
      };
    case CLIENT_CHECKED_IN:
      return {
        ...state,
        loading: true,
      };
    case CLIENT_CHECKED_IN_RECEIVED:
      return {
        ...state,
        // loading: false,
      };
    case CLIENT_CHECKED_IN_FAILED:
      return {
        ...state,
        loading: false,
      };
    case CLIENT_UNCHECKED_IN:
      return {
        ...state,
        loading: true,
      };
    case CLIENT_UNCHECKED_IN_RECEIVED:
      return {
        ...state,
        // loading: false,
      };
    case CLIENT_UNCHECKED_IN_FAILED:
      return {
        ...state,
        loading: false,
      };

    case CLIENT_RETURNED_LATER:
      return {
        ...state,
        loading: true,
      };

    case CLIENT_RETURNED_LATER_RECEIVED:
      return {
        ...state,
        // loading: false,
      };
    case CLIENT_RETURNED_LATER_FAILED:
      return {
        ...state,
        loading: false,
      };
    case CLIENT_RETURNED:
      return {
        ...state,
        loading: true,
      };

    case CLIENT_RETURNED_RECEIVED:
      return {
        ...state,
        // loading: false,
      };
    case CLIENT_RETURNED_FAILED:
      return {
        ...state,
        loading: false,
      };
    case CLIENT_WALKED_OUT:
      return {
        ...state,
        loading: true,
      };
    case CLIENT_WALKED_OUT_RECEIVED:
      return {
        ...state,
        // loading: false,
      };
    case CLIENT_WALKED_OUT_FAILED:
      return {
        ...state,
        loading: false,
      };
    case CLIENT_NO_SHOW:
      return {
        ...state,
        loading: true,
      };
    case CLIENT_NO_SHOW_RECEIVED:
      return {
        ...state,
        // loading: false,
      };
    case CLIENT_NO_SHOW_FAILED:
      return {
        ...state,
        loading: false,
      };
    case CLIENT_START_SERVICE:
      return {
        ...state,
        expandedRow: null,
        loading: true,
      };
    case CLIENT_START_SERVICE_RECEIVED:
      return {
        ...state,
        // loading: false,
      };
    case CLIENT_START_SERVICE_FAILED:
      return {
        ...state,
        loading: false,
      };
    case CLIENT_FINISH_SERVICE:
      return {
        ...state,
        loading: true,
      };
    case CLIENT_FINISH_SERVICE_RECEIVED:
      return {
        ...state,
        // loading: false,
      };
    case CLIENT_FINISH_SERVICE_FAILED:
      return {
        ...state,
        loading: false,
      };

    case CLIENT_UNDOFINISH_SERVICE:
      return {
        ...state,
        loading: true,
      };
    case CLIENT_UNDOFINISH_SERVICE_RECEIVED:
      return {
        ...state,
        // loading: false,
      };
    case CLIENT_UNDOFINISH_SERVICE_FAILED:
      return {
        ...state,
        loading: false,
      };

    case CLIENT_TO_WAITING:
      return {
        ...state,
      };
    case CLIENT_TO_WAITING_RECEIVED:
      return {
        ...state,
        // loading: false,
      };
    case CLIENT_TO_WAITING_FAILED:
      return {
        ...state,
        loading: false,
      };
    case START_COMBINE:
      return {
        ...state,
        combining: true,
        expandedRow: null,
      };
    case CANCEL_COMBINE:
      const groupsNew = {...state.groups};
      state.updatedGroups.map (groupId => {
        const groupOld = state.waitingQueue
          .filter (queue => queue.groupId === groupId)
          .concat (
            state.serviceQueue.filter (queue => queue.groupId === groupId)
          );

        groupsNew[groupId] = groupOld.map (client => ({
          id: client.id,
          clientName: `${client.client.name} ${client.client.lastName}`,
          groupLead: client.groupLead,
        }));

        return groupId;
      });

      return {
        ...state,
        combiningClients: [],
        updatedGroups: [],
        groups: groupsNew,
        combining: false,
      };
    case COMBINE_CLIENT:
      let newCombiningClints = [];
      if (state.combiningClients.find (client => client.id === data.id)) {
        newCombiningClints = state.combiningClients.filter (
          client => client.id !== data.id
        );
      } else {
        newCombiningClints = state.combiningClients.concat ({
          id: data.id,
          clientName: data.clientName,
        });
      }
      const isGroupLeadExist = newCombiningClints.find (item => item.groupLead);
      if (!isGroupLeadExist && newCombiningClints.length) {
        newCombiningClints[0].groupLead = true;
      }
      return {
        ...state,
        combiningClients: newCombiningClints,
      };
    case GROUP_LEAD_UPDATE:
      if (data.groupId) {
        const groupsEdit = {...state.groups};
        groupsEdit[data.groupId].map (client => {
          if (client.id === data.id) {
            client.groupLead = true;
          } else {
            client.groupLead = false;
          }
          return client;
        });

        const updatedGroupsNew = state.updatedGroups.concat (data.groupId);
        return {
          ...state,
          groups: groupsEdit,
          updatedGroups: updatedGroupsNew,
        };
      }
      const updatedCombiningClints = state.combiningClients.map (client => {
        client.groupLead = false;
        client = {...client};
        return client;
      });
      const payingClient = updatedCombiningClints.find (
        client => client.id === data.id
      );

      payingClient.groupLead = true;

      return {
        ...state,
        combiningClients: updatedCombiningClints,
      };

    case FINISH_COMBINE:
      const newLastGroupId = state.lastGroupId + 1;
      const updatedGroups = {...state.groups};
      updatedGroups[newLastGroupId] = state.combiningClients;

      const groupLeadName = state.combiningClients.find (
        client => client.groupLead
      ).clientName;

      const addToGroup = (queue, client) => {
        if (queue.id === client.id) {
          queue.groupId = newLastGroupId;
          queue.groupLead = client.groupLead;
          queue.groupLeadName = groupLeadName;
          queue = {...queue};
        }
        return queue;
      };

      let updatedWaitingQueue = [], updatedServiceQueue = [];

      state.combiningClients.map (client => {
        updatedWaitingQueue = state.waitingQueue.map (queue =>
          addToGroup (queue, client)
        );
        updatedServiceQueue = state.serviceQueue.map (queue =>
          addToGroup (queue, client)
        );
        return client;
      });

      return {
        ...state,
        combiningClients: [],
        groups: updatedGroups,
        lastGroupId: newLastGroupId,
        waitingQueue: updatedWaitingQueue,
        serviceQueue: updatedServiceQueue,
        combining: false,
      };
    case UNCOMBINE:
      const filtredGroups = {...state.groups};
      delete filtredGroups[data.groupId];

      const removeGroup = queue => {
        if (queue.groupId == data.groupId) {
          queue.groupId = null;
          queue.groupLead = null;
          queue.groupLeadName = null;
          queue = {...queue};
        }
        return queue;
      };

      const filtredWaitingQueue = state.waitingQueue.map (removeGroup);
      const filtredServiceQueue = state.serviceQueue.map (removeGroup);

      return {
        ...state,
        groups: filtredGroups,
        waitingQueue: filtredWaitingQueue,
        serviceQueue: filtredServiceQueue,
        combining: false,
      };
    case UPDATE_GROUPS:
      let newWaitingQueue = [], newServiceQueue = [];
      state.updatedGroups.map (groupId => {
        const group = state.groups[groupId];
        const groupLead = group.find (client => client.groupLead);

        const updateGroup = queue => {
          if (queue.groupId === groupId) {
            queue.groupLead = queue.id === groupLead.id;
            queue.groupLeadName = groupLead.clientName;
            queue = {...queue};
          }
          return queue;
        };

        newWaitingQueue = state.waitingQueue.map (updateGroup);
        newServiceQueue = state.serviceQueue.map (updateGroup);

        return groupId;
      });

      return {
        ...state,
        combining: false,
        updatedGroups: [],
        waitingQueue: newWaitingQueue,
        serviceQueue: newServiceQueue,
      };
    case TIME_UPDATE:
      const updatedWaitingItems = state.waitingQueue.map (item => {
        item.background = helpers.getLabelColor (item);
        item.processTime = helpers.getWaitTime (item);
        item.expectedStartTime = helpers.getExpectedStartTime (item);
        item = {...item};
        return item;
      });

      const updatedServiceItems = state.serviceQueue.map (item => {
        item.background = helpers.getLabelColor (item);
        item.processTime = helpers.getWorkingTime (item);
        item.completed = helpers.getProcentCompleted (item);
        item = {...item};
        return item;
      });

      return {
        ...state,
        waitingQueue: updatedWaitingItems,
        serviceQueue: updatedServiceItems,
      };
    case POST_WALKIN_CLIENT_SUCCESS:
      updatedWaitingQueue = state.waitingQueue.push (data.appointment);
      return {
        ...state,
        waitingQueue: updatedWaitingQueue,
      };
    case PUT_QUEUE:
      return {
        ...state,
        loading: true,
      };
    case PUT_QUEUE_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case PUT_QUEUE_FAILED:
      return {
        ...state,
        loading: false,
        error: data.error,
      };
    case GET_QUEUE_STATE:
      return {
        ...state,
        loading: true,
      };
    case GET_QUEUE_STATE_SUCCESS:
      return {
        ...state,
        // loading: false,
        queueState: data.response,
        error: null,
      };
    case GET_QUEUE_STATE_FAILED:
      return {
        ...state,
        loading: false,
        queueState: null,
        error: data.error,
      };
    case QUEUE_EMPLOYEES:
      return {
        ...state,
        loading: true,
      };
    case QUEUE_EMPLOYEES_SUCCESS:
      return {
        ...state,
        providers: data.data.employees,
        error: null,
      };
    case QUEUE_EMPLOYEES_FAILED:
      return {
        ...state,
        loading: false,
        providers: null,
        error: data.error,
      };
    case SET_LOADING:
      return {
        ...state,
        loading: data.loading,
      };
    default:
      return state;
  }
};
