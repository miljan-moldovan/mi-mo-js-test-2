import moment from 'moment';
import { get, some, isFunction } from 'lodash';
import { Services, AppointmentBook, Employees, Queue } from '../../utilities/apiWrapper';
import { showErrorAlert } from './utils';
import { Maybe, PureProvider, Service, AppStore, EmployeeSchedule } from '@/models';
import { dateTimeConstants } from '@/constants';

const alphabeticFilter = (a, b) => {
  if (a.fullName < b.fullName) return -1;
  if (a.fullName > b.fullName) return 1;
  return 0;
};

export const GET_PROVIDERS = 'providers/GET_PROVIDERS';
export const GET_PROVIDERS_SUCCESS = 'providers/GET_PROVIDERS_SUCCESS';
export const GET_PROVIDERS_ERROR = 'providers/GET_PROVIDERS_ERROR';

export const GET_QUEUE_EMPLOYEES = 'providers/GET_QUEUE_EMPLOYEES';
export const GET_QUEUE_EMPLOYEES_SUCCESS =
  'providers/GET_QUEUE_EMPLOYEES_SUCCESS';
export const GET_QUEUE_EMPLOYEES_ERROR = 'providers/GET_PROVIDERS_ERROR';

export const GET_APPT_BOOK_PROVIDERS_FOR_DATE = 'providers/GET_APPT_BOOK_PROVIDERS_FOR_DATE';
export const GET_APPT_BOOK_PROVIDERS_FOR_DATE_SUCCESS =
  'providers/GET_APPT_BOOK_PROVIDERS_FOR_DATE_SUCCESS';
export const GET_APPT_BOOK_PROVIDERS_FOR_DATE_FAILED = 'providers/GET_APPT_BOOK_PROVIDERS_FOR_DATE_FAILED';

export const GET_QUICK_QUEUE_EMPLOYEES = 'providers/GET_QUICK_QUEUE_EMPLOYEES';
export const GET_QUICK_QUEUE_EMPLOYEES_SUCCESS =
  'providers/GET_QUICK_QUEUE_EMPLOYEES_SUCCESS';
export const GET_QUICK_QUEUE_EMPLOYEES_ERROR =
  'providers/GET_QUICK_QUEUE_EMPLOYEES_ERROR';

export const GET_RECEPTIONISTS = 'providers/GET_RECEPTIONISTS';
export const GET_RECEPTIONISTS_SUCCESS = 'providers/GET_RECEPTIONISTS_SUCCESS';
export const GET_RECEPTIONISTS_ERROR = 'providers/GET_PROVIDERS_ERROR';

export const GET_EMPLOYEES_BY_SERVICE = 'providers/GET_EMPLOYEES_BY_SERVICE';
export const GET_EMPLOYEES_BY_SERVICE_SUCCESS =
  'providers/GET_EMPLOYEES_BY_SERVICE_SUCCESS';
export const GET_EMPLOYEES_BY_SERVICE_ERROR = 'providers/GET_PROVIDERS_ERROR';

export const SET_FILTERED_PROVIDERS = 'providers/SET_FILTERED_PROVIDERS';
export const SELECTED_FILTER_TYPES = 'providers/SELECTED_FILTER_TYPES';
export const SET_SELECTED_PROVIDER = 'providers/SET_SELECTED_PROVIDER';
export const SET_SELECTED_SERVICE = 'providers/SET_SELECTED_SERVICE';

export const GET_PROVIDER_STATUS = 'providers/GET_PROVIDER_STATUS';
export const GET_PROVIDER_STATUS_SUCCESS =
  'providers/GET_PROVIDER_STATUS_SUCCESS';
export const GET_PROVIDER_STATUS_FAILED =
  'providers/GET_PROVIDER_STATUS_FAILED';

const setSelectedProvider = (selectedProvider: Maybe<PureProvider>): any => ({
  type: SET_SELECTED_PROVIDER,
  data: { selectedProvider },
});

const setSelectedService = (selectedService: Maybe<Service>): any => ({
  type: SET_SELECTED_SERVICE,
  data: { selectedService },
});

const getQuickQueueEmployees = (req: any): any => (dispatch, getState) => {
  dispatch({ type: GET_QUICK_QUEUE_EMPLOYEES });
  if (getState().providersReducer.selectedService) {
    const serviceId = get(
      getState().providersReducer.selectedService,
      'id',
      null
    );
    return Promise.all([
      Queue.getQueueServiceEmployees({
        id: req.queueItemId,
        idService: serviceId,
      }),
    ])
      .then(([employees]) => {
        dispatch({
          type: GET_QUICK_QUEUE_EMPLOYEES_SUCCESS,
          data: { employees },
        });
      })
      .catch(error => {
        dispatch({
          type: GET_QUICK_QUEUE_EMPLOYEES_ERROR,
          data: { error },
        });
        showErrorAlert(error);
      });
  }
  return Employees.getQueueEmployees(req)
    .then(({ employees = [] }) =>
      dispatch({
        type: GET_QUICK_QUEUE_EMPLOYEES_SUCCESS,
        data: { employees },
      })
    )
    .catch(error => {
      dispatch({
        type: GET_QUICK_QUEUE_EMPLOYEES_ERROR,
        data: { error },
      });
      showErrorAlert(error);
    });
};

