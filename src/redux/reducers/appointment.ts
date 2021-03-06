import {
  ADD_APPOINTMENT,
  POST_APPOINTMENT_MOVE,
  POST_APPOINTMENT_MOVE_SUCCESS,
  POST_APPOINTMENT_MOVE_FAILED,
  POST_APPOINTMENT_CANCEL,
  POST_APPOINTMENT_CANCEL_SUCCESS,
  POST_APPOINTMENT_CANCEL_FAILED,
  POST_APPOINTMENT_CHECKIN,
  POST_APPOINTMENT_CHECKIN_SUCCESS,
  POST_APPOINTMENT_CHECKIN_FAILED,
  POST_APPOINTMENT_CHECKOUT,
  POST_APPOINTMENT_CHECKOUT_SUCCESS,
  POST_APPOINTMENT_CHECKOUT_FAILED,
} from '../actions/appointment';
import { Maybe, PureAppointment } from '@/models';

const initialState: AppointmentReducer = {
  isMoving: false,
  isLoading: false,
  isCheckingIn: false,
  isCheckingOut: false,
  error: null,
  appointments: [],
  isCancelling: false,
};

export interface AppointmentReducer {
  isMoving: boolean;
  isLoading: boolean;
  isCheckingIn: boolean;
  isCheckingOut: boolean;
  error: Maybe<any>;
  isCancelling: boolean;
  appointments: PureAppointment[];
}

export default function appoinmentReducer(state: AppointmentReducer = initialState, action): AppointmentReducer {
  const { type, data } = action;
  switch (type) {
    case POST_APPOINTMENT_MOVE:
      return {
        ...state,
        isMoving: true,
      };
    case POST_APPOINTMENT_MOVE_SUCCESS:
      return {
        ...state,
        isMoving: false,
      };
    case POST_APPOINTMENT_MOVE_FAILED:
      return {
        ...state,
        isMoving: false,
      };
    case POST_APPOINTMENT_CANCEL:
      return {
        ...state,
        isCancelling: true,
      };
    case POST_APPOINTMENT_CANCEL_SUCCESS:
      return {
        ...state,
        isCancelling: false,
      };
    case POST_APPOINTMENT_CANCEL_FAILED:
      return {
        ...state,
        isCancelling: false,
      };
    case POST_APPOINTMENT_CHECKIN:
      return {
        ...state,
        isCheckingIn: true,
      };
    case POST_APPOINTMENT_CHECKIN_SUCCESS:
      return {
        ...state,
        isCheckingIn: false,
      };
    case POST_APPOINTMENT_CHECKIN_FAILED:
      return {
        ...state,
        isCheckingIn: false,
        error: data.error,
      };
    case POST_APPOINTMENT_CHECKOUT:
      return {
        ...state,
        isCheckingOut: true,
      };
    case POST_APPOINTMENT_CHECKOUT_FAILED:
      return {
        ...state,
        isCheckingOut: false,
        error: data.error,
      };
    case POST_APPOINTMENT_CHECKOUT_SUCCESS:
      return {
        ...state,
        isCheckingOut: false,
      };
    default:
      return state;
  }
}
