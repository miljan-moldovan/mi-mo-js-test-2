import getClientFormulas from '../getClientFormulas';
import getClients from '../getClients';
import getFormulasAndNotes from '../getFormulasAndNotes';
import getMergeableClients from '../getMergeableClients';
import postMergeClients from '../postMergeClients';
import putContactInformation from '../putContactInformation';
import getFormulas from '../getFormulas';
import getClient from '../getClient';
import putClient from '../putClient';
import deleteClient from '../deleteClient';
import getClientAppointments from '../getClientAppointments';
import putClientEmail from '../putClientEmail';
import postClient from '../postClient';
import getZipCode from '../getZipCode';

import axios from 'axios';
import qs from 'qs';

const MockAdapter = require('axios-mock-adapter');
const mock = new MockAdapter(axios);
const returnData = {
  response: {
    test: 'test',
  },
};

const queryString = (arg) => qs.stringify(arg);

const reqData = {
  startDate: '12-12-2018',
  endDate: '12-12-2019',
  fromDate: '12-12-2018',
  toDate: '12-12-2019',
  ids: 101,
  id: 101,
  clientId: 101,
  query: 'testmepls',
  email: 'some@postservice.net',
  zipCode: '220003',
};

mock
  // getZipCode
  .onGet(`ZipCodes/${reqData.zipCode}`).reply(200, returnData)
  // getClientAppointments
  .onGet(`Clients/${reqData.clientId}/Appointments/${
    reqData.startDate}?${queryString(reqData.query)}`).reply(200, returnData)
  // getClient
  .onGet(`Clients/${reqData.id}`).reply(200, returnData)
  // getClients
  .onGet(`Clients?${queryString(reqData.query)}`).reply(200, returnData)
  // getClientFormulas
  .onGet(`Clients?${queryString}`).reply(200, returnData)
  // getFormulas
  .onGet(`Clients/${reqData.id}/Formulas`).reply(200, returnData)
  // getFormulasAndNotes
  .onGet(`Clients/${reqData.id}/FormulasAndNotes`).reply(200, returnData)
  // getMergeableClients
  .onGet(`Clients/${reqData.id}/MergeableClients`).reply(200, returnData)
  // putClientEmail
  .onPut(`Clients/${reqData.clientId}/Email`).reply(200, returnData)
  // postMergeClients
  .onPost(`Clients/${reqData.id}/Merge`).reply(200, returnData)
  // putContactInformation
  .onPut(`Clients/${reqData.id}/ContactInformation`).reply(200, returnData)
  // deleteClient
  .onDelete(`Clients/${reqData.clientId}`).reply(200, returnData)
  // postClient
  .onPut('Clients').reply(200, returnData)
  // putClient
  .onPut(`Clients/${reqData.id}`).reply(200, returnData)


describe('Client', () => {
  test('getZipCode should return correct property', async () => {
    const res = await getZipCode(reqData.zipCode);
    expect(res).toEqual(returnData.response);
  });

  test('getClientAppointments should return correct property', async () => {
    const res = await getClientAppointments(reqData);
    const res2 = await getClientAppointments(reqData);
    expect(res2).toEqual(res);
    expect(res).toEqual(returnData);
    expect(res2).toEqual(returnData);
  });

  test('getClient should return correct property', async () => {
    const res = await getClient(reqData.id);
    expect(res).toEqual(returnData.response);
  });

  test('getClients should return correct property', async () => {
    const res = await getClients(reqData.query);
    const res2 = await getClients(reqData.query);
    expect(res2).toEqual(res);
    expect(res).toEqual(returnData);
    expect(res2).toEqual(returnData);
  });

  test('getClientFormulas should return correct property', async () => {
    const res = await getClientFormulas(reqData.id);
    expect(res).toEqual(returnData.response);
  });

  test('getFormulas should return correct property', async () => {
    const res = await getFormulas(reqData.id);
    expect(res).toEqual(returnData.response);
  });

  test('getFormulasAndNotes should return correct property', async () => {
    const res = await getFormulasAndNotes(reqData.id);
    expect(res).toEqual(returnData.response);
  });

  test('getMergeableClients should return correct property', async () => {
    const res = await getMergeableClients(reqData.id);
    expect(res).toEqual(returnData.response);
  });

  test('putClientEmail should return correct property', async () => {
    const res = await putClientEmail(reqData.clientId, reqData.email);
    expect(res).toEqual(returnData.response);
  });

  test('putContactInformation should return correct property', async () => {
    const res = await putContactInformation(reqData.id, reqData.email);
    expect(res).toEqual(returnData.response);
  });

  test('deleteClient should return correct property', async () => {
    const res = await deleteClient(reqData);
    expect(res).toEqual(returnData.response);
  });

  test('postClient should return correct property', async () => {
    const res = await postClient(reqData.id);
    expect(res).toEqual(returnData.response);
  });

  test('putClient should return correct property', async () => {
    const res = await putClient(reqData.id, reqData);
    expect(res).toEqual(returnData.response);
  });

  test('postMergeClients should return correct property', async () => {
    const res = await postMergeClients(reqData.id, reqData);
    expect(res).toEqual(returnData.response);
  });
});
