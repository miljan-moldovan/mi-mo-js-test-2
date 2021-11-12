import turnAway, {
  SET_ON_EDITION_TURN_AWAY,
  POST_TURN_AWAY,
  POST_TURN_AWAY_SUCCESS,
  POST_TURN_AWAY_FAILED,
} from '../actions/turnAway';
import { Maybe } from '@/models';

const initialState: TurnAwayReducer = {
  turnAway: null,
  onEditionTurnAway: null,
  isLoading: false,
  error: null,
};

export interface TurnAwayReducer {
  error: Maybe<any>;
  isLoading: boolean;
  turnAway: Maybe<any>;
  onEditionTurnAway: Maybe<any>;
}

export default function turnAwayReducer(state: TurnAwayReducer = initialState, action): TurnAwayReducer {
  const { type, data } = action;
  switch (type) {
    case POST_TURN_AWAY:
      return {
        ...state,
        isLoading: true,
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
      };
    case SET_ON_EDITION_TURN_AWAY:
      return {
        ...state,
        error: null,
        onEditionTurnAway: data.onEditionTurnAway,
      };
    default:
      return state;
  }
}
