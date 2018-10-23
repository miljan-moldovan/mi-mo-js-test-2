import { Store, TurnAway } from '../utilities/apiWrapper';
import { storeForm, purgeForm } from './formCache';
import { showErrorAlert } from './utils';

export const SET_ON_EDITION_TURN_AWAY = 'turnAway/SET_ON_EDITION_TURN_AWAY';

export const POST_TURN_AWAY = 'turnAway/POST_TURN_AWAY';
export const POST_TURN_AWAY_SUCCESS = 'turnAway/POST_TURN_AWAY_SUCCESS';
export const POST_TURN_AWAY_FAILED = 'turnAway/POST_TURN_AWAY_FAILED';

const postTurnAwaySuccess = turnAway => ({
  type: POST_TURN_AWAY_SUCCESS,
  data: { turnAway },
});

const postTurnAwayFailed = error => ({
  type: POST_TURN_AWAY_FAILED,
  data: { error },
});

const postTurnAway = (turnAway, callback) => (dispatch) => {
  dispatch({ type: POST_TURN_AWAY });
  return TurnAway.postTurnAway(turnAway)
    .then((response) => {
      dispatch(postTurnAwaySuccess(response));
      callback(true, response);
    })
    .catch((error) => { showErrorAlert(error); dispatch(postTurnAwayFailed(error)); callback(false); });
};


const turnAwayActions = {
  postTurnAway,
};

export default turnAwayActions;
