export const SET_SELECTED_APPOINTMENT = 'modifyAppointment/SET_SELECTED_APPOINTMENT';

const setSelectedAppt = appointment => ({
  type: SET_SELECTED_APPOINTMENT,
  data: { appointment },
});

const modifyApptActions = {
  setSelectedAppt,
};
export default modifyApptActions;

const initialState = {
  appointment: null,
};

export const modifyApptReducer = (state = initialState, action) => {
  const { type, data } = action;
  switch (type) {
    case SET_SELECTED_APPOINTMENT: {
      state.appointment = data.appointment;
      break;
    }
    default:
      break;
  }
  return state;
};
