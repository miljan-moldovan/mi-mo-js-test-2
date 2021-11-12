import { Product } from '../../utilities/apiWrapper';
import { Maybe, ProductBase, ProductCategories } from '@/models';

export const SET_PRODUCTS = 'products/SET_PRODUCTS';
export const SET_FILTERED_PRODUCTS = 'products/SET_FILTERED_PRODUCTS';
export const SET_SHOW_CATEGORY_PRODUCTS = 'products/SET_SHOW_CATEGORY_PRODUCTS';
export const SET_CATEGORY_PRODUCTS = 'products/SET_CATEGORY_PRODUCTS';

export const GET_PRODUCTS = 'products/GET_PRODUCTS';
export const GET_PRODUCTS_SUCCESS = 'products/GET_PRODUCTS_SUCCESS';
export const GET_PRODUCTS_FAILED = 'products/GET_PRODUCTS_FAILED';
export const GET_CATEGORY_PRODUCTS = 'products/GET_CATEGORY_PRODUCTS';
export const SET_SELECTED_PRODUCT = 'products/SET_SELECTED_PRODUCT';

export const GET_RECOMMENDATION_SYSTEM_PRODUCTS = 'products/GET_RECOMMENDATION_SYSTEM_PRODUCTS';
export const GET_RECOMMENDATION_SYSTEM_PRODUCTS_SUCCESS = 'products/GET_RECOMMENDATION_SYSTEM_PRODUCTS_SUCCESS';
export const GET_RECOMMENDATION_SYSTEM_PRODUCTS_FAILED = 'products/GET_RECOMMENDATION_SYSTEM_PRODUCTS_FAILED';

const getProductsSuccess = (products: Maybe<ProductCategories[]>): any => ({
  type: GET_PRODUCTS_SUCCESS,
  data: { products },
});

const getProductsFailed = (error: Maybe<any>): any => ({
  type: GET_PRODUCTS_FAILED,
  data: { error },
});

const getProducts = (): any => dispatch => {
  // dispatch({ type: GET_PRODUCTS });
  // return apiWrapper.doRequest('getProducts', {})
  //   .then(response => dispatch(getProductsSuccess(response)))
  //   .catch(error => dispatch(getProductsFailed(error)));
  dispatch({ type: GET_PRODUCTS });
  Product.getInventoryRetailTree()
    .then(response => dispatch(getProductsSuccess(response)))
    .catch(error => dispatch(getProductsFailed(error)));
};

const getRecommendationSystemProductsSuccess = (products: Maybe<ProductCategories[]>): any => ({
  type: GET_RECOMMENDATION_SYSTEM_PRODUCTS_SUCCESS,
  data: { products },
});

const getRecommendationSystemProductsFailed = (error: Maybe<any>): any => ({
  type: GET_RECOMMENDATION_SYSTEM_PRODUCTS_FAILED,
  data: { error },
});

const getRecommendationSystemProducts = (): any => dispatch => {
  dispatch({ type: GET_RECOMMENDATION_SYSTEM_PRODUCTS });
  Product.getProductTree()
    .then(response => dispatch(getRecommendationSystemProductsSuccess(response)))
    .catch(error => dispatch(getRecommendationSystemProductsFailed(error)));
};

function setProducts(products) {
  return {
    type: SET_PRODUCTS,
    data: { products },
  };
}

function setShowCategoryProducts(showCategoryProducts: boolean): any {
  return {
    type: SET_SHOW_CATEGORY_PRODUCTS,
    data: { showCategoryProducts },
  };
}

function setCategoryProducts(categoryProducts: Maybe<ProductCategories[]>): any {
  return {
    type: SET_CATEGORY_PRODUCTS,
    data: { categoryProducts },
  };
}

function setFilteredProducts(filtered: Maybe<ProductCategories[]>): any {
  return {
    type: SET_FILTERED_PRODUCTS,
    data: { filtered },
  };
}

function setSelectedProduct(selectedProduct: Maybe<ProductBase>): any {
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
  getRecommendationSystemProducts,
};

export interface ProductsActions {
  setProducts: typeof setProducts;
  setFilteredProducts: typeof setFilteredProducts;
  getProducts: typeof getProducts;
  setShowCategoryProducts: typeof setShowCategoryProducts;
  setCategoryProducts: typeof setCategoryProducts;
  setSelectedProduct: typeof setSelectedProduct;
}

export default productsActions;
