import { Maybe } from '@/models';

export const SET_FILTER_TYPES = 'salonSearchHeader/FILTER_TYPES';
export const SET_SELECTED_FILTER = 'salonSearchHeader/SET_SELECTED_FILTER';
export const SET_SHOW_FILTER = 'salonSearchHeader/SET_SHOW_FILTER';
export const SET_TITLE = 'salonSearchHeader/SET_TITLE';
export const SET_SUBTITLE_TITLE = 'salonSearchHeader/SET_SUBTITLE_TITLE';
export const SET_SEARCH_TEXT = 'salonSearchHeader/SET_SEARCH_TEXT';
export const SET_FILTER_ACTION = 'salonSearchHeader/SET_FILTER_ACTION';
export const SET_IGNORED_NUMBER_OF_LETTERS =
  'salonSearchHeader/SET_IGNORED_NUMBER_OF_LETTERS';

export interface SalonSearchHeaderReducer {
  filterTypes: Maybe<string[]>;
  selectedFilter: number;
  showFilter: boolean;
  title: string;
  subTitle: Maybe<string>;
  searchText: string;
  filterList: () => any;
  ignoredNumberOfLetters: Maybe<number>;
}

const initialState: SalonSearchHeaderReducer = {
  filterTypes: ['This store', 'All stores'],
  selectedFilter: 0,
  showFilter: false,
  title: 'Clients',
  subTitle: null,
  searchText: '',
  filterList: () => { },
  ignoredNumberOfLetters: 2,
};

export function salonSearchHeaderReducer(state: SalonSearchHeaderReducer = initialState, action) {
  const { type, data } = action;
  switch (type) {
    case SET_FILTER_ACTION:
      return {
        ...state,
        error: null,
        filterList: data.filterList,
      };
    case SET_FILTER_TYPES:
      return {
        ...state,
        error: null,
        filterTypes: data.filterTypes,
      };
    case SET_SELECTED_FILTER:
      return {
        ...state,
        error: null,
        selectedFilter: data.selectedFilter,
      };
    case SET_SHOW_FILTER:
      return {
        ...state,
        error: null,
        showFilter: data.showFilter,
      };
    case SET_TITLE:
      return {
        ...state,
        error: null,
        title: data.title,
      };
    case SET_SUBTITLE_TITLE:
      return {
        ...state,
        error: null,
        subTitle: data.subTitle,
      };
    case SET_SEARCH_TEXT:
      return {
        ...state,
        error: null,
        searchText: data.searchText,
        showFilter: data.searchText.length > 0 ? state.showFilter : false,
      };
    case SET_IGNORED_NUMBER_OF_LETTERS:
      return { ...state, ignoredNumberOfLetters: data };
    default:
      return state;
  }
}

function setSelectedFilter(selectedFilter) {
  return {
    type: SET_SELECTED_FILTER,
    data: { selectedFilter },
  };
}

function setFilterTypes(filterTypes) {
  return {
    type: SET_FILTER_TYPES,
    data: { filterTypes },
  };
}

function setShowFilter(showFilter) {
  return {
    type: SET_SHOW_FILTER,
    data: { showFilter },
  };
}

function setTitle(title) {
  return {
    type: SET_TITLE,
    data: { title },
  };
}

function setSubTitle(subTitle) {
  return {
    type: SET_SUBTITLE_TITLE,
    data: { subTitle },
  };
}

function setSearchText(searchText) {
  return {
    type: SET_SEARCH_TEXT,
    data: { searchText },
  };
}

function setFilterAction(filterList) {
  return {
    type: SET_FILTER_ACTION,
    data: { filterList },
  };
}

function setIgnoredNumberOfLetters(number) {
  return {
    type: SET_IGNORED_NUMBER_OF_LETTERS,
    data: number,
  };
}

const salonSearchHeaderActions = {
  setFilterTypes,
  setSelectedFilter,
  setShowFilter,
  setTitle,
  setSubTitle,
  setSearchText,
  setFilterAction,
  setIgnoredNumberOfLetters,
};
export default salonSearchHeaderActions;

export interface SalonSearchHeaderActions {
  setFilterTypes: (filterTypes: any) => void;
  setSelectedFilter: (filter: any) => void;
  setShowFilter: (show: boolean) => void;
  setTitle: (title: string) => void;
  setSubTitle: (subTitle: string) => void;
  setSearchText: (searchText: string) => void;
  setFilterAction: (filter: any) => void;
  setIgnoredNumberOfLetters: (number: number) => void;
}