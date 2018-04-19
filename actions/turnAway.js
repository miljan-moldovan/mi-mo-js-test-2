import apiWrapper from '../utilities/apiWrapper';
import { storeForm, purgeForm } from './formCache';

export const SET_ON_EDITION_TURN_AWAY = 'turnAway/SET_ON_EDITION_TURN_AWAY';

export const POST_TURN_AWAY = 'turnAway/POST_TURN_AWAY';
export const POST_TURN_AWAY_SUCCESS = 'turnAway/POST_TURN_AWAY_SUCCESS';
export const POST_TURN_AWAY_FAILED = 'turnAway/POST_TURN_AWAY_FAILED';

export const SET_TURN_AWAY_FORM = 'turnAway/SET_TURN_AWAY_FORM';

const setTurnAwayUpdateForm = note => dispatch => dispatch(storeForm('TurnAwayScreenUpdate', note.id.toString(), note));
const setTurnAwayNewForm = (clientId, note) => dispatch => dispatch(storeForm('TurnAwayScreenNew', clientId.toString(), note));

const purgeTurnAwayUpdateForm = note => dispatch => dispatch(purgeForm('TurnAwayScreenUpdate', note.id.toString(), note));
const purgeTurnAwayNewForm = (clientId, note) => dispatch => dispatch(purgeForm('TurnAwayScreenNew', clientId.toString(), note));

const postTurnAwaySuccess = turnAway => ({
  type: POST_TURN_AWAY_SUCCESS,
  data: { turnAway },
});

const postTurnAwayFailed = error => ({
  type: POST_TURN_AWAY_FAILED,
  data: { error },
});

const postTurnAway = turnAway => (dispatch) => {
  dispatch({ type: POST_TURN_AWAY });
  console.log(turnAway);
  return apiWrapper.doRequest('postTurnAway', {
    body: turnAway,
  })
    .then(response =>
    //  dispatch(purgeForm('TurnAwayScreenNew', clientId.toString()));
      dispatch(postTurnAwaySuccess(response)))
    .catch(error =>
      // if (error.responseCode === apiConstants.responsesCodes.NetworkError) {
      //   dispatch(storeForm('TurnAwayScreenNew', clientId.toString(), note));
      // }
      dispatch(postTurnAwayFailed(error)));
};

function setOnEditionNote(onEditionNote) {
  return {
    type: SET_ON_EDITION_TURN_AWAY,
    data: { onEditionNote },
  };
}

const turnAwayActions = {
  setOnEditionNote,
  postTurnAway,
  setTurnAwayUpdateForm,
  setTurnAwayNewForm,
  purgeTurnAwayNewForm,
  purgeTurnAwayUpdateForm,
};

export default turnAwayActions;
