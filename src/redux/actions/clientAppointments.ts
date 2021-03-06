import { Client } from '../../utilities/apiWrapper';

export const GET_APPOINTMETNS = 'clientAppt/GET_APPOINTMETNS';
export const GET_MORE_APPOINTMETNS = 'clientAppt/GET_MORE_APPOINTMETNS';
export const GET_APPOINTMETNS_SUCCESS = 'clientAppt/GET_APPOINTMETNS_SUCCESS';
export const GET_MORE_APPOINTMETNS_SUCCESS =
  'clientAppt/GET_MORE_APPOINTMETNS_SUCCESS';
export const GET_APPOINTMETNS_FAILED = 'clientAppt/GET_APPOINTMETNS_FAILED';
export const CLEAR_APPOINTMETNS = 'clientAppt/CLEAR_APPOINTMETNS';

const getClientApptSuccess = ({ response, total }) => ({
  type: GET_APPOINTMETNS_SUCCESS,
  data: { appointments: response, total },
});

const getMoreClientApptSuccess = ({ response, total }) => ({
  type: GET_MORE_APPOINTMETNS_SUCCESS,
  data: { appointments: response, total },
});

const getClientApptFailed = error => ({
  type: GET_APPOINTMETNS_FAILED,
  data: { error },
});

const getClientAppt = ({ clientId, fromDate, query }) => dispatch => {
  dispatch({ type: GET_APPOINTMETNS });
  return Client.getClientAppointmetns({ clientId, fromDate, query })
    .then(response => dispatch(getClientApptSuccess(response)))
    .catch(error => dispatch(getClientApptFailed(error)));
};

const getMoreClientAppt = ({ clientId, fromDate, query }) => dispatch => {
  dispatch({ type: GET_MORE_APPOINTMETNS });
  return Client.getClientAppointmetns({ clientId, fromDate, query })
    .then(response => dispatch(getMoreClientApptSuccess(response)))
    .catch(error => dispatch(getClientApptFailed(error)));
};

const clearAppts = () => ({
  type: CLEAR_APPOINTMETNS,
});

const clientApptActions = {
  getClientAppt,
  getMoreClientAppt,
  clearAppts,
};

export interface ClientApptActions {
  getClientAppt: (data: { clientId: number, fromDate: any, query: any }) => any;
  getMoreClientAppt: (data: { clientId: number, fromDate: any, query: any }) => any;
  clearAppts: () => any;
}

export default clientApptActions;
