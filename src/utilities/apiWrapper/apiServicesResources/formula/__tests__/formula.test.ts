import deleteClientFormula from '../deleteClientFormula';
import getClientFormula from '../getClientFormula';
import getClientFormulas from '../getClientFormulas';
import postClientFormula from '../postClientFormula';
import postUndeleteClientFormula from '../postUndeleteClientFormula';
import putClientFormula from '../putClientFormula';

import axios from 'axios';

const MockAdapter = require('axios-mock-adapter');
const mock = new MockAdapter(axios);
const returnData = {
  response: {
    test: 'test',
  },
};

const id = 101;
const reqData = {
  clientId: id,
  formulaId: id,
  id,
};

mock.onDelete(`Clients/${id}/Formulas/${id}`).reply(200, returnData);
mock.onPut(`Clients/${id}/Formulas/${id}`).reply(200, returnData);
mock.onPost(`Clients/${id}/Formulas/${id}/Undelete`).reply(200, returnData);
mock.onPost(`Clients/${id}/Formulas`).reply(200, returnData);
mock.onGet(`Clients/${id}/Formulas`).reply(200, returnData);
mock.onGet(`Clients/${id}/Formulas/${id}`).reply(200, returnData);

describe('Formula', () => {
  test('deleteClientFormula should return correct property', async () => {
    const res = await deleteClientFormula(reqData);
    expect(res).toEqual(returnData.response);
  });
  test('putClientFormula should return correct property', async () => {
    const res = await putClientFormula(reqData, 'test');
    expect(res).toEqual(returnData.response);
  });
  test('postUndeleteClientFormula should return correct property', async () => {
    const res = await postUndeleteClientFormula(reqData);
    expect(res).toEqual(returnData.response);
  });
  test('postClientFormula should return correct property', async () => {
    const res = await postClientFormula(id, 'test');
    expect(res).toEqual(returnData.response);
  });
  test('getClientFormulas should return correct property', async () => {
    const res = await getClientFormulas(id);
    expect(res).toEqual(returnData.response);
  });
  test('getClientFormula should return correct property', async () => {
    const res = await getClientFormula(reqData);
    expect(res).toEqual(returnData.response);
  });
});
