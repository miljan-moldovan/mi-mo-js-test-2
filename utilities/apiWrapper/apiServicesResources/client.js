import apiConstants from '../apiConstants';

const resources = {
  getClients: {
    path: 'Clients',
    method: 'get',
    expiration: apiConstants.expiration,
  },
  clientFormulas: {
    path: 'Clients/:id/Formulas',
    method: 'get',
    expiration: apiConstants.expiration,
  },
  getMergeableClients: {
    path: 'Clients/:id/MergeableClients',
    method: 'get',
    expiration: apiConstants.expiration,
  },
  postMergeClients: {
    path: 'Clients/:id/Merge',
    method: 'post',
    disableCache: true,
  },
  clientFormulasAndNotes: {
    path: 'Clients/:id/FormulasAndNotes',
    method: 'get',
    expiration: apiConstants.expiration,
  },
};

export default {
  resources,
};
