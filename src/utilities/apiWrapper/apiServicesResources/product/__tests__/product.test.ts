import getProduct from '../getProduct';
import getProducts from '../getProducts';
import getProductTree from '../getProductTree';
import getInventoryRetailTree from '../getInventoryRetailTree';
import postRecommendProduct from '../postRecommendProduct';

import axios from 'axios';

const MockAdapter = require('axios-mock-adapter');
const mock = new MockAdapter(axios);
const returnData = {
  response: {
    test: 'test',
  },
};

mock.onGet('Inventory/RetailTree').reply(200, returnData);
mock.onGet('Products/101').reply(200, returnData);
mock.onGet('RecommendationSystem/Products').reply(200, returnData);
mock.onGet('RecommendationSystem/Products/Tree').reply(200, returnData);
mock.onPost('RecommendationSystem/Recommend').reply(200, returnData);

describe('product', () => {
  test('getProduct should return correct property', async () => {
    const res = await getProduct(101);
    expect(res).toEqual(returnData.response);
  });
  test('getProducts should return correct property', async () => {
    const res = await getProducts();
    expect(res).toEqual(returnData.response);
  });
  test('getProductTree should return correct property', async () => {
    const res = await getProductTree();
    expect(res).toEqual(returnData.response);
  });
  test('getInventoryRetailTree should return correct property', async () => {
    const res = await getInventoryRetailTree();
    expect(res).toEqual(returnData.response);
  });
  test('postRecommendProduct should return correct property', async () => {
    const res = await postRecommendProduct(101);
    expect(res).toEqual(returnData.response);
  });
});
