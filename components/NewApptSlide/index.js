import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import newApptActions from '../../actions/newAppointment';
import {
  getEndTime,
  appointmentLength,
} from '../../redux/selectors/newAppt';
import NewApptSlide from './NewApptSlide';

const mapStateToProps = state => ({
  newApptState: state.newAppointmentReducer,
  getLength: appointmentLength(state),
  getEndTime: getEndTime(state),
});

const mapActionsToProps = dispatch => ({
  newApptActions: bindActionCreators({ ...newApptActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(NewApptSlide);
