import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import newAppointmentActions, { CHECK_CONFLICTS_SUCCESS } from '../../redux/actions/newAppointment';
import ModifyApptServiceScreen from './ModifyService';
import { appointmentLength, isValidAppointment } from '../../redux/selectors/newAppt';

const mapStateToProps = state => ({
  newAppointmentState: state.newAppointmentReducer,
  apptBookState: state.appointmentBookReducer,
  apptGridSettings: state.appointmentBookReducer.apptGridSettings,
  appointmentLength: appointmentLength(state),
  isValidAppointment: isValidAppointment(state),
});

const mapActionsToProps = dispatch => ({
  newAppointmentActions: bindActionCreators(
    { ...newAppointmentActions },
    dispatch,
  ),
  setConflicts: (conflicts) => dispatch({ type: CHECK_CONFLICTS_SUCCESS, data: { conflicts } }),
});
export default connect(mapStateToProps, mapActionsToProps)(
  ModifyApptServiceScreen,
);
