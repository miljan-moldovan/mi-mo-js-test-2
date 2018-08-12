import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import newAppointmentActions from '../../actions/newAppointment';
import ModifyApptServiceScreen from './ModifyService';
import apptGridSettingsSelector from '../../redux/selectors/apptGridSettingsSelector';

const mapStateToProps = state => ({
  newAppointmentState: state.newAppointmentReducer,
  apptBookState: state.appointmentBookReducer,
  apptGridSettings: apptGridSettingsSelector(state),
});

const mapActionsToProps = dispatch => ({
  newAppointmentActions: bindActionCreators({ ...newAppointmentActions }, dispatch),
});
export default connect(mapStateToProps, mapActionsToProps)(ModifyApptServiceScreen);
