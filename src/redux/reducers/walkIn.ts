import walkInActions, {
  SET_ESTIMATED_TIME,
  SET_CURRENT_STEP,
  SELECTED_CLIENT,
  SELECTED_SERVICE,
  SELECTED_PROVIDER,
  SELECTED_PROMOTION,
  POST_WALKIN_CLIENT,
  POST_WALKIN_CLIENT_SUCCESS,
  POST_WALKIN_CLIENT_FAILED,
} from '../actions/walkIn';
import { Maybe, Client, Service, PureProvider, Promotion } from '@/models';

const initialState: WalkInReducer = {
  error: null,
  isLoading: false,
  estimatedWaitTime: 0,
  currentStep: 1,
  selectedClient: null,
  selectedService: null,
  selectedProvider: null,
  selectedPromotion: null,
};

export interface WalkInReducer {
  error: Maybe<any>;
  isLoading: boolean;
  estimatedWaitTime: number;
  currentStep: number;
  selectedClient: Maybe<Client>;
  selectedService: Maybe<Service>;
  selectedProvider: Maybe<PureProvider>;
  selectedPromotion: Maybe<Promotion>;
}

export default function walkInReducer(state: WalkInReducer = initialState, action): WalkInReducer {
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
    case POST_WALKIN_CLIENT:
      return {
        ...state,
        isLoading: true,
      };
    case POST_WALKIN_CLIENT_SUCCESS:
      return {
        ...state,
        isLoading: false,
      };
    case POST_WALKIN_CLIENT_FAILED:
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
}
