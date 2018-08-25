export const storeInfoSelector = state => state.storeReducer.storeInfo;
export const storeScheduleExceptionsSelector = state => state.storeReducer.scheduleExceptions;

export default {
  storeInfoSelector,
  storeScheduleExceptionsSelector,
};
