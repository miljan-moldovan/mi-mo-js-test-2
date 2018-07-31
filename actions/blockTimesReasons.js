import { Store } from '../utilities/apiWrapper';


export const GET_BLOCKTIMES_REASONS = 'blockTimesReasons/GET_BLOCKTIMES_REASONS';
export const GET_BLOCKTIMES_REASONS_SUCCESS = 'blockTimesReasons/GET_BLOCKTIMES_REASONS_SUCCESS';
export const GET_BLOCKTIMES_REASONS_FAILED = 'blockTimesReasons/GET_BLOCKTIMES_REASONS_FAILED';

const getBlockTimesReasonsSuccess = response => ({
  type: GET_BLOCKTIMES_REASONS_SUCCESS,
  data: { response },
});

const getBlockTimesReasonsFailed = error => ({
  type: GET_BLOCKTIMES_REASONS_FAILED,
  data: { error },
});

const getBlockTimesReasons = callback => (dispatch) => {
  dispatch({ type: GET_BLOCKTIMES_REASONS });

  return Store.getBlockTypes()
    .then((response) => { dispatch(getBlockTimesReasonsSuccess(response)); callback(true); })
    .catch((error) => { dispatch(getBlockTimesReasonsFailed(error)); callback(false); });
};


const blockTimesReasonsActions = {
  getBlockTimesReasons,
};

export default blockTimesReasonsActions;
