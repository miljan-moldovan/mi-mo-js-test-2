import productsActions, {
  SET_PRODUCTS,
  SET_FILTERED_PRODUCTS,
  SET_SHOW_CATEGORY_PRODUCTS,
  GET_PRODUCTS,
  GET_PRODUCTS_SUCCESS,
  GET_PRODUCTS_FAILED,
  SET_CATEGORY_PRODUCTS,
  GET_CATEGORY_PRODUCTS,
  SET_SELECTED_PRODUCT,
  GET_RECOMMENDATION_SYSTEM_PRODUCTS,
  GET_RECOMMENDATION_SYSTEM_PRODUCTS_FAILED,
  GET_RECOMMENDATION_SYSTEM_PRODUCTS_SUCCESS,
} from '../actions/products';
import { ProductCategories, ProductBase, Maybe } from '@/models';

const initialState: ProductsReducer = {
  isLoading: false,
  filtered: [],
  products: [],
  showCategoryProducts: false,
  categoryProducts: [],
  error: null,
  selectedProduct: null,
};

export interface ProductsReducer {
  isLoading: boolean;
  filtered: ProductBase[];
  products: ProductBase[];
  showCategoryProducts: boolean;
  categoryProducts: ProductCategories[];
  selectedProduct: Maybe<ProductBase>;
  error: Maybe<any>;
}

export default function productsReducer(state: ProductsReducer = initialState, action): ProductsReducer {
  const { type, data } = action;
  switch (type) {
    case GET_CATEGORY_PRODUCTS:
      return {
        ...state,
        isLoading: true,
      };
    case SET_CATEGORY_PRODUCTS:
      return {
        ...state,
        error: null,
        categoryProducts: data.categoryProducts,
      };
    case SET_SHOW_CATEGORY_PRODUCTS:
      return {
        ...state,
        error: null,
        showCategoryProducts: data.showCategoryProducts,
      };
    case GET_PRODUCTS:
      return {
        ...state,
        isLoading: true,
      };
    case GET_PRODUCTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        products: data.products,
        error: null,
      };
    case GET_PRODUCTS_FAILED:
      return {
        ...state,
        isLoading: false,
        error: data.error,
        products: [],
      };
    case SET_PRODUCTS:
      return {
        ...state,
        error: null,
        products: data.products,
      };
    case GET_RECOMMENDATION_SYSTEM_PRODUCTS:
      return {
        ...state,
        isLoading: true,
      };
    case GET_RECOMMENDATION_SYSTEM_PRODUCTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        products: data.products,
        error: null,
      };
    case GET_RECOMMENDATION_SYSTEM_PRODUCTS_FAILED:
      return {
        ...state,
        isLoading: false,
        error: data.error,
        products: [],
      };
    case SET_PRODUCTS:
      return {
        ...state,
        error: null,
        products: data.products,
      };
      
    case SET_FILTERED_PRODUCTS:
      return {
        ...state,
        error: null,
        filtered: data.filtered,
      };
    case SET_SELECTED_PRODUCT:
      return {
        ...state,
        error: null,
        selectedProduct: data.selectedProduct,
      };
    default:
      return state;
  }
}
