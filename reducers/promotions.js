import {
  GET_PRODUCT_PROMOTIONS,
  GET_PRODUCT_PROMOTIONS_FAILED,
  GET_PRODUCT_PROMOTIONS_SUCCESS,
  GET_SERVICE_PROMOTIONS,
  GET_SERVICE_PROMOTIONS_FAILED,
  GET_SERVICE_PROMOTIONS_SUCCESS,
} from '../actions/promotions';

const initialState = {
  isLoading: false,
  servicePromos: [],
  productPromos: [],
};
const promotionsReducer = (state = initialState, action) => {
  const { type, data } = action;
  switch (type) {
    case GET_SERVICE_PROMOTIONS:
      return {
        ...state,
        isLoading: true,
      };
    case GET_SERVICE_PROMOTIONS_FAILED:
      return {
        ...state,
        isLoading: false,
      };
    case GET_SERVICE_PROMOTIONS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        servicePromos: data.promotions,
      };
    case GET_PRODUCT_PROMOTIONS:
      return {
        ...state,
        isLoading: true,
      };
    case GET_PRODUCT_PROMOTIONS_FAILED:
      return {
        ...state,
        isLoading: false,
      };
    case GET_PRODUCT_PROMOTIONS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        productPromos: data.promotions,
      };
    default:
      return state;
  }
};
export default promotionsReducer;
