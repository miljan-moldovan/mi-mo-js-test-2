import { createSelector } from 'reselect';
import { AccessState, Tasks } from '@/constants/Tasks';


const getCorrectRestriction = (state, type) => {
  return state.restrictionsReducer[type];
};

const getRestrictionForAppBook = (state) => {
  return {
    apptBookRestriction: state.restrictionsReducer[Tasks.Mobile_FullAppointments],
    ownApptBookRestriction: state.restrictionsReducer[Tasks.Mobile_Appointments],
    haveLinkedEmployee: !!(state.userInfoReducer && state.userInfoReducer.employeeId),
  };
};

export const restrictionsDisabledSelector = createSelector(getCorrectRestriction,
  restriction => restriction === AccessState.Denied || restriction === AccessState.Loading,
);

export const restrictionsLoadingSelector = createSelector(getCorrectRestriction,
  restriction => restriction === AccessState.Loading,
);

export const deniedAccessApptBookSelector = createSelector(getRestrictionForAppBook,
  restriction => {
    return restriction.apptBookRestriction === AccessState.Denied
      && restriction.ownApptBookRestriction === AccessState.Denied ||
      (restriction.ownApptBookRestriction === AccessState.Allowed && !restriction.haveLinkedEmployee);
  },
);

export const onlyOwnApptSelector = createSelector(getRestrictionForAppBook,
  restriction => {
    return restriction.apptBookRestriction === AccessState.Denied
      && restriction.ownApptBookRestriction === AccessState.Allowed;
  },
);
