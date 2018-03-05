import apiConstants from '../apiConstants';

const resources = {
  getClientNotes: {
    path: 'Client/:clientId/Note',
    method: 'get',
    expiration: apiConstants.expiration,
  },
  postClientNote: {
    path: 'Client/:clientId/Note',
    method: 'post',
    expiration: apiConstants.expiration,
  },
  deleteClientNote: {
    path: 'Client/:clientId/Note/:id',
    method: 'delete',
    expiration: apiConstants.expiration,
  },
  getClientNote: {
    path: 'Client/:clientId/Note/:id',
    method: 'get',
    expiration: apiConstants.expiration,
  },
  putClientNote: {
    path: 'Client/:clientId/Note/:id',
    method: 'put',
    expiration: apiConstants.expiration,
  },
  postUndeleteClientNote: {
    path: 'Client/:clientId/Note/:id/Undelete',
    method: 'post',
    expiration: apiConstants.expiration,
  },
};

export default {
  resources,
};
