import { Store } from '../../utilities/apiWrapper';
import { TurnAwayReason, Maybe } from '@/models';

export const GET_TURNAWAY_REASONS = 'turnAwayReasons/GET_TURNAWAY_REASONS';
export const GET_TURNAWAY_REASONS_SUCCESS =
  'turnAwayReasons/GET_TURNAWAY_REASONS_SUCCESS';
export const GET_TURNAWAY_REASONS_FAILED =
  'turnAwayReasons/GET_TURNAWAY_REASONS_FAILED';

const getTurnAwayReasonsSuccess = (response: TurnAwayReason[]): any => ({
  type: GET_TURNAWAY_REASONS_SUCCESS,
  data: { response },
});

const getTurnAwayReasonsFailed = (error: Maybe<any>): any => ({
  type: GET_TURNAWAY_REASONS_FAILED,
  data: { error },
});

const getTurnAwayReasons = (callback: Maybe<Function>): any => dispatch => {
  dispatch({ type: GET_TURNAWAY_REASONS });

  return Store.getTurnAwayReasons()
    .then(response => {
      dispatch(getTurnAwayReasonsSuccess(response));
      callback(true);
    })
    .catch(error => {
      dispatch(getTurnAwayReasonsFailed(error));
      callback(false);
    });
};

const turnAwayReasonsActions = {
  getTurnAwayReasons,
};

export interface TurnAwayReasonsActions {
  getTurnAwayReasons: (callback: Maybe<Function>) => any;
}
export default turnAwayReasonsActions;
