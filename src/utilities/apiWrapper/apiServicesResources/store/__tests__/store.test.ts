import getBlockTypes from '../getBlockTypes';
import getCompanies from '../getCompanies';
import getClientReferralTypes from '../getClientReferralTypes';
import getListOfStores from '../getListOfStores';
import getResources from '../getResources';
import getRooms from '../getRooms';
import getSchedule from '../getSchedule';
import getScheduleExceptions from '../getScheduleExceptions';
import getStoreInfo from '../getStoreInfo';
import getStoreWeeklySchedule from '../getStoreWeeklySchedule';
import getTurnAwayReasons from '../getTurnAwayReasons';
import postSetStore from '../postSetStore';

import axios from 'axios';

const MockAdapter = require('axios-mock-adapter');
const mock = new MockAdapter(axios);
const returnData = {
  response: {
    test: 'test',
  },
};

const storeId = 970;
const storeIdForFail = 1;

const fromDate = '12-12-2018';
const toDate = '12-12-2019';

mock.onGet('Store/BlockTypes').reply(200, returnData);
mock.onGet('Store/Companies').reply(200, returnData);
mock.onGet('Store/ClientReferralTypes').reply(200, returnData);
mock.onGet('MobilePos/Stores').reply(200, returnData);
mock.onGet('Store/Resources').reply(200, returnData);
mock.onGet('Store/Rooms').reply(200, returnData);
mock.onGet(`Store/Schedule/${fromDate}`).reply(200, returnData);
mock.onGet(`Store/ScheduleExceptions/${fromDate}/${toDate}`).reply(200, returnData);
mock.onGet('Store/Info').reply(200, returnData);
mock.onGet('Store/WeeklySchedule').reply(200, returnData);
mock.onGet('Store/TurnAwayReasons').reply(200, returnData);
mock.onPost(`MobilePos/SetStore/${storeId}`).reply(200, returnData);
mock.onPost(`MobilePos/SetStore/${storeIdForFail}`).reply(404, null);


describe('Get store api', () => {
  test('GetBlockTypes should return correct property', async () => {
    const res = await getBlockTypes();
    expect(res).toEqual(returnData.response);
  });
  test('GetCompanies should return correct property', async () => {
    const res = await getCompanies();
    expect(res).toEqual(returnData.response);
  });
  test('GetClientReferralTypes should return correct property', async () => {
    const res = await getClientReferralTypes();
    expect(res).toEqual(returnData.response);
  });
  test('GetListOfStores should return correct property', async () => {
    const res = await getListOfStores();
    expect(res).toEqual(returnData.response);
  });
  test('GetResources should return correct property', async () => {
    const res = await getResources();
    expect(res).toEqual(returnData.response);
  });
  test('GetRooms should return correct property', async () => {
    const res = await getRooms();
    expect(res).toEqual(returnData.response);
  });
  test('GetSchedule should return correct property', async () => {
    const res = await getSchedule(fromDate);
    expect(res).toEqual(returnData.response);
  });
  test('GetScheduleExceptions should return correct property', async () => {
    const res = await getScheduleExceptions({ fromDate, toDate });
    expect(res).toEqual(returnData.response);
  });
  test('GetStoreInfo should return correct property', async () => {
    const res = await getStoreInfo();
    expect(res).toEqual(returnData.response);
  });
  test('GetStoreWeeklySchedule should return correct property', async () => {
    const res = await getStoreWeeklySchedule();
    expect(res).toEqual(returnData.response);
  });
  test('GetTurnAwayReasons should return correct property', async () => {
    const res = await getTurnAwayReasons();
    expect(res).toEqual(returnData.response);
  });
  test('PostSetStore should return null if error', async () => {
    const res = await postSetStore(storeIdForFail);
    expect(res).toEqual(null);
  });
});
