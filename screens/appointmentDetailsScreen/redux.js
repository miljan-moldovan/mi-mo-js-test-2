import { Services} from '../../utilities/apiWrapper';

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

const initialState = {
  appointment: null,
  services: [],
  products: [],
  isLoading: false,
  error: null,
};

export function appointmentDetailsReducer(state = initialState, action) {
  const { type, data } = action;
  switch (type) {
    case SET_APPOINTMENT:
      return {
        ...state,
        error: null,
        isLoading: false,
        appointment: data.appointment,
        services: data.appointment.services.map(item => ({ ...item, name: item.serviceName, id: item.serviceId })),
        products: [],
      };
    case ADD_PRODUCT: {
      const { products, appointment } = state;

      if ('index' in data && data.index !== null) {
        products[data.index] = { ...products[data.index], ...data.product };
      } else {
        products.push(data.product);
      }

      appointment.totalPrice = appointment.totalPrice + parseFloat(data.product.product.price.replace('$', ''));
      return {
        ...state,
        appointment,
        products,
        isLoading: false,
        error: null,
      };
    }
    case REMOVE_PRODUCT: {
      const { products, appointment } = state;
      appointment.totalPrice -= parseFloat(products[data.index].product.price.replace('$', ''));
      products.splice(data.index, 1);
      return {
        ...state,
        products,
        appointment,
        isLoading: false,
        error: null,
      };
    }
    case ADD_SERVICE: {
      const { services, appointment } = state;

      if ('index' in data && data.index !== null) {
        services[data.index] = { ...services[data.index], ...data.service };
      } else {
        services.push(data.service);
      }

      appointment.totalPrice += data.service.price;
      return {
        ...state,
        appointment,
        services,
        isLoading: false,
        error: null,
      };
    }
    case REMOVE_SERVICE: {
      const { services, appointment } = state;
      appointment.totalPrice -= services[data.index].price;
      services.splice(data.index, 1);
      return {
        ...state,
        services,
        appointment,
        isLoading: false,
        error: null,
      };
    }
    case FETCH_SERVICE: {
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    }
    case FETCH_SERVICE_SUCCESS: {
      const { services } = state;
      services[data.index] = data.service;
      return {
        ...state,
        services,
        isLoading: false,
        error: null,
      };
    }
    case FETCH_SERVICE_ERROR: {
      return {
        ...state,
        isLoading: false,
        error: data.error,
      };
    }
    default:
      return state;
  }
}

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

const appointmentDetailsActions = {
  setAppointment,
  addService,
  fetchService,
  fetchServiceSuccess,
  fetchServiceError,
  removeService,
  addProduct,
  removeProduct,
};

export default appointmentDetailsActions;
