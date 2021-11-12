import getReasonTypes from '../getReasonTypes';
import putCheckIn from '../putCheckIn';
import putFinish from '../putFinish';
import putNoShow from '../putNoShow';
import putReturned from '../putReturned';
import putReturnLater from '../putReturnLater';
import putStartService from '../putStartService';
import putToWaiting from '../putToWaiting';
import putUndoFinish from '../putUndoFinish';
import putWalkOut from '../putWalkOut';
import putUncheckIn from '../putUncheckIn';
import putCheckOut from '../putCheckOut';

import axios from 'axios';

const MockAdapter = require('axios-mock-adapter');
const mock = new MockAdapter(axios);
const returnData = {
  response: {
    test: 'test',
  },
};

mock.onGet('QueueStatus/RemovalReasonTypes').reply(200, returnData);
mock.onPut('QueueStatus/CheckOut/101').reply(200, returnData);
mock.onPut('QueueStatus/CheckIn/101').reply(200, returnData);
mock.onPut('QueueStatus/Finish/101').reply(200, returnData);
mock.onPut('QueueStatus/NoShow/101').reply(200, returnData);
mock.onPut('QueueStatus/Returned/101').reply(200, returnData);
mock.onPut('QueueStatus/ReturnLater/101').reply(200, returnData);
mock.onPut('QueueStatus/StartService/101').reply(200, returnData);
mock.onPut('QueueStatus/ToWaiting/101').reply(200, returnData);
mock.onPut('QueueStatus/UnCheckIn/101').reply(200, returnData);
mock.onPut('QueueStatus/WalkOut/101').reply(200, returnData);
mock.onPut('QueueStatus/UndoFinish/101').reply(200, returnData);

describe('QueueStatus', () => {
  test('getReasonTypes should return correct property', async () => {
    const res = await getReasonTypes();
    expect(res).toEqual(returnData.response);
  });
  test('putCheckOut should return correct property', async () => {
    const res = await putCheckOut(101);
    expect(res).toEqual(returnData.response);
  });
  test('putCheckIn should return correct property', async () => {
    const res = await putCheckIn(101);
    expect(res).toEqual(returnData.response);
  });
  test('putFinish should return correct property', async () => {
    const res = await putFinish(101);
    expect(res).toEqual(returnData.response);
  });
  test('putNoShow should return correct property', async () => {
    const res = await putNoShow(101, 'test');
    expect(res).toEqual(returnData.response);
  });
  test('putReturned should return correct property', async () => {
    const res = await putReturned(101);
    expect(res).toEqual(returnData.response);
  });
  test('putReturnLater should return correct property', async () => {
    const res = await putReturnLater(101);
    expect(res).toEqual(returnData.response);
  });
  test('putStartService should return correct property', async () => {
    const res = await putStartService(101, {some: 'data'});
    expect(res).toEqual(returnData.response);
  });
  test('putToWaiting should return correct property', async () => {
    const res = await putToWaiting(101);
    expect(res).toEqual(returnData.response);
  });
  test('putUncheckIn should return correct property', async () => {
    const res = await putUncheckIn(101);
    expect(res).toEqual(returnData.response);
  });
  test('putUndoFinish should return correct property', async () => {
    const res = await putUndoFinish(101);
    expect(res).toEqual(returnData.response);
  });
  test('putWalkOut should return correct property', async () => {
    const res = await putWalkOut(101, {walk: 'out'});
    expect(res).toEqual(returnData.response);
  });
});
