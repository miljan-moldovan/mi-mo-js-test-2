import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { appointmentCalendarActions } from './redux/appointmentScreen';
import appointmentActions from '../../actions/appointment';
import newAppointmentActions from '../../actions/newAppointment';
import AppointmentScreen from './components/appointmentScreen';

const mapStateToProps = state => ({
  appointmentScreenState: state.appointmentScreenReducer,
  appointmentState: state.appointmentReducer,
  providersState: state.providersReducer,
  newAppointmentState: state.newAppointmentReducer,
});

const mapActionsToProps = dispatch => ({
  appointmentCalendarActions: bindActionCreators({ ...appointmentCalendarActions }, dispatch),
  appointmentActions: bindActionCreators({ ...appointmentActions }, dispatch),
  newAppointmentActions: bindActionCreators({ ...newAppointmentActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(AppointmentScreen);
