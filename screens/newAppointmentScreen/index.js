import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import appointmentNotesActions from '../../actions/appointmentNotes';
import NewAppointmentScreen from './NewAppointmentScreen';

const mapStateToProps = state => ({
  appointmentNotesState: state.appointmentNotesReducer,
});

const mapActionsToProps = dispatch => ({
  appointmentNotesActions: bindActionCreators({ ...appointmentNotesActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(NewAppointmentScreen);
