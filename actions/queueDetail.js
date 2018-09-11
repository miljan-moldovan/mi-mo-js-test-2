import { Services } from '../utilities/apiWrapper';

export const SET_APPOINTMENT = 'appointmentDetails/SET_APPOINTMENT';
export const ADD_SERVICE = 'appointmentDetails/ADD_SERVICE';
export const REMOVE_SERVICE = 'appointmentDetails/REMOVE_SERVICE';
export const FETCH_SERVICE = 'appointmentDetails/FETCH_SERVICE';
export const FETCH_SERVICE_SUCCESS = 'appointmentDetails/FETCH_SERVICE_SUCCESS';
export const FETCH_SERVICE_ERROR = 'appointmentDetails/FETCH_SERVICE_ERROR';
export const ADD_PRODUCT = 'appointmentDetails/ADD_PRODUCT';
export const REMOVE_PRODUCT = 'appointmentDetails/REMOVE_PRODUCT';
export const SET_FILTERED_FORMULAS = 'appointmentDetails/SET_FILTERED_FORMULAS';
export const SELECTED_FILTER_TYPES = 'appointmentDetails/SELECTED_FILTER_TYPES';

const setAppointment = appointment => ({
  type: SET_APPOINTMENT,
  data: { appointment },
});

const fetchServiceSuccess = ({ service, index }) => ({
  type: FETCH_SERVICE_SUCCESS,
  data: { service, index },
});

const fetchServiceError = error => ({
  type: FETCH_SERVICE_ERROR,
  data: { error },
});

const fetchService = (id, index) => (dispatch) => {
  dispatch({ type: FETCH_SERVICE });

  return Services.getService(id)
    .then((service) => {
      dispatch(fetchServiceSuccess(service, index));
    })
    .catch((err) => {
      dispatch(fetchServiceError(err));
    });
};

const addService = ({ service, index }) => (dispatch) => {
  dispatch({
    type: ADD_SERVICE,
    data: { service, index },
  });

  dispatch(fetchService(service.id, index));
};

const removeService = index => ({
  type: REMOVE_SERVICE,
  data: { index },
});

const addProduct = (product, index) => ({
  type: ADD_PRODUCT,
  data: { product, index },
});

const removeProduct = index => ({
  type: REMOVE_PRODUCT,
  data: { index },
});

const queueDetailActions = {
  setAppointment,
  addService,
  fetchService,
  fetchServiceSuccess,
  fetchServiceError,
  removeService,
  addProduct,
  removeProduct,
};

export default queueDetailActions;
