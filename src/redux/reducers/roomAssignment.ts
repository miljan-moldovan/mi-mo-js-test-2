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
import { Room, RoomAssignment } from '@/models';

export interface RoomAssignmentReducer {
  rooms: Room[];
  assignments: RoomAssignment[];
  isError: boolean;
  isLoading: boolean;
  isUpdating: boolean;
}

const initialState: RoomAssignmentReducer = {
  isLoading: false,
  isError: false,
  isUpdating: false,
  rooms: [],
  assignments: [],
};

const roomAssignmentReducer = (state: RoomAssignmentReducer = initialState, action): RoomAssignmentReducer => {
  const { type, data } = action;
  switch (type) {
    case GET_ROOMS:
      return {
        ...state,
        isLoading: true,
      };
    case GET_ROOMS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        rooms: data.rooms,
      };
    case GET_ROOMS_FAILED:
      return {
        ...state,
        isLoading: false,
        rooms: [],
      };
    case GET_ASSIGNMENTS:
      return {
        ...state,
        isLoading: true,
        assignments: [],
      };
    case GET_ASSIGNMENTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        assignments: data.assignments,
        rooms: data.rooms,
      };
    case GET_ASSIGNMENTS_FAILED:
      return {
        ...state,
        isLoading: false,
        assignments: [],
      };
    case PUT_ASSIGNMENTS:
      return {
        ...state,
        isLoading: true,
        isUpdating: true,
        isError: false,
      };
    case PUT_ASSIGNMENTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isUpdating: false,
        isError: false,
      };
    case PUT_ASSIGNMENTS_FAILED:
      return {
        ...state,
        isLoading: false,
        isUpdating: false,
        isError: true,
      };
    default:
      return state;
  }
};
export default roomAssignmentReducer;
