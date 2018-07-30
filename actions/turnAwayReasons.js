import { Store } from '../utilities/apiWrapper';

export const GET_TURNAWAY_REASONS = 'turnAwayReasons/GET_TURNAWAY_REASONS';
export const GET_TURNAWAY_REASONS_SUCCESS = 'turnAwayReasons/GET_TURNAWAY_REASONS_SUCCESS';
export const GET_TURNAWAY_REASONS_FAILED = 'turnAwayReasons/GET_TURNAWAY_REASONS_FAILED';

const getTurnAwayReasonsSuccess = response => ({
  type: GET_TURNAWAY_REASONS_SUCCESS,
  data: { response },
});

const getTurnAwayReasonsFailed = error => ({
  type: GET_TURNAWAY_REASONS_FAILED,
  data: { error },
});

const getTurnAwayReasons = callback => (dispatch) => {
  dispatch({ type: GET_TURNAWAY_REASONS });

  return Store.getTurnAwayReasons()
    .then((response) => { dispatch(getTurnAwayReasonsSuccess(response)); callback(true); })
    .catch((error) => { dispatch(getTurnAwayReasonsFailed(error)); callback(false); });
};


const turnAwayReasonsActions = {
  getTurnAwayReasons,
};

export default turnAwayReasonsActions;
