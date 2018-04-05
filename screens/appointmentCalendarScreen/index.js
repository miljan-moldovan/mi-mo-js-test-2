import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { appointmentCalendarActions } from './redux/appointmentScreen';
import AppointmentScreen from './components/appointmentScreen';

const mapStateToProps = state => ({
  appointmentScreenState: state.appointmentScreenReducer,
  providersState: state.providersReducer,
  appointmentState: state.appointmentReducer,
});

const mapActionsToProps = dispatch => ({
  appointmentCalendarActions: bindActionCreators({ ...appointmentCalendarActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(AppointmentScreen);
