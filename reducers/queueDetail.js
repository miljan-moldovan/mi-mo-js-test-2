import {
  SET_APPOINTMENT,
  ADD_SERVICE,
  REMOVE_SERVICE,
  FETCH_SERVICE,
  FETCH_SERVICE_SUCCESS,
  FETCH_SERVICE_ERROR,
  ADD_PRODUCT,
  REMOVE_PRODUCT,
  SET_FILTERED_FORMULAS,
  SELECTED_FILTER_TYPES,
} from '../actions/queueDetail';

const initialState = {
  appointment: null,
  services: [],
  products: [],
  isLoading: false,
  error: null,
};

export function queueDetailReducer(state = initialState, action) {
  const { type, data } = action;
  switch (type) {
    case SET_APPOINTMENT:
      return {
        ...state,
        error: null,
        isLoading: false,
        appointment: data.appointment,
        services: data.appointment.services.map(item => (
          { ...item, name: item.serviceName, id: item.serviceId }
        )),
        products: [],
      };
    case ADD_PRODUCT: {
      const { products, appointment } = state;

      if ('index' in data && data.index !== null) {
        products[data.index] = { ...products[data.index], ...data.product };
      } else {
        products.push(data.product);
      }

      appointment.totalPrice += parseFloat(data.product.product.price.replace('$', ''));
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
export default queueDetailReducer;
