import {concat} from 'lodash';

import {
  GET_APPOINTMETNS,
  GET_MORE_APPOINTMETNS,
  GET_APPOINTMETNS_SUCCESS,
  GET_APPOINTMETNS_FAILED,
  GET_MORE_APPOINTMETNS_SUCCESS,
  CLEAR_APPOINTMETNS,
} from '../actions/clientAppointments';

const initialState = {
  appointments: [],
  isLoading: false,
  isLoadingMore: false,
  error: null,
  total: 0,
};

export default function clientApptReducer (state = initialState, action) {
  const {type, data} = action;
  switch (type) {
    case GET_APPOINTMETNS:
      return {
        ...state,
        isLoading: true,
      };
    case GET_MORE_APPOINTMETNS:
      return {
        ...state,
        isLoadingMore: true,
      };
    case GET_APPOINTMETNS_SUCCESS:
      return {
        ...state,
        appointments: data.appointments,
        total: data.total,
        isLoading: false,
        error: null,
      };
    case GET_MORE_APPOINTMETNS_SUCCESS:
      return {
        ...state,
        appointments: concat (state.appointments, data.appointments),
        total: data.total,
        isLoadingMore: false,
        error: null,
      };
    case GET_APPOINTMETNS_FAILED:
      return {
        ...state,
        isLoading: false,
        isLoadingMore: false,
        error: data.error,
      };
    case CLEAR_APPOINTMETNS:
      return {
        ...state,
        appointments: [],
      };
    default:
      return state;
  }
}
