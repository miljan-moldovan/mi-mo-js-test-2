import getServicePromotions from '../getServicePromotions';
import getProductPromotions from '../getProductPromotions';

import axios from 'axios';

const MockAdapter = require('axios-mock-adapter');
const mock = new MockAdapter(axios);
const returnData = {
  response: {
    test: 'test',
  },
};

mock.onGet('Promotion/ForServices').reply(200, returnData);
mock.onGet('Promotion/ForProducts').reply(200, returnData);


describe('promotions', () => {
  test('getServicePromotions should return correct property', async () => {
    const res = await getServicePromotions();
    expect(res).toEqual(returnData.response);
  });
  test('getProductPromotions should return correct property', async () => {
    const res = await getProductPromotions();
    expect(res).toEqual(returnData.response);
  });
});
