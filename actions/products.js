import { Product } from '../utilities/apiWrapper';

export const SET_PRODUCTS = 'products/SET_PRODUCTS';
export const SET_FILTERED_PRODUCTS = 'products/SET_FILTERED_PRODUCTS';
export const SET_SHOW_CATEGORY_PRODUCTS = 'products/SET_SHOW_CATEGORY_PRODUCTS';
export const SET_CATEGORY_PRODUCTS = 'products/SET_CATEGORY_PRODUCTS';

export const GET_PRODUCTS = 'products/GET_PRODUCTS';
export const GET_PRODUCTS_SUCCESS = 'products/GET_PRODUCTS_SUCCESS';
export const GET_PRODUCTS_FAILED = 'products/GET_PRODUCTS_FAILED';
export const GET_CATEGORY_PRODUCTS = 'products/GET_CATEGORY_PRODUCTS';
export const SET_SELECTED_PRODUCT = 'products/SET_SELECTED_PRODUCT';


const getProductsSuccess = products => ({
  type: GET_PRODUCTS_SUCCESS,
  data: { products },
});

const getProductsFailed = error => ({
  type: GET_PRODUCTS_FAILED,
  data: { error },
});

const getProducts = () => (dispatch) => {
  // dispatch({ type: GET_PRODUCTS });
  // return apiWrapper.doRequest('getProducts', {})
  //   .then(response => dispatch(getProductsSuccess(response)))
  //   .catch(error => dispatch(getProductsFailed(error)));
  dispatch({ type: GET_PRODUCTS });
  Product.getInventoryRetailTree()
    .then(response => dispatch(getProductsSuccess(response)))
    .catch(error => dispatch(getProductsFailed(error)));
};

function setProducts(products) {
  return {
    type: SET_PRODUCTS,
    data: { products },
  };
}

function setShowCategoryProducts(showCategoryProducts) {
  return {
    type: SET_SHOW_CATEGORY_PRODUCTS,
    data: { showCategoryProducts },
  };
}

function setCategoryProducts(categoryProducts) {
  return {
    type: SET_CATEGORY_PRODUCTS,
    data: { categoryProducts },
  };
}

function setFilteredProducts(filtered) {
  return {
    type: SET_FILTERED_PRODUCTS,
    data: { filtered },
  };
}

function setSelectedProduct(selectedProduct) {
  return {
    type: SET_SELECTED_PRODUCT,
    data: { selectedProduct },
  };
}

const productsActions = {
  setProducts,
  setFilteredProducts,
  getProducts,
  setShowCategoryProducts,
  setCategoryProducts,
  setSelectedProduct,
};

export default productsActions;
