import {Queue} from '../../utilities/apiWrapper';

export const SET_ESTIMATED_TIME = 'walkIn/SET_ESTIMATED_TIME';
export const SET_CURRENT_STEP = 'walkIn/SET_CURRENT_STEP';
export const SELECTED_CLIENT = 'walkIn/SELECTED_CLIENT';
export const SELECTED_SERVICE = 'walkIn/SELECTED_SERVICE';
export const SELECTED_PROVIDER = 'walkIn/SELECTED_PROVIDER';
export const SELECTED_PROMOTION = 'walkIn/SELECTED_PROMOTION';
export const POST_WALKIN_CLIENT = 'walkIn/POST_WALKIN_CLIENT';
export const POST_WALKIN_CLIENT_SUCCESS = 'walkIn/POST_WALKIN_CLIENT_SUCCESS';
export const POST_WALKIN_CLIENT_FAILED = 'walkIn/POST_WALKIN_CLIENT_FAILED';

function setEstimatedTime (time) {
  return {
    type: SET_ESTIMATED_TIME,
    data: {time},
  };
}

function setCurrentStep (step) {
  return {
    type: SET_CURRENT_STEP,
    data: {step},
  };
}

function selectedClient (client) {
  return {
    type: SELECTED_CLIENT,
    data: {client},
  };
}
function selectService (service) {
  return {
    type: SELECTED_SERVICE,
    data: {service},
  };
}

function selectProvider (provider) {
  return {
    type: SELECTED_PROVIDER,
    data: {provider},
  };
}

function selectPromotion (promotion) {
  return {
    type: SELECTED_PROMOTION,
    data: {promotion},
  };
}

const postWalkinClientsSuccess = appointment => ({
  type: POST_WALKIN_CLIENT_SUCCESS,
  data: {appointment},
});

const postWalkinClientFailed = error => ({
  type: POST_WALKIN_CLIENT_FAILED,
  data: {error},
});

const postWalkinClient = params => dispatch => {
  dispatch ({type: POST_WALKIN_CLIENT});
  return Queue.postQueueWalkinClient (params)
    .then (response => {
      // dispatch(purgeForm('WalkoutScreen', clientQueueItemId.toString()));
      return dispatch (postWalkinClientsSuccess (response));
    })
    .catch (error => {
      // if (error.responseCode === 99) {
      //   dispatch(storeForm('WalkoutScreen', clientQueueItemId.toString(), params));
      // }
      return dispatch (postWalkinClientFailed (error));
    });
};

const walkInActions = {
  setEstimatedTime,
  setCurrentStep,
  selectedClient,
  selectService,
  selectProvider,
  selectPromotion,
  postWalkinClient,
};

export default walkInActions;