const getQueueEmployees = (req: any): any => (dispatch, getState) => {
  dispatch({ type: GET_QUEUE_EMPLOYEES });
  if (getState().providersReducer.selectedService) {
    const serviceId = get(
      getState().providersReducer.selectedService,
      'id',
      null,
    );
    return Promise.all([
      Employees.getQueueEmployees(),
      Services.getEmployeesByService(serviceId, req),
    ])
      .then(([{ employees = [] }, employeesByService]) => {
        dispatch({
          type: GET_QUEUE_EMPLOYEES_SUCCESS,
          data: { employees, employeesByService },
        });
      })
      .catch(error => {
        dispatch({
          type: GET_QUEUE_EMPLOYEES_ERROR,
          data: { error },
        });
        showErrorAlert(error);
      });
  }
  return Employees.getQueueEmployees(req)
    .then(({ employees = [] }) =>
      dispatch({
        type: GET_QUEUE_EMPLOYEES_SUCCESS,
        data: { employees },
      })
    )
    .catch(error => {
      dispatch({
        type: GET_QUEUE_EMPLOYEES_ERROR,
        data: { error },
      });
      showErrorAlert(error);
    });
};

const getReceptionists = (req: any): any => dispatch => {
  dispatch({ type: GET_RECEPTIONISTS });
  return Employees.getReceptionists(req)
    .then(employees =>
      dispatch({
        type: GET_RECEPTIONISTS_SUCCESS,
        data: { employees },
      })
    )
    .catch(error => {
      showErrorAlert(error);
      dispatch({ type: GET_RECEPTIONISTS_ERROR });
    });
};

const getProvidersSuccess = (providers: any): any => {
  const deskStaff = providers.filter(item => item.isReceptionist);
  return {
    type: GET_PROVIDERS_SUCCESS,
    data: { providers, deskStaff },
  };
};

const getProvidersError = (error: Maybe<any>): any => {
  showErrorAlert(error);
  return {
    type: GET_PROVIDERS_ERROR,
    data: { error },
  };
};

const getProviders = (params: any, selectedService: Maybe<Service> = null): any => dispatch => {
  dispatch({ type: GET_PROVIDERS });
  const serviceId = get(selectedService, 'id', false);
  if (serviceId) {
    return Services.getEmployeesByService(serviceId, params)
      .then(employees => {
        dispatch(getProvidersSuccess(employees));
      })
      .catch(err => {
        dispatch(getProvidersError(err));
      });
  }
  return Employees.getEmployees(params)
    .then(providers => {
      dispatch(getProvidersSuccess(providers));
    })
    .catch(err => {
      dispatch(getProvidersError(err));
    });
};

const setFilteredProviders = (filtered: Maybe<PureProvider[]>): any => {
  const filteredDeskStaff = filtered.filter(item => item.isReceptionist);
  return {
    type: SET_FILTERED_PROVIDERS,
    data: { filtered, filteredDeskStaff },
  };
};

const getProviderStatusSuccess = (response: any): any => ({
  type: GET_PROVIDER_STATUS_SUCCESS,
  data: { response },
});

const getProviderStatusFailed = (error: Maybe<any>): any => ({
  type: GET_PROVIDER_STATUS_FAILED,
  data: { error },
});

const getProviderStatus = (employeeId: number, callback: Maybe<Function>): any => dispatch => {
  dispatch({ type: GET_PROVIDER_STATUS });

  return Employees.getEmployeeStatus(employeeId)
    .then(response => {
      dispatch(getProviderStatusSuccess(response));
      callback(response);
    })
    .catch(error => {
      dispatch(getProviderStatusFailed(error));
      callback(false);
    });
};

const getApptBookProvidersForDate = (date: moment.Moment, service?: Maybe<Service>): any =>
  (dispatch: Function, getState: () => AppStore) => {
    const state = getState();
    const filterOptions = state.appointmentBookReducer.filterOptions;
    const providers = state.providersReducer.apptBookDates.find(itm => itm.date.isSame(date));
    if (!providers) {
      dispatch({ type: GET_APPT_BOOK_PROVIDERS_FOR_DATE });
      Promise.all([
        AppointmentBook.getAppointmentBookEmployees(date.format(dateTimeConstants.date), filterOptions),
        service ? Services.getEmployeesByService(get(service, 'id', 0), {}) : null,
      ])
        .then(([providers, byService]) => {

          dispatch({
            type: GET_APPT_BOOK_PROVIDERS_FOR_DATE_SUCCESS, data: {
              date,
              providers: service
                ? providers.filter(itm => some(byService, { id: get(itm, 'id') }))
                : providers,
            },
          });
        })
        .catch(error => {
          showErrorAlert(error);
          dispatch({ type: GET_APPT_BOOK_PROVIDERS_FOR_DATE_FAILED });
        });
    }
  };

const providersActions = {
  getProviders,
  getProvidersSuccess,
  getProvidersError,
  setFilteredProviders,
  setSelectedProvider,
  getProviderStatus,
  setSelectedService,
  getQueueEmployees,
  getReceptionists,
  getQuickQueueEmployees,
  getApptBookProvidersForDate,
};

export interface ProvidersActions {
  getProviders: typeof getProviders;
  getProvidersSuccess: typeof getProvidersSuccess;
  getProvidersError: typeof getProvidersError;
  setFilteredProviders: typeof setFilteredProviders;
  setSelectedProvider: typeof setSelectedProvider;
  getProviderStatus: typeof getProviderStatus;
  setSelectedService: typeof setSelectedService;
  getQueueEmployees: typeof getQueueEmployees;
  getReceptionists: typeof getReceptionists;
  getQuickQueueEmployees: typeof getQuickQueueEmployees;
  getApptBookProvidersForDate: (date: moment.Moment, service?: Service) => any;
}
export default providersActions;
