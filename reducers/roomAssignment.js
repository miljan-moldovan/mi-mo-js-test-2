import { cloneDeep } from 'lodash';

import {
  GET_ROOMS,
  GET_ROOMS_FAILED,
  GET_ROOMS_SUCCESS,
  GET_ASSIGNMENTS,
  GET_ASSIGNMENTS_SUCCESS,
  GET_ASSIGNMENTS_FAILED,
  PUT_ASSIGNMENTS,
  PUT_ASSIGNMENTS_FAILED,
  PUT_ASSIGNMENTS_SUCCESS,
} from '../actions/roomAssignment';

const initialState = {
  isLoading: false,
  rooms: [],
  assignments: [],
};

const roomAssignmentReducer = (state = initialState, action) => {
  const { type, data } = action;
  const newState = cloneDeep(state);
  switch (type) {
    case GET_ROOMS:
      newState.isLoading = true;
      break;
    case GET_ROOMS_SUCCESS:
      newState.isLoading = false;
      newState.rooms = data.rooms;
      break;
    case GET_ROOMS_FAILED:
      newState.isLoading = false;
      newState.rooms = [];
      break;
    case GET_ASSIGNMENTS:
      newState.isLoading = true;
      newState.assignments = [];
      break;
    case GET_ASSIGNMENTS_SUCCESS:
      newState.isLoading = false;
      newState.assignments = data.assignments;
      newState.rooms = data.rooms;
      break;
    case GET_ASSIGNMENTS_FAILED:
      newState.isLoading = false;
      newState.assignments = [];
      break;
    case PUT_ASSIGNMENTS:
      newState.isLoading = true;
      break;
    case PUT_ASSIGNMENTS_SUCCESS:
    case PUT_ASSIGNMENTS_FAILED:
      newState.isLoading = false;
      break;
    default:
      break;
  }
  return newState;
};
export default roomAssignmentReducer;
