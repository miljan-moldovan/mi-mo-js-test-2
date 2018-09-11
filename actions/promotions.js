import { Promotions } from '../utilities/apiWrapper';

export const GET_SERVICE_PROMOTIONS = 'promotions/GET_SERVICE_PROMOTIONS';
export const GET_SERVICE_PROMOTIONS_SUCCESS = 'promotions/GET_SERVICE_PROMOTIONS_SUCCESS';
export const GET_SERVICE_PROMOTIONS_FAILED = 'promotions/GET_SERVICE_PROMOTIONS_FAILED';

export const GET_PRODUCT_PROMOTIONS = 'promotions/GET_PRODUCT_PROMOTIONS';
export const GET_PRODUCT_PROMOTIONS_SUCCESS = 'promotions/GET_PRODUCT_PROMOTIONS_SUCCESS';
export const GET_PRODUCT_PROMOTIONS_FAILED = 'promotions/GET_PRODUCT_PROMOTIONS_FAILED';

const getServicePromos = () => (dispatch) => {
  dispatch({ type: GET_SERVICE_PROMOTIONS });
  Promotions.getServicePromotions()
    .then(promotions => dispatch({ type: GET_SERVICE_PROMOTIONS_SUCCESS, data: { promotions } }))
    .catch(error => dispatch({ type: GET_SERVICE_PROMOTIONS_FAILED, data: { error } }));
};

const getProductPromos = () => (dispatch) => {
  dispatch({ type: GET_PRODUCT_PROMOTIONS });
  Promotions.getProductPromotions()
    .then(promotions => dispatch({ type: GET_PRODUCT_PROMOTIONS_SUCCESS, data: { promotions } }))
    .catch(error => dispatch({ type: GET_PRODUCT_PROMOTIONS_FAILED, data: { error } }));
};

const promotionsActions = {
  getServicePromos,
  getProductPromos,
};
export default promotionsActions;
