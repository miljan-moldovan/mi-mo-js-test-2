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

const postApptBookTurnAway = (apptBookTurnAway, callback) => (dispatch) => {
  dispatch({ type: POST_TURN_AWAY });

  return TurnAway.postTurnAway(apptBookTurnAway)
    .then((response) => { dispatch(postApptBookTurnAwaySuccess(response)); callback(true); })
    .catch((error) => { dispatch(postApptBookTurnAwayFailed(error)); callback(false); });
};


const apptBookTurnAwayActions = {
  postApptBookTurnAway,
};

export default apptBookTurnAwayActions;
