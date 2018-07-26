import { ApptBookTurnAway } from '../utilities/apiWrapper';
import { storeForm, purgeForm } from './formCache';

export const SET_ON_EDITION_TURN_AWAY = 'apptBookTurnAway/SET_ON_EDITION_TURN_AWAY';

export const POST_TURN_AWAY = 'apptBookTurnAway/POST_TURN_AWAY';
export const POST_TURN_AWAY_SUCCESS = 'apptBookTurnAway/POST_TURN_AWAY_SUCCESS';
export const POST_TURN_AWAY_FAILED = 'apptBookTurnAway/POST_TURN_AWAY_FAILED';

export const SET_TURN_AWAY_FORM = 'apptBookTurnAway/SET_TURN_AWAY_FORM';

const setApptBookTurnAwayUpdateForm = note => dispatch => dispatch(storeForm('ApptBookTurnAwayScreenUpdate', note.id.toString(), note));
const setApptBookTurnAwayNewForm = (clientId, note) => dispatch => dispatch(storeForm('ApptBookTurnAwayScreenNew', clientId.toString(), note));

const purgeApptBookTurnAwayUpdateForm = note => dispatch => dispatch(purgeForm('ApptBookTurnAwayScreenUpdate', note.id.toString(), note));
const purgeApptBookTurnAwayNewForm = (clientId, note) => dispatch => dispatch(purgeForm('ApptBookTurnAwayScreenNew', clientId.toString(), note));

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

  return ApptBookTurnAway.postApptBookTurnAway(apptBookTurnAway)
    .then(response =>
    //  dispatch(purgeForm('ApptBookTurnAwayScreenNew', clientId.toString()));
      dispatch(postApptBookTurnAwaySuccess(response)))
    .catch(error =>
      // if (error.responseCode === apiConstants.responsesCodes.NetworkError) {
      //   dispatch(storeForm('ApptBookTurnAwayScreenNew', clientId.toString(), note));
      // }
      dispatch(postApptBookTurnAwayFailed(error)));
};

function setOnEditionNote(onEditionNote) {
  return {
    type: SET_ON_EDITION_TURN_AWAY,
    data: { onEditionNote },
  };
}

const apptBookTurnAwayActions = {
  setOnEditionNote,
  postApptBookTurnAway,
  setApptBookTurnAwayUpdateForm,
  setApptBookTurnAwayNewForm,
  purgeApptBookTurnAwayNewForm,
  purgeApptBookTurnAwayUpdateForm,
};

export default apptBookTurnAwayActions;
