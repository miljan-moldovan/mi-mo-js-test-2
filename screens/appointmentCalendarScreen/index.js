import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { appointmentCalendarActions } from '../../actions/appointmentBook';
import appointmentActions from '../../actions/appointment';
import newAppointmentActions from '../../actions/newAppointment';
import modifyApptActions from '../modifyAppointmentScreen/redux';
import AppointmentScreen from './components/appointmentScreen';
import visbleBlocksSelector from '../../redux/selectors/blocksSelector';
import { getVisibleAppointmentsDataSource } from '../../redux/selectors/appointmentSelector';
import getAvailabilityWithGaps from '../../redux/selectors/availabilitySelector';
import { filteredProviders } from '../../redux/selectors/providersSelector';

const mapStateToProps = state => ({
  appointmentScreenState: {
    ...state.appointmentBookReducer,
    providers: filteredProviders(state),
  },
  appointmentState: state.appointmentReducer,
  providersState: state.providersReducer,
  newAppointmentState: state.newAppointmentReducer,
  modifyApptState: state.modifyApptReducer,
  blockTimes: visbleBlocksSelector(state),
  appointments: getVisibleAppointmentsDataSource(state),
  availability: getAvailabilityWithGaps(state),
});

const mapActionsToProps = dispatch => ({
  appointmentCalendarActions: bindActionCreators({ ...appointmentCalendarActions }, dispatch),
  appointmentActions: bindActionCreators({ ...appointmentActions }, dispatch),
  newAppointmentActions: bindActionCreators({ ...newAppointmentActions }, dispatch),
  modifyApptActions: bindActionCreators({ ...modifyApptActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(AppointmentScreen);
