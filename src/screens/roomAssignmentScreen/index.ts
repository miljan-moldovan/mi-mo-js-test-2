import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import roomAssignmentActions from '../../redux/actions/roomAssignment';
import { appointmentCalendarActions } from '../../redux/actions/appointmentBook';
import RoomAssignmentScreen from './components/RoomAssignmentScreen';
import { employeeScheduleChunkedSelector } from '../../redux/selectors/newAppt';
import apptGridSettingsSelector from '@/redux/selectors/apptGridSettingsSelector';

const mapStateToProps = state => ({
  roomAssignmentState: state.roomAssignmentReducer,
  step: apptGridSettingsSelector(state).step,
  chunkedSchedule: employeeScheduleChunkedSelector(state),
});
const mapActionsToProps = dispatch => ({
  roomAssignmentActions: bindActionCreators(
    { ...roomAssignmentActions },
    dispatch,
  ),
  appointmentCalendarActions: bindActionCreators(
    { ...appointmentCalendarActions },
    dispatch,
  ),
});
export default connect(mapStateToProps, mapActionsToProps)(RoomAssignmentScreen);
