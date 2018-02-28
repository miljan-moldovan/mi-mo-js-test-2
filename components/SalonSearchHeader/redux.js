export const SET_FILTER_TYPES = 'salonSearchHeader/FILTER_TYPES';
export const SET_SELECTED_FILTER = 'salonSearchHeader/SET_SELECTED_FILTER';
export const SET_SHOW_FILTER = 'salonSearchHeader/SET_SHOW_FILTER';
export const SET_TITLE = 'salonSearchHeader/SET_TITLE';
export const SET_SUBTITLE_TITLE = 'salonSearchHeader/SET_SUBTITLE_TITLE';
export const SET_SEARCH_TEXT = 'salonSearchHeader/SET_SEARCH_TEXT';
export const SET_LEFT_BUTTON = 'salonSearchHeader/SET_LEFT_BUTTON';
export const SET_LEFT_BUTTON_ONPRESS = 'salonSearchHeader/SET_LEFT_BUTTON_ONPRESS';
export const SET_RIGHT_BUTTON = 'salonSearchHeader/SET_RIGHT_BUTTON';
export const SET_RIGHT_BUTTON_ONPRESS = 'salonSearchHeader/SET_RIGHT_BUTTON_ONPRESS';


export const SET_HEADER = 'salonSearchHeader/SET_HEADER';


const initialState = {
  filterTypes: ['This store', 'All stores'],
  selectedFilter: 0,
  showFilter: false,
  title: 'Clients',
  subTitle: null,
  searchText: '',
  leftButton: 'Cancel',
  leftButtonOnPress: () => {},
  rightButtonOnPress: () => {},
  rightButton: 'Add',
  header: {},
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
    case SET_SEARCH_TEXT:
      return {
        ...state,
        error: null,
        searchText: data.searchText,
      };
    case SET_LEFT_BUTTON:
      return {
        ...state,
        error: null,
        leftButton: data.leftButton,
      };
    case SET_LEFT_BUTTON_ONPRESS:
      return {
        ...state,
        error: null,
        leftButtonOnPress: data.leftButtonOnPress,
      };
    case SET_RIGHT_BUTTON:
      return {
        ...state,
        error: null,
        rightButton: data.rightButton,
      };
    case SET_RIGHT_BUTTON_ONPRESS:
      return {
        ...state,
        error: null,
        rightButtonOnPress: data.rightButtonOnPress,
      };
    case SET_HEADER:
      return {
        ...state,
        error: null,
        header: data.header,
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


function setLeftButton(leftButton) {
  return {
    type: SET_LEFT_BUTTON,
    data: { leftButton },
  };
}

function setLeftButtonOnPress(leftButtonOnPress) {
  return {
    type: SET_LEFT_BUTTON_ONPRESS,
    data: { leftButtonOnPress },
  };
}
function setRightButton(rightButton) {
  return {
    type: SET_RIGHT_BUTTON,
    data: { rightButton },
  };
}

function setRightButtonOnPress(rightButtonOnPress) {
  return {
    type: SET_RIGHT_BUTTON_ONPRESS,
    data: { rightButtonOnPress },
  };
}

function setHeader(header) {
  return {
    type: SET_HEADER,
    data: { header },
  };
}


const salonSearchHeaderActions = {
  setFilterTypes,
  setSelectedFilter,
  setShowFilter,
  setTitle,
  setSubTitle,
  setSearchText,
  setLeftButton,
  setLeftButtonOnPress,
  setRightButton,
  setRightButtonOnPress,
  setHeader,
};

export default salonSearchHeaderActions;
