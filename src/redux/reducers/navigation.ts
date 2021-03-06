import Colors from '../../constants/Colors';
import getBottomColorIphoneX
  from '../../utilities/helpers/getBottomColorIphoneX';

import {
  SET_CURRENT_ROUTE,
  RESET_BOTTOM_COLOR,
  SET_BOTTOM_COLOR,
} from '../actions/navigation';

const initialState: NavigationReducer = {
  bottomColor: Colors.defaultBlue,
  currentRoute: '',
};

export interface NavigationReducer {
  bottomColor: string;
  currentRoute: string;
}

function navigationReducer(state: NavigationReducer = initialState, action): NavigationReducer {
  const { type, data } = action;
  switch (type) {
    case SET_CURRENT_ROUTE:
      return {
        ...state,
        currentRoute: data.route,
        bottomColor: getBottomColorIphoneX(data.route),
      };
    // case RESET_BOTTOM_COLOR:
    //   return {
    //     ...state,
    //     bottomColor: initialState.bottomColor,
    //   };
    // case SET_BOTTOM_COLOR:
    //   return {
    //     ...state,
    //     bottomColor: data.color,
    //   };
    default:
      return state;
  }
}
export default navigationReducer;
