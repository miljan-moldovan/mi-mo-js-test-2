import { TurnAway } from '../utilities/apiWrapper';
import { storeForm, purgeForm } from './formCache';

export const SET_ON_EDITION_TURN_AWAY = 'apptBookTurnAway/SET_ON_EDITION_TURN_AWAY';

export const POST_TURN_AWAY = 'apptBookTurnAway/POST_TURN_AWAY';
export const POST_TURN_AWAY_SUCCESS = 'apptBookTurnAway/POST_TURN_AWAY_SUCCESS';
export const POST_TURN_AWAY_FAILED = 'apptBookTurnAway/POST_TURN_AWAY_FAILED';

const postApptBookTurnAwaySuccess = apptBookTurnAway => ({
  type: POST_TURN_AWAY_SUCCESS,
  data: { apptBookTurnAway },
});

const postApptBookTurnAwayFailed = error => ({
  type: POST_TURN_AWAY_FAILED,
  data: { error },
});

const postApptBookTurnAway = apptBookTurnAway => (dispatch) => {
  dispatch({ type: POST_TURN_AWAY });

  return TurnAway.postTurnAway(apptBookTurnAway)
    .then(response =>
      dispatch(postApptBookTurnAwaySuccess(response)))
    .catch(error =>
      dispatch(postApptBookTurnAwayFailed(error)));
};


const apptBookTurnAwayActions = {
  postApptBookTurnAway,
};

export default apptBookTurnAwayActions;
