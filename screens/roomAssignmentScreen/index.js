import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import roomAssignmentActions from '../../actions/roomAssignment';
import { appointmentCalendarActions } from '../appointmentCalendarScreen/redux/appointmentScreen';
import RoomAssignmentScreen from './RoomAssignmentScreen';
import { employeeScheduleChunkedSelector } from '../../redux/selectors/newAppt';

const mapStateToProps = state => ({
  roomAssignmentState: state.roomAssignmentReducer,
  chunkedSchedule: employeeScheduleChunkedSelector(state),
});
const mapActionsToProps = dispatch => ({
  roomAssignmentActions: bindActionCreators({ ...roomAssignmentActions }, dispatch),
  appointmentCalendarActions: bindActionCreators({ ...appointmentCalendarActions }, dispatch),
});
export default connect(mapStateToProps, mapActionsToProps)(RoomAssignmentScreen);
