import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import newApptActions from '../../redux/actions/newAppointment';
import serviceActions from '../../redux/actions/service';
import { appointmentCalendarActions } from '../../redux/actions/appointmentBook';

import { getEndTime, appointmentLength } from '../../redux/selectors/newAppt';
import NewApptSlide from './NewApptSlide';
import { AppStore } from '@/models';
import {
  checkRestrictionsBlockTime, checkRestrictionsBookAppt, checkRestrictionsEditSchedule,
  checkRestrictionsRoomAssignment,
  getRestrictions,
} from '@/redux/actions/restrictions';
import { Tasks } from '@/constants/Tasks';
import { restrictionsDisabledSelector, restrictionsLoadingSelector } from '@/redux/selectors/restrictions';

const mapStateToProps = (state: AppStore) => {
  return {
    newApptState: state.newAppointmentReducer,
    userInfo: state.userInfoReducer,
    getLength: appointmentLength(state),
    getEndTime: getEndTime(state),
    apptEnterBlockIsDisabled: restrictionsDisabledSelector(state, Tasks.Appt_EnterBlock),
    apptEnterBlockIsLoading: restrictionsLoadingSelector(state, Tasks.Appt_EnterBlock),
    apptRoomAssignmentIsDisabled: restrictionsDisabledSelector(state, Tasks.Salon_RoomAssign),
    apptRoomAssignmentIsLoading: restrictionsLoadingSelector(state, Tasks.Salon_RoomAssign),
    apptEditScheduleIsDisabled: restrictionsDisabledSelector(state, Tasks.Salon_EmployeeEdit),
    apptEditScheduleIsLoading: restrictionsLoadingSelector(state, Tasks.Salon_EmployeeEdit),
    apptBookIsDisabled: restrictionsDisabledSelector(state, Tasks.Appt_EnterAppt),
    apptBookIsLoading: restrictionsLoadingSelector(state, Tasks.Appt_EnterAppt),
  };
};

const mapActionsToProps = dispatch => ({
  getRestrictions: () => dispatch(getRestrictions([Tasks.Appt_EnterBlock,
    Tasks.Salon_RoomAssign, Tasks.Salon_EmployeeEdit, Tasks.Appt_EnterAppt])),
  apptBookActions: bindActionCreators(
    { ...appointmentCalendarActions },
    dispatch,
  ),
  newApptActions: bindActionCreators({ ...newApptActions }, dispatch),
  servicesActions: bindActionCreators({ ...serviceActions }, dispatch),
  checkRestrictionsBlockTime: (callback) => dispatch(checkRestrictionsBlockTime(callback)),
  checkRestrictionsRoomAssignment: (callback) => dispatch(checkRestrictionsRoomAssignment(callback)),
  checkRestrictionsEditSchedule: (callback) => dispatch(checkRestrictionsEditSchedule(callback)),
  checkRestrictionsBookAppt: (callback) => dispatch(checkRestrictionsBookAppt(callback)),
});

export default connect(mapStateToProps, mapActionsToProps)(NewApptSlide);
