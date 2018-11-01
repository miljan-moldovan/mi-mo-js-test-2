export const SET_CURRENT_ROUTE = 'navigation/SET_CURRENT_ROUTE';
export const SET_BOTTOM_COLOR = 'navigation/SET_BOTTOM_COLOR';
export const RESET_BOTTOM_COLOR = 'navigation/RESET_BOTTOM_COLOR';

const setBottomColor = color => ({ type: SET_BOTTOM_COLOR, data: { color } });

const resetBottomColor = () => ({ type: RESET_BOTTOM_COLOR });

const setCurrentRoute = route => ({ type: SET_CURRENT_ROUTE, data: { route } });

const navigationActions = {
  setBottomColor,
  setCurrentRoute,
  resetBottomColor,
};
export default navigationActions;
