import { Store } from '../utilities/apiWrapper';

export const GET_ROOMS = 'roomAssignment/GET_ROOMS';
export const GET_ROOMS_SUCCESS = 'roomAssignment/GET_ROOMS_SUCCESS';
export const GET_ROOMS_FAILED = 'roomAssignment/GET_ROOMS_FAILED';

const getRooms = () => async (dispatch) => {
  dispatch({ type: GET_ROOMS });
  try {
    const rooms = await Store.getRooms();
    return dispatch({
      type: GET_ROOMS_SUCCESS,
      data: { rooms },
    });
  } catch (err) {
    return dispatch({ type: GET_ROOMS_FAILED });
  }
};

const roomAssignmentActions = {
  getRooms,
};
export default roomAssignmentActions;
