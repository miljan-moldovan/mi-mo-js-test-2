import apiConstants from '../apiConstants';

const resources = {
  getClients: {
    path: 'Clients',
    method: 'get',
    // expiration: apiConstants.expiration,
    disableCache: true,
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
  getFormulasAndNotes: {
    path: 'Clients/:id/FormulasAndNotes',
    method: 'get',
    expiration: apiConstants.expiration,
  },
  setContactInformation: {
    path: 'Clients/:id/ContactInformation',
    method: 'put',
    disableCache: true,
  },
};

export default {
  resources,
};
