import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import newApptActions from '../../actions/newAppointment';
import serviceActions from '../../actions/service';
import { appointmentCalendarActions } from '../../actions/appointmentBook';

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
  apptBookActions: bindActionCreators({ ...appointmentCalendarActions }, dispatch),
  newApptActions: bindActionCreators({ ...newApptActions }, dispatch),
  servicesActions: bindActionCreators({ ...serviceActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(NewApptSlide);
