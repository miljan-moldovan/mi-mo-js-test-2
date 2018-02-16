import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import appointmentNoteActions from '../../actions/appointmentNotes';
import NewAppointmentNoteScreen from './newAppointmentNoteScreen';

const mapStateToProps = state => ({
  appointmentNoteState: state.appointmentNoteReducer,
});

const mapActionsToProps = dispatch => ({
  appointmentNoteActions: bindActionCreators({ ...appointmentNoteActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(NewAppointmentNoteScreen);
