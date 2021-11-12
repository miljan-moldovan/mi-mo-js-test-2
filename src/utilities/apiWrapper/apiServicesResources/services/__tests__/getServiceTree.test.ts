import getServiceTree from '../getServiceTree';
import axios from 'axios';

const MockAdapter = require('axios-mock-adapter');

const mock = new MockAdapter(axios);

const query = {
  a: {
    b: 'hello',
  },
};

const returnData = {
  response: {
    test: 'test',
  },
};

mock.onGet('Services/Tree?a%5Bb%5D=hello').reply(200, returnData);

describe('getSessionInfo', () => {
  test('Should return correct property', async () => {
    const res = await getServiceTree(query);
    expect(res).toEqual(returnData.response);
  });
});
