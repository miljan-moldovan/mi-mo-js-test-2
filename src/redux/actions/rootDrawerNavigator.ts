export const SET_SHOW_TAB_BAR = 'rootDrawerNavigator/SET_SHOW_TAB_BAR';

const changeShowTabBar = showTabBar => ({
  type: SET_SHOW_TAB_BAR,
  data: showTabBar,
});

const rootDrawerNavigator = {
  changeShowTabBar,
};

export interface RootDrawerNavigatorActions {
  changeShowTabBar: (showTabBar: boolean) => any;
}

export default rootDrawerNavigator;
