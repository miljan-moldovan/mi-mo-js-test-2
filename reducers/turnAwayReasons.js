import {
  GET_TURNAWAY_REASONS,
  GET_TURNAWAY_REASONS_SUCCESS,
  GET_TURNAWAY_REASONS_FAILED,
} from '../actions/turnAwayReasons';

const initialState = {
  isLoading: false,
  error: null,
  turnAwayReasons: [],
};

const TurnAwayReasonCode = {
  providerUnavail: 'providerUnavail',
  providerOut: 'providerOut',
  salonClosed: 'salonClosed',
  resourceUnavail: 'resourceUnavail',
  roomUnavail: 'roomUnavail',
  other: 'other',
};

const setReasonsNames = (reasons) => {
  for (let i = 0; i < reasons.length; i += 1) {
    const reason = reasons[i];

    switch (reason.name.toLowerCase()) {
      case TurnAwayReasonCode.providerUnavail.toLowerCase():
        reason.name = 'Desired provider has no avaliability';
        break;

      case TurnAwayReasonCode.providerOut.toLowerCase():
        reason.name = 'Desired provider is not working';
        break;

      case TurnAwayReasonCode.salonClosed.toLowerCase():
        reason.name = 'Salon is closed';
        break;

      case TurnAwayReasonCode.resourceUnavail.toLowerCase():
        reason.name = 'Needed resource is unavaliable';
        break;

      case TurnAwayReasonCode.roomUnavail.toLowerCase():
        reason.name = 'Needed room is unavaliable';
        break;

      default:
        break;
    }
  }

  return reasons;
};

export default function turnAwayReasonsReducer(state = initialState, action) {
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
