import {
  GET_SERVICE_CHECK,
  GET_SERVICE_CHECK_FAILED,
  GET_SERVICE_CHECK_SUCCESS,
  GET_APPOINTMENT,
  GET_APPOINTMENT_FAILED,
  GET_APPOINTMENT_SUCCESS,
  UPDATE_APPOINTMENT,
  UPDATE_APPOINTMENT_FAILED,
  UPDATE_APPOINTMENT_SUCCESS,
} from '../actions/queueDetail';
import { QueueItem, ServiceCheck } from '@/models';

const initialState: QueueDetailReducer = {
  isLoading: false,
  appointment: null,
  serviceChecks: [],
};

export interface QueueDetailReducer {
  isLoading: boolean;
  appointment: QueueItem;
  serviceChecks: ServiceCheck[];
}

function queueDetailReducer(state: QueueDetailReducer = initialState, action): QueueDetailReducer {
  const { type, data } = action;
  switch (type) {
    case GET_SERVICE_CHECK:
      return {
        ...state,
        isLoading: true,
      };
    case GET_SERVICE_CHECK_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        serviceChecks: [...state.serviceChecks, data.result],
      };
    }
    case GET_SERVICE_CHECK_FAILED: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case GET_APPOINTMENT:
      return {
        ...state,
        isLoading: true,
      };
    case GET_APPOINTMENT_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        appointment: data.appointment,
      };
    }
    case GET_APPOINTMENT_FAILED: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case UPDATE_APPOINTMENT: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case UPDATE_APPOINTMENT_FAILED: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case UPDATE_APPOINTMENT_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        appointment: data.appt,
      };
    }
    default:
      return state;
  }
}
export default queueDetailReducer;
