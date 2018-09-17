import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { appointmentCalendarActions } from '../../actions/appointmentBook';
import blockTimeActions from '../../actions/blockTime';
import appointmentActions from '../../actions/appointment';
import newAppointmentActions from '../../actions/newAppointment';
import rootDrawerNavigatorAction from '../../actions/rootDrawerNavigator';
import modifyApptActions from '../modifyAppointmentScreen/redux';
import AppointmentScreen from './components/appointmentScreen';
import visbleBlocksSelector from '../../redux/selectors/blocksSelector';
import { getVisibleAppointmentsDataSource } from '../../redux/selectors/appointmentSelector';
import getAvailabilityWithGaps from '../../redux/selectors/availabilitySelector';
import { apptGridSettingsSelector } from '../../redux/selectors/apptGridSettingsSelector';
import { getConflicts, getConflictsBlocks } from '../../actions/conflicts';
import * as LoginActions from '../../actions/login';
import storeActions from '../../actions/store'

const mapStateToProps = state => ({
  appointmentScreenState: {
    ...state.appointmentBookReducer,
  },
  appointmentState: state.appointmentReducer,
  providersState: state.providersReducer,
  newAppointmentState: state.newAppointmentReducer,
  modifyApptState: state.modifyApptReducer,
  blockTimes: visbleBlocksSelector(state),
  appointments: getVisibleAppointmentsDataSource(state),
  availability: getAvailabilityWithGaps(state),
  apptGridSettings: apptGridSettingsSelector(state),
  storeScheduleExceptions: state.storeReducer.scheduleExceptions,
});

const mapActionsToProps = dispatch => ({
  appointmentCalendarActions: bindActionCreators({ ...appointmentCalendarActions }, dispatch),
  appointmentActions: bindActionCreators({ ...appointmentActions }, dispatch),
  newAppointmentActions: bindActionCreators({ ...newAppointmentActions }, dispatch),
  modifyApptActions: bindActionCreators({ ...modifyApptActions }, dispatch),
  rootDrawerNavigatorAction: bindActionCreators({ ...rootDrawerNavigatorAction }, dispatch),
  blockTimeActions: bindActionCreators({ ...blockTimeActions }, dispatch),
  auth: bindActionCreators({ ...LoginActions }, dispatch),
  checkConflicts: conflictData => dispatch(getConflicts(conflictData)),
  checkConflictsBlock: conflictData => dispatch(getConflictsBlocks(conflictData)),
  storeActions: bindActionCreators({ ...storeActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(AppointmentScreen);
