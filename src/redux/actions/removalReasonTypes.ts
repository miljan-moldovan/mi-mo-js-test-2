import { QueueStatus } from '@/utilities/apiWrapper';
import { Maybe } from '@/models';
import { any } from 'prop-types';

export const GET_REMOVALREASONTYPES =
  'removalReasonTypes/GET_REMOVALREASONTYPES';
export const GET_REMOVALREASONTYPES_SUCCESS =
  'removalReasonTypes/GET_REMOVALREASONTYPES_SUCCESS';
export const GET_REMOVALREASONTYPES_FAILED =
  'removalReasonTypes/GET_REMOVALREASONTYPES_FAILED';

const getRemovalReasonTypesSuccess = response => ({
  type: GET_REMOVALREASONTYPES_SUCCESS,
  data: { response },
});

const getRemovalReasonTypesFailed = error => ({
  type: GET_REMOVALREASONTYPES_FAILED,
  data: { error },
});

const getRemovalReasonTypes = (callback: Maybe<Function>): any => dispatch => {
  dispatch({ type: GET_REMOVALREASONTYPES });

  return QueueStatus.getReasonTypes()
    .then(response => {
      dispatch(getRemovalReasonTypesSuccess(response));
      callback(true);
    })
    .catch(error => {
      dispatch(getRemovalReasonTypesFailed(error));
      callback(false);
    });
};

const removalReasonTypesActions = {
  getRemovalReasonTypes,
};

export interface RemovalReasonTypesActions {
  getRemovalReasonTypes: (callback: Maybe<Function>) => any;
}

export default removalReasonTypesActions;
