import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import newAppointmentActions from '../../actions/newAppointment';
import serviceActions from '../../actions/service';
import { appointmentCalendarActions } from '../../actions/appointmentBook';
import NewAppointmentScreen from './NewAppointmentScreen';
import formulaActions from '../../actions/formulasAndNotes';
import {
  getEndTime,
  appointmentLength,
  totalPrice,
  isValidAppointment,
} from '../../redux/selectors/newAppt';

const mapStateToProps = state => ({
  newAppointmentState: state.newAppointmentReducer,
  apptBookState: state.appointmentBookReducer,
  settingState: state.settings,
  formulasAndNotesState: state.formulasAndNotesReducer,
  getEndTime: getEndTime(state),
  totalPrice: totalPrice(state),
  appointmentLength: appointmentLength(state),
  isValidAppointment: isValidAppointment(state),
});

const mapActionsToProps = dispatch => ({
  newAppointmentActions: bindActionCreators({ ...newAppointmentActions }, dispatch),
  apptBookActions: bindActionCreators({ ...appointmentCalendarActions }, dispatch),
  formulaActions: bindActionCreators({ ...formulaActions }, dispatch),
  servicesActions: bindActionCreators({ ...serviceActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(NewAppointmentScreen);
