import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { appointmentCalendarActions } from '../../redux/actions/appointmentBook';
import blockTimeActions from '../../redux/actions/blockTime';
import appointmentActions from '../../redux/actions/appointment';
import newAppointmentActions from '../../redux/actions/newAppointment';
import rebookDialogActions from '../../redux/actions/rebookDialog';
import rootDrawerNavigatorAction from '../../redux/actions/rootDrawerNavigator';
import modifyApptActions from '../modifyAppointmentScreen/redux';
import AppointmentScreen from './components/appointmentScreen';
import visbleBlocksSelector from '../../redux/selectors/blocksSelector';
import {
  getVisibleAppointmentsDataSource,
} from '../../redux/selectors/appointmentSelector';
import getAvailabilityWithGaps
  from '../../redux/selectors/availabilitySelector';
import restrictedToBookInAdvanceDays from '../../redux/selectors/restrictedToBookInAdvanceDays';
import {
  apptGridSettingsSelector,
} from '../../redux/selectors/apptGridSettingsSelector';
import { getConflicts, getConflictsBlocks } from '../../redux/actions/conflicts';
import * as LoginActions from '../../redux/actions/login';
import storeActions from '../../redux/actions/store';
import { deniedAccessApptBookSelector, onlyOwnApptSelector } from '@/redux/selectors/restrictions';

const mapStateToProps = state => ({
  appointmentScreenState: {
    ...state.appointmentBookReducer,
  },
  deniedAccessApptBook: deniedAccessApptBookSelector(state),
  onlyOwnAppt : onlyOwnApptSelector(state),
  appointmentState: state.appointmentReducer,
  providersState: state.providersReducer,
  newAppointmentState: state.newAppointmentReducer,
  modifyApptState: state.modifyApptReducer,
  userInfoIsLoading: state.userInfoReducer.isLoading,
  blockTimes: visbleBlocksSelector(state),
  appointments: getVisibleAppointmentsDataSource(state),
  availability: getAvailabilityWithGaps(state),
  apptGridSettings: apptGridSettingsSelector(state),
  storeScheduleExceptions: state.storeReducer.scheduleExceptions,
  rebookState: state.rebookReducer,
  restrictedToBookInAdvanceDays: restrictedToBookInAdvanceDays(state),
});

const mapActionsToProps = dispatch => ({
  rebookDialogActions: bindActionCreators({ ...rebookDialogActions }, dispatch),
  appointmentCalendarActions: bindActionCreators(
    { ...appointmentCalendarActions },
    dispatch,
  ),
  appointmentActions: bindActionCreators({ ...appointmentActions }, dispatch),
  newAppointmentActions: bindActionCreators(
    { ...newAppointmentActions },
    dispatch,
  ),
  modifyApptActions: bindActionCreators({ ...modifyApptActions }, dispatch),
  rootDrawerNavigatorAction: bindActionCreators(
    { ...rootDrawerNavigatorAction },
    dispatch,
  ),
  blockTimeActions: bindActionCreators({ ...blockTimeActions }, dispatch),
  auth: bindActionCreators({ ...LoginActions }, dispatch),
  checkConflicts: conflictData => dispatch(getConflicts(conflictData)),
  checkConflictsBlock: conflictData =>
    dispatch(getConflictsBlocks(conflictData)),
  storeActions: bindActionCreators({ ...storeActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(AppointmentScreen);
