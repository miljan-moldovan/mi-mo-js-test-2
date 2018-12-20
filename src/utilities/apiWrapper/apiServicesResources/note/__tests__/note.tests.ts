import deleteClientNote from '../deleteClientNote';
import getClientNote from '../getClientNote';
import getClientNotes from '../getClientNotes';
import postClientNote from '../postClientNote';
import postUndeleteClientNote from '../postUndeleteClientNote';
import putClientNote from '../putClientNote';

import axios from 'axios';

const MockAdapter = require('axios-mock-adapter');
const mock = new MockAdapter(axios);
const returnData = {
  response: {
    test: 'test',
  },
};

mock.onDelete('Clients/101/Notes/101').reply(200, returnData);
mock.onGet('Clients/101/Notes/101').reply(200, returnData);
mock.onGet('Clients/101/Notes').reply(200, returnData);
mock.onPost('Clients/101/Notes').reply(200, returnData);
mock.onPost('Clients/101/Notes/101/Undelete').reply(200, returnData);
mock.onPut('Clients/101/Notes/101').reply(200, returnData);

describe('note', () => {
  test('deleteClientNote should return correct property', async () => {
    const res = await deleteClientNote({ clientId: 101, noteId: 101 });
    expect(res).toEqual(returnData.response);
  });
  test('getClientNote should return correct property', async () => {
    const res = await getClientNote({ clientId: 101, noteId: 101 });
    expect(res).toEqual(returnData.response);
  });
  test('getClientNotes should return correct property', async () => {
    const res = await getClientNotes(101);
    expect(res).toEqual(returnData.response);
  });
  test('postClientNote should return correct property', async () => {
    const res = await postClientNote(101, 'test me');
    expect(res).toEqual(returnData.response);
  });
  test('postUndeleteClientNote should return correct property', async () => {
    const res = await postUndeleteClientNote({ clientId: 101, id: 101 });
    expect(res).toEqual(returnData.response);
  });
  test('putClientNote should return correct property', async () => {
    const res = await putClientNote({ clientId: 101, id: 101 }, 'test me');
    expect(res).toEqual(returnData.response);
  });
});
