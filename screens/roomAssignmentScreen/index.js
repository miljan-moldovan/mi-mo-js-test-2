import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import roomAssignmentActions from '../../actions/roomAssignment';
import RoomAssignmentScreen from './RoomAssignmentScreen';

const mapStateToProps = state => ({
  roomAssignmentState: state.roomAssignmentReducer,
});
const mapActionsToProps = dispatch => ({
  roomAssignmentActions: bindActionCreators({ ...roomAssignmentActions }, dispatch),
});
export default connect(mapStateToProps, mapActionsToProps)(RoomAssignmentScreen);
