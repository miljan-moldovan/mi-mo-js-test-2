import { SET_SHOW_TAB_BAR } from '../actions/rootDrawerNavigator';

const initialState = {
  showTabBar: true,
};

export default function rootDrawerNavigator(state = initialState, action) {
  const { type, data } = action;
  switch (type) {
    case SET_SHOW_TAB_BAR:
      return { ...state, showTabBar: data };
    default:
      return state;
  }
}
