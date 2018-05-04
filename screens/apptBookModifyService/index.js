import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import newAppointmentActions from '../../actions/newAppointment';
import ModifyApptServiceScreen from './ModifyService';

const mapStateToProps = state => ({
  newAppointmentState: state.newAppointmentReducer,
});

const mapActionsToProps = dispatch => ({
  newAppointmentActions: bindActionCreators({ ...newAppointmentActions }, dispatch),
});
export default connect(mapStateToProps, mapActionsToProps)(ModifyApptServiceScreen);
