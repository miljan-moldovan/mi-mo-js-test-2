export const SET_ESTIMATED_TIME = 'walkIn/SET_ESTIMATED_TIME';
export const SET_CURRENT_STEP = 'walkIn/SET_CURRENT_STEP';
export const SELECTED_CLIENT = 'walkIn/SELECTED_CLIENT';
export const SELECTED_SERVICE = 'walkIn/SELECTED_SERVICE';
export const SELECTED_PROVIDER = 'walkIn/SELECTED_PROVIDER';
export const SELECTED_PROMOTION = 'walkIn/SELECTED_PROMOTION';

function setEstimatedTime(time) {
  return {
    type: SET_ESTIMATED_TIME,
    data: { time },
  };
}

function setCurrentStep(step) {
  return {
    type: SET_CURRENT_STEP,
    data: { step },
  };
}

function selectedClient(client) {
  return {
    type: SELECTED_CLIENT,
    data: { client },
  };
}
function selectService(service) {
  return {
    type: SELECTED_SERVICE,
    data: { service },
  };
}

function selectProvider(provider) {
  return {
    type: SELECTED_PROVIDER,
    data: { provider },
  };
}

function selectPromotion(promotion) {
  return {
    type: SELECTED_PROMOTION,
    data: { promotion },
  };
}

const walkInActions = {
  setEstimatedTime,
  setCurrentStep,
  selectedClient,
  selectService,
  selectProvider,
  selectPromotion,
};

export default walkInActions;
