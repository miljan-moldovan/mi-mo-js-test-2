import { Queue } from '../../utilities/apiWrapper';
import { Client, Maybe, Service, PureProvider, Promotion } from '@/models';

export const SET_ESTIMATED_TIME = 'walkIn/SET_ESTIMATED_TIME';
export const SET_CURRENT_STEP = 'walkIn/SET_CURRENT_STEP';
export const SELECTED_CLIENT = 'walkIn/SELECTED_CLIENT';
export const SELECTED_SERVICE = 'walkIn/SELECTED_SERVICE';
export const SELECTED_PROVIDER = 'walkIn/SELECTED_PROVIDER';
export const SELECTED_PROMOTION = 'walkIn/SELECTED_PROMOTION';
export const POST_WALKIN_CLIENT = 'walkIn/POST_WALKIN_CLIENT';
export const POST_WALKIN_CLIENT_SUCCESS = 'walkIn/POST_WALKIN_CLIENT_SUCCESS';
export const POST_WALKIN_CLIENT_FAILED = 'walkIn/POST_WALKIN_CLIENT_FAILED';

function setEstimatedTime(time: any): any {
  return {
    type: SET_ESTIMATED_TIME,
    data: { time },
  };
}

function setCurrentStep(step: any): any {
  return {
    type: SET_CURRENT_STEP,
    data: { step },
  };
}

function selectedClient(client: Maybe<Client>): any {
  return {
    type: SELECTED_CLIENT,
    data: { client },
  };
}
function selectService(service: Maybe<Service>): any {
  return {
    type: SELECTED_SERVICE,
    data: { service },
  };
}

function selectProvider(provider: Maybe<PureProvider>): any {
  return {
    type: SELECTED_PROVIDER,
    data: { provider },
  };
}

function selectPromotion(promotion: Maybe<Promotion>): any {
  return {
    type: SELECTED_PROMOTION,
    data: { promotion },
  };
}

const postWalkinClientsSuccess = (appointment: any): any => ({
  type: POST_WALKIN_CLIENT_SUCCESS,
  data: { appointment },
});

const postWalkinClientFailed = (error: any): any => ({
  type: POST_WALKIN_CLIENT_FAILED,
  data: { error },
});

const postWalkinClient = (params: any): any => dispatch => {
  dispatch({ type: POST_WALKIN_CLIENT });
  return Queue.postQueueWalkinClient(params)
    .then(response => {
      // dispatch(purgeForm('WalkoutScreen', clientQueueItemId.toString()));
      return dispatch(postWalkinClientsSuccess(response));
    })
    .catch(error => {
      // if (error.responseCode === 99) {
      //   dispatch(storeForm('WalkoutScreen', clientQueueItemId.toString(), params));
      // }
      return dispatch(postWalkinClientFailed(error));
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

export interface WalkInActions {
  setEstimatedTime: typeof setEstimatedTime;
  setCurrentStep: typeof setCurrentStep;
  selectedClient: typeof selectedClient;
  selectService: typeof selectService;
  selectProvider: typeof selectProvider;
  selectPromotion: typeof selectPromotion;
  postWalkinClient: typeof postWalkinClient;
}

export default walkInActions;
