import { createSelector } from 'reselect';
import { AccessState } from '@/constants/Tasks';


const getCorrectRestriction = (state, type) => {
  return state.restrictionsReducer[type];
};
export const restrictionsDisabledSelector = createSelector(getCorrectRestriction,
  restriction => restriction === AccessState.Denied || restriction === AccessState.Loading,
);
export const restrictionsLoadingSelector = createSelector(getCorrectRestriction,
  restriction => restriction === AccessState.Loading,
);
