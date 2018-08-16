import clientInfoActions, {
  GET_CLIENT,
  GET_CLIENT_SUCCESS,
  GET_CLIENT_FAILED,
  DELETE_CLIENT,
  DELETE_CLIENT_SUCCESS,
  DELETE_CLIENT_FAILED,
  PUT_CLIENT,
  PUT_CLIENT_SUCCESS,
  PUT_CLIENT_FAILED,
  POST_CLIENT,
  POST_CLIENT_SUCCESS,
  POST_CLIENT_FAILED,
  GET_CLIENT_REFERRAL_TYPES,
  GET_CLIENT_REFERRAL_TYPES_SUCCESS,
  GET_CLIENT_REFERRAL_TYPES_FAILED,
} from '../actions/clientInfo';

const initialState = {
  client: [],
  clientReferralTypes: [],
  isLoading: false,
  error: null,
};

const renameClientReferralTypes = (clientReferralTypes) => {
  const renamedClientReferralTypes = [];
  for (let i = 0; i < clientReferralTypes.length; i += 1) {
    renamedClientReferralTypes.push({
      key: clientReferralTypes[i].id,
      value: clientReferralTypes[i].name,
    });
  }
  return renamedClientReferralTypes;
};

export default function clientInfoReducer(state = initialState, action) {
  const { type, data } = action;
  switch (type) {
    case POST_CLIENT:
      return {
        ...state,
        isLoading: true,
      };
    case POST_CLIENT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
      };
    case POST_CLIENT_FAILED:
      return {
        ...state,
        isLoading: false,
        error: data.error,
        client: [],
      };
    case PUT_CLIENT:
      return {
        ...state,
        isLoading: true,
      };
    case PUT_CLIENT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
      };
    case PUT_CLIENT_FAILED:
      return {
        ...state,
        isLoading: false,
        error: data.error,
        client: [],
      };
    case DELETE_CLIENT:
      return {
        ...state,
        isLoading: true,
      };
    case DELETE_CLIENT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
      };
    case DELETE_CLIENT_FAILED:
      return {
        ...state,
        isLoading: false,
        error: data.error,
        client: [],
      };
    case GET_CLIENT:
      return {
        ...state,
        isLoading: true,
      };
    case GET_CLIENT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        client: data.client,
        error: null,
      };
    case GET_CLIENT_FAILED:
      return {
        ...state,
        isLoading: false,
        error: data.error,
        client: {},
      };
    case GET_CLIENT_REFERRAL_TYPES:
      return {
        ...state,
        isLoading: true,
      };
    case GET_CLIENT_REFERRAL_TYPES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        clientReferralTypes: renameClientReferralTypes(data.clientReferralTypes),
        error: null,
      };
    case GET_CLIENT_REFERRAL_TYPES_FAILED:
      return {
        ...state,
        isLoading: false,
        error: data.error,
        clientReferralTypes: [],
      };
    default:
      return state;
  }
}
