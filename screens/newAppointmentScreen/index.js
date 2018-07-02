import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import newAppointmentActions from '../../actions/newAppointment';
import { appointmentCalendarActions } from '../appointmentCalendarScreen/redux/appointmentScreen';
import NewAppointmentScreen from './NewAppointmentScreen';
import formulaActions from '../../actions/formulasAndNotes';

const mapStateToProps = state => ({
  newAppointmentState: state.newAppointmentReducer,
  apptBookState: state.appointmentScreenReducer,
  settingState: state.settings,
  formulasAndNotesState: state.formulasAndNotesReducer,
});

const mapActionsToProps = dispatch => ({
  newAppointmentActions: bindActionCreators({ ...newAppointmentActions }, dispatch),
  apptBookActions: bindActionCreators({ ...appointmentCalendarActions }, dispatch),
  formulaActions: bindActionCreators({ ...formulaActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(NewAppointmentScreen);
