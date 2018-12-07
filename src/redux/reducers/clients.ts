import { concat } from 'lodash';
import {
  SET_CLIENTS,
  SET_FILTERED_CLIENTS,
  SET_SUGGESTIONS_LIST,
  SET_FILTERED_SUGGESTIONS_LIST,
  GET_CLIENTS,
  GET_CLIENTS_SUCCESS,
  GET_CLIENTS_FAILED,
  GET_MERGEABLE_CLIENTS,
  GET_MERGEABLE_CLIENTS_SUCCESS,
  GET_MERGEABLE_CLIENTS_FAILED,
  MERGE_CLIENTS,
  MERGE_CLIENTS_SUCCESS,
  MERGE_CLIENTS_FAILED,
  GET_MORE_CLIENTS_SUCCESS,
  GET_MORE_CLIENTS,
  GET_CLIENTS_MORE_FAILED,
} from '../actions/clients';
import { Client, Maybe } from '@/models';

const initialState: ClientsReducer = {
  filtered: [],
  clients: [],
  mergeableClients: [],
  suggestionsList: [],
  filteredSuggestions: [],
  isLoading: false,
  total: 0,
  isLoadingMore: false,
  error: null,
  waitingMerge: false,
};

export interface ClientsReducer {
  filtered: Client[];
  clients: Client[];
  mergeableClients: any[];
  suggestionsList: any[];
  filteredSuggestions: any[];
  isLoading: boolean;
  total: number;
  isLoadingMore: boolean;
  error: Maybe<any>;
  waitingMerge: boolean;
}

export default function clientsReducer(state: ClientsReducer = initialState, action): ClientsReducer {
  const { type, data } = action;
  switch (type) {
    case GET_CLIENTS:
      return {
        ...state,
        isLoading: true,
      };
    case GET_MORE_CLIENTS:
      return {
        ...state,
        isLoadingMore: true,
      };
    case GET_CLIENTS_SUCCESS:
      return {
        ...state,
        total: data.total,
        isLoading: false,
        clients: data.clients,
        error: null,
      };
    case GET_MORE_CLIENTS_SUCCESS:
      return {
        ...state,
        clients: concat(state.clients, data.clients),
        total: data.total,
        isLoadingMore: false,
        error: null,
      };
    case GET_CLIENTS_FAILED:
      return {
        ...state,
        isLoading: false,
        isLoadingMore: false,
        error: data.error,
        clients: [],
      };
    case GET_CLIENTS_MORE_FAILED:
      return {
        ...state,
        isLoading: false,
        isLoadingMore: false,
        error: data.error,
      };
    case SET_CLIENTS:
      return {
        ...state,
        error: null,
        clients: data.clients,
      };
    case SET_FILTERED_CLIENTS:
      return {
        ...state,
        error: null,
        filtered: data.filtered,
      };
    case SET_SUGGESTIONS_LIST:
      return {
        ...state,
        error: null,
        suggestionsList: data.suggestionsList,
      };
    case SET_FILTERED_SUGGESTIONS_LIST:
      return {
        ...state,
        error: null,
        filteredSuggestions: data.filteredSuggestions,
      };
    case GET_MERGEABLE_CLIENTS:
      return {
        ...state,
        isLoading: true,
      };
    case GET_MERGEABLE_CLIENTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        mergeableClients: data.response,
        error: null,
      };
    case GET_MERGEABLE_CLIENTS_FAILED:
      return {
        ...state,
        isLoading: false,
        error: data.error,
        mergeableClients: [],
      };
    case MERGE_CLIENTS:
      return {
        ...state,
        waitingMerge: true,
        isLoading: true,
      };
    case MERGE_CLIENTS_SUCCESS:
      return {
        ...state,
        waitingMerge: false,
        error: null,
        isLoading: false,
      };
    case MERGE_CLIENTS_FAILED:
      return {
        ...state,
        waitingMerge: false,
        isLoading: false,
        error: data.error,
      };
    default:
      return state;
  }
}
