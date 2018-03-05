import apiConstants from '../apiConstants';

const resources = {
  getClientNotes: {
    path: 'Client/:clientId/Note',
    method: 'get',
    disableCache: true,
  },
  postClientNote: {
    path: 'Client/:clientId/Note',
    method: 'post',
    disableCache: true,
  },
  deleteClientNote: {
    path: 'Client/:clientId/Note/:id',
    method: 'delete',
    disableCache: true,
  },
  getClientNote: {
    path: 'Client/:clientId/Note/:id',
    method: 'get',
    expiration: apiConstants.expiration,
  },
  putClientNote: {
    path: 'Client/:clientId/Note/:id',
    method: 'put',
    disableCache: true,
  },
  postUndeleteClientNote: {
    path: 'Client/:clientId/Note/:id/Undelete',
    method: 'post',
    disableCache: true,
  },
};

export default {
  resources,
};
