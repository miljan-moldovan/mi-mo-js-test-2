import {
  GET_TURNAWAY_REASONS,
  GET_TURNAWAY_REASONS_SUCCESS,
  GET_TURNAWAY_REASONS_FAILED,
} from '../actions/turnAwayReasons';
import { Maybe, TurnAwayReason } from '@/models';

const initialState: TurnAwayReasonsReducer = {
  isLoading: false,
  error: null,
  turnAwayReasons: [],
};

export interface TurnAwayReasonsReducer {
  isLoading: boolean;
  error: Maybe<any>;
  turnAwayReasons: TurnAwayReason[];
}

const TurnAwayReasonCode = {
  providerUnavail: 'providerUnavail',
  providerOut: 'providerOut',
  salonClosed: 'salonClosed',
  resourceUnavail: 'resourceUnavail',
  roomUnavail: 'roomUnavail',
  other: 'other',
};

const setReasonsNames = reasons => {
  for (let i = 0; i < reasons.length; i += 1) {
    const reason = reasons[i];

    switch (reason.name.toLowerCase()) {
      case TurnAwayReasonCode.providerUnavail.toLowerCase():
        reason.name = 'Provider is not available';
        break;

      case TurnAwayReasonCode.providerOut.toLowerCase():
        reason.name = 'Provider is not working';
        break;

      case TurnAwayReasonCode.salonClosed.toLowerCase():
        reason.name = 'Salon is closed';
        break;

      case TurnAwayReasonCode.resourceUnavail.toLowerCase():
        reason.name = 'Resource is unavaliable';
        break;

      case TurnAwayReasonCode.roomUnavail.toLowerCase():
        reason.name = 'Room is unavaliable';
        break;

      default:
        break;
    }
  }

  return reasons;
};

export default function turnAwayReasonsReducer(state: TurnAwayReasonsReducer = initialState, action): TurnAwayReasonsReducer {
  const { type, data } = action;

  switch (type) {
    case GET_TURNAWAY_REASONS:
      return {
        ...state,
        isLoading: true,
        turnAwayReasons: [],
      };
    case GET_TURNAWAY_REASONS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        turnAwayReasons: setReasonsNames(data.response),
      };
    case GET_TURNAWAY_REASONS_FAILED:
      return {
        ...state,
        isLoading: false,
        error: data.error,
      };
    default:
      return state;
  }
}
