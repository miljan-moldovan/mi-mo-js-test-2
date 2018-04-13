import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { appointmentCalendarActions } from './redux/appointmentScreen';
import appointmentActions from '../../actions/appointment';
import AppointmentScreen from './components/appointmentScreen';

const mapStateToProps = state => ({
  appointmentScreenState: state.appointmentScreenReducer,
  providersState: state.apptBookSetEmployeeOrderReducer,
  appointmentState: state.appointmentReducer,
});

const mapActionsToProps = dispatch => ({
  appointmentCalendarActions: bindActionCreators({ ...appointmentCalendarActions }, dispatch),
  appointmentActions: bindActionCreators({ ...appointmentActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(AppointmentScreen);
