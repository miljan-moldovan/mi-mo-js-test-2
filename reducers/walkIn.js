import walkInActions, {
  SET_ESTIMATED_TIME,
  SET_CURRENT_STEP,
  SELECTED_CLIENT,
  SELECTED_SERVICE,
  SELECTED_PROVIDER,
  SELECTED_PROMOTION,
} from '../actions/walkIn';

const initialState = {
  estimatedWaitTime: 0,
  currentStep: 1,
  selectedClient: null,
  selectedService: null,
  selectedProvider: null,
  selectedPromotion: null,
};

export default function walkInReducer(state = initialState, action) {
  const { type, data } = action;
  switch (type) {
    case SET_ESTIMATED_TIME:
      return {
        ...state,
        error: null,
        estimatedWaitTime: data.time,
      };
    case SET_CURRENT_STEP:
      return {
        ...state,
        error: null,
        currentStep: data.step,
      };
    case SELECTED_SERVICE:
      return {
        ...state,
        error: null,
        selectedService: data.service,
      };
    case SELECTED_PROVIDER:
      return {
        ...state,
        error: null,
        selectedProvider: data.provider,
      };
    case SELECTED_PROMOTION:
      return {
        ...state,
        error: null,
        selectedPromotion: data.promotion,
      };
    case SELECTED_CLIENT:
      return {
        ...state,
        error: null,
        selectedClient: data.client,
      };
    default:
      return state;
  }
}
