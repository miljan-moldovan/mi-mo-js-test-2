import postCheckConflictsBlocks from '../postCheckConflictsBlocks';
import axios from 'axios';

const MockAdapter = require('axios-mock-adapter');

const mock = new MockAdapter(axios);

const returnData = {
  response: {
    test: 'test',
  },
};

mock.onPost('ScheduleBlocks/Conflicts').reply(200, returnData);

describe('postCheckConflictsBlocks', () => {
  test('Should return correct property', async () => {
    const res = await postCheckConflictsBlocks('conflict?');
    expect(res).toEqual(returnData.response);
  });
});
