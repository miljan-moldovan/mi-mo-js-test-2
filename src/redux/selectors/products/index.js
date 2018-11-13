import { createSelector } from 'reselect';

const productsSelector = state => state.productsReducer.products;

const productCategoryList = createSelector(
  productsSelector,
  products => products.map(itm => ({ id: itm.id, name: itm.name })),
);

const productsSelectors = {
  productsSelector,
  productCategoryList,
};
export default productsSelectors;
