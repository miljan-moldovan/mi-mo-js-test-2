import { concat } from 'lodash';
import {
  GET_APPOINTMETNS,
  GET_MORE_APPOINTMETNS,
  GET_APPOINTMETNS_SUCCESS,
  GET_APPOINTMETNS_FAILED,
  GET_MORE_APPOINTMETNS_SUCCESS,
  CLEAR_APPOINTMETNS,
} from '../actions/clientAppointments';
import { PureAppointment, Maybe } from '@/models';

const initialState: ClientApptReducer = {
  appointments: [],
  isLoading: false,
  isLoadingMore: false,
  error: null,
  total: 0,
};

export interface ClientApptReducer {
  appointments: PureAppointment[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: Maybe<any>;
  total: number;
}

export default function clientApptReducer(state: ClientApptReducer = initialState, action): ClientApptReducer {
  const { type, data } = action;
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
        appointments: concat(state.appointments, data.appointments),
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
