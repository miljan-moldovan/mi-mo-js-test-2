import apptBookTurnAway, {
  SET_ON_EDITION_TURN_AWAY,
  POST_TURN_AWAY,
  POST_TURN_AWAY_SUCCESS,
  POST_TURN_AWAY_FAILED,
} from '../actions/apptBookTurnAway';

const initialState = {
  apptBookTurnAway: {
  },
  onEditionApptBookTurnAway: null,
  isLoading: false,
  error: null,
};

export default function apptBookTurnAwayReducer(state = initialState, action) {
  const { type, data } = action;
  switch (type) {
    case POST_TURN_AWAY:
      return {
        ...state,
        isLoading: false,
      };
    case POST_TURN_AWAY_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
      };
    case POST_TURN_AWAY_FAILED:
      return {
        ...state,
        isLoading: false,
        error: data.error,
        notes: [],
      };
    case SET_ON_EDITION_TURN_AWAY:
      return {
        ...state,
        error: null,
        onEditionApptBookTurnAway: data.onEditionApptBookTurnAway,
      };
    default:
      return state;
  }
}
