import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import newAppointmentActions from '../../actions/newAppointment';
import { appointmentCalendarActions } from '../appointmentCalendarScreen/redux/appointmentScreen';
import NewAppointmentScreen from './NewAppointmentScreen';

const mapStateToProps = state => ({
  newAppointmentState: state.newAppointmentReducer,
});

const mapActionsToProps = dispatch => ({
  newAppointmentActions: bindActionCreators({ ...newAppointmentActions }, dispatch),
  apptBookActions: bindActionCreators({ ...appointmentCalendarActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(NewAppointmentScreen);
