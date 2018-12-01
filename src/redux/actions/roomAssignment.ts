import { isFunction } from 'lodash';
import moment from 'moment';
import { showErrorAlert } from './utils';
import { Store, Employees } from '../../utilities/apiWrapper';

export const GET_ROOMS = 'roomAssignment/GET_ROOMS';
export const GET_ROOMS_SUCCESS = 'roomAssignment/GET_ROOMS_SUCCESS';
export const GET_ROOMS_FAILED = 'roomAssignment/GET_ROOMS_FAILED';
export const GET_ASSIGNMENTS = 'roomAssignment/GET_ASSIGNMENTS';
export const GET_ASSIGNMENTS_SUCCESS = 'roomAssignment/GET_ASSIGNMENTS_SUCCESS';
export const GET_ASSIGNMENTS_FAILED = 'roomAssignment/GET_ASSIGNMENTS_FAILED';
export const PUT_ASSIGNMENTS = 'roomAssignment/PUT_ASSIGNMENTS';
export const PUT_ASSIGNMENTS_SUCCESS = 'roomAssignment/PUT_ASSIGNMENTS_SUCCESS';
export const PUT_ASSIGNMENTS_FAILED = 'roomAssignment/PUT_ASSIGNMENTS_FAILED';

const getRooms = () => async dispatch => {
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

const getAssignments = (
  date = moment(),
  employeeId,
  successCallback
) => async dispatch => {
  dispatch({ type: GET_ASSIGNMENTS });
  return Promise.all([
    Store.getRooms(),
    Employees.getRoomAssignments(
      moment(date).format('YYYY-MM-DD'),
      employeeId
    ),
  ])
    .then(([rooms, assignments]) => {
      if (isFunction(successCallback)) {
        successCallback(assignments);
      }
      dispatch({
        type: GET_ASSIGNMENTS_SUCCESS,
        data: { assignments, rooms },
      });
    })
    .catch(error => {
      showErrorAlert(error);
      dispatch({ type: GET_ASSIGNMENTS_FAILED });
    });
};

const putAssignments = (
  id,
  date,
  assignments,
  successCallback
) => async dispatch => {
  dispatch({ type: PUT_ASSIGNMENTS });
  try {
    const res = await Employees.putRoomAssignments(id, date, assignments);
    if (isFunction(successCallback)) {
      successCallback();
    }
    return dispatch({ type: PUT_ASSIGNMENTS_SUCCESS });
  } catch (err) {
    showErrorAlert(err);
    return dispatch({ type: PUT_ASSIGNMENTS_FAILED });
  }
};
const roomAssignmentActions = {
  getRooms,
  getAssignments,
  putAssignments,
};
export default roomAssignmentActions;

export interface RoomAssignmentActions {
  getRooms: () => void,
  getAssignments: (
    date: string,
    employeeId: number,
    successCallback?: () => void,
  ) => void;
  putAssignments: (
    id: number,
    date: string,
    assignments: any[],
    successCallback?: () => void,
  ) => void;
}
