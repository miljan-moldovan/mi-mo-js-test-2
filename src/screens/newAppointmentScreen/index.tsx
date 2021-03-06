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
import { checkRestrictionsAddService, getRestrictions } from '@/redux/actions/restrictions';
import { restrictionsDisabledSelector, restrictionsLoadingSelector } from '@/redux/selectors/restrictions';
import { Tasks } from '@/constants/Tasks';

const mapStateToProps = state => ({
  apptAddServiceIsDisabled: restrictionsDisabledSelector(state, Tasks.Appt_MultiServiceAppt),
  apptViewContactInfoIsDisabled: restrictionsDisabledSelector(state, Tasks.Appt_ViewContactInfo),
  apptAddServiceIsLoading: restrictionsLoadingSelector(state, Tasks.Appt_MultiServiceAppt),
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
  getRestrictions: () => dispatch(getRestrictions([Tasks.Appt_MultiServiceAppt, Tasks.Appt_ViewContactInfo])),
  checkRestrictionsAddService: (callback) => dispatch(checkRestrictionsAddService(callback)),
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
