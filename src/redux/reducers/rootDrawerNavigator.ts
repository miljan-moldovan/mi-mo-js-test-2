import { SET_SHOW_TAB_BAR } from '../actions/rootDrawerNavigator';

const initialState: RootDrawerNavigatorReducer = {
  showTabBar: true,
};

export interface RootDrawerNavigatorReducer {
  showTabBar: boolean;
}

export default function rootDrawerNavigator(state: RootDrawerNavigatorReducer = initialState, action): RootDrawerNavigatorReducer {
  const { type, data } = action;
  switch (type) {
    case SET_SHOW_TAB_BAR:
      return { ...state, showTabBar: data };
    default:
      return state;
  }
}
