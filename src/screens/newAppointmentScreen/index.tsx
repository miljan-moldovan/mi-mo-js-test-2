import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import newAppointmentActions from '@/redux/actions/newAppointment';
import serviceActions from '@/redux/actions/service';
import { appointmentCalendarActions } from '@/redux/actions/appointmentBook';
import NewAppointmentScreen from './NewAppointmentScreen';
import formulaActions from '@/redux/actions/formulasAndNotes';
import {
  getEndTime,
  appointmentLength,
  totalPrice,
  isValidAppointment,
} from '@/redux/selectors/newAppt';
import { filteredProviders } from '@/redux/selectors/providersSelector';

const mapStateToProps = state => ({
  newAppointmentState: state.newAppointmentReducer,
  apptBookState: state.appointmentBookReducer,
  settingState: state.settings,
  formulasAndNotesState: state.formulasAndNotesReducer,
  getEndTime: getEndTime(state),
  totalPrice: totalPrice(state),
  appointmentLength: appointmentLength(state),
  isValidAppointment: isValidAppointment(state),
  appointmentScreenState: {
    ...state.appointmentBookReducer,
    providers: filteredProviders(state),
  },
});

const mapActionsToProps = dispatch => ({
  newAppointmentActions: bindActionCreators(
    { ...newAppointmentActions },
    dispatch,
  ),
  apptBookActions: bindActionCreators(
    { ...appointmentCalendarActions },
    dispatch,
  ),
  formulaActions: bindActionCreators({ ...formulaActions }, dispatch),
  servicesActions: bindActionCreators({ ...serviceActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(
  NewAppointmentScreen,
);
