export const SET_REFERRED_BY = 'clientInfo/SET_REFERRED_BY';

function setReferredBy(selectedReferredBy) {
  return {
    type: SET_REFERRED_BY,
    data: { selectedReferredBy },
  };
}

const clientInfoActions = {
  setReferredBy,
};

export default clientInfoActions;
