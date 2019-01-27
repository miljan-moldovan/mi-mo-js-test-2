
import { SET_RESTRICTION } from '@/redux/actions/restrictions';
import { Tasks } from '@/constants/Tasks';

const initialState = {};
Object.keys(Tasks).forEach(key => initialState[key] = null);

export default function employeeOrderReducer(state = initialState, action) {
  const { type, data } = action;
  switch (type) {
    case SET_RESTRICTION:
      return {
        ...state,
        [data.type]: data.value,
      };
    default:
      return state;
  }
}
