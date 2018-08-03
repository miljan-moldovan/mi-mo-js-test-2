import clientInfoActions, {
  SET_REFERRED_BY,
} from '../actions/clientInfo';

const initialState = {
  selectedReferredBy: {},
  isLoading: false,
};

export default function clientInfoReducer(state = initialState, action) {
  const { type, data } = action;

  switch (type) {
    case SET_REFERRED_BY:
      return {
        ...state,
        selectedReferredBy: data.selectedReferredBy,
      };
    default:
      return state;
  }
}
