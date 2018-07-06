import apiConstants from '../apiConstants';

const resources = {
  getClientNotes: {
    path: 'Clients/:clientId/Notes',
    method: 'get',
    expiration: apiConstants.expiration,
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
    // expiration: apiConstants.expiration,
    disableCache: true,
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
