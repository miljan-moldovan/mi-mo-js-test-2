import {
  GET_ROOMS,
  GET_ROOMS_FAILED,
  GET_ROOMS_SUCCESS,
} from '../actions/roomAssignment';

const initialState = {
  isLoading: false,
  rooms: [],
};

const roomAssignmentReducer = (state = initialState, action) => {
  const { type, data } = action;
  const newState = state;
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
    default:
      break;
  }
  return newState;
};
export default roomAssignmentReducer;
