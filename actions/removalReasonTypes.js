import { QueueStatus } from '../utilities/apiWrapper';


export const GET_REMOVALREASONTYPES = 'removalReasonTypes/GET_REMOVALREASONTYPES';
export const GET_REMOVALREASONTYPES_SUCCESS = 'removalReasonTypes/GET_REMOVALREASONTYPES_SUCCESS';
export const GET_REMOVALREASONTYPES_FAILED = 'removalReasonTypes/GET_REMOVALREASONTYPES_FAILED';

const getRemovalReasonTypesSuccess = response => ({
  type: GET_REMOVALREASONTYPES_SUCCESS,
  data: { response },
});

const getRemovalReasonTypesFailed = error => ({
  type: GET_REMOVALREASONTYPES_FAILED,
  data: { error },
});

const getRemovalReasonTypes = callback => (dispatch) => {
  dispatch({ type: GET_REMOVALREASONTYPES });

  return QueueStatus.getReasonTypes()
    .then((response) => { dispatch(getRemovalReasonTypesSuccess(response)); callback(true); })
    .catch((error) => { dispatch(getRemovalReasonTypesFailed(error)); callback(false); });
};


const removalReasonTypesActions = {
  getRemovalReasonTypes,
};

export default removalReasonTypesActions;
