export const SET_FILTER_TYPES = 'salonSearchHeader/FILTER_TYPES';
export const SET_SELECTED_FILTER = 'salonSearchHeader/SET_SELECTED_FILTER';
export const SET_SHOW_FILTER = 'salonSearchHeader/SET_SHOW_FILTER';
export const SET_TITLE = 'salonSearchHeader/SET_TITLE';
export const SET_SUBTITLE_TITLE = 'salonSearchHeader/SET_SUBTITLE_TITLE';

const initialState = {
  filterTypes: ['This store', 'All stores'],
  selectedFilter: 0,
  showFilter: false,
  title: '',
  subTitle: null,
};

export function salonSearchHeaderReducer(state = initialState, action) {
  const { type, data } = action;
  switch (type) {
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
    type: SET_TITLE,
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


const salonSearchHeaderActions = {
  setFilterTypes,
  setSelectedFilter,
  setShowFilter,
  setTitle,
  setSubTitle,
};

export default salonSearchHeaderActions;
