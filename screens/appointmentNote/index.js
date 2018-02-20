import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import appointmentNotesActions from '../../actions/appointmentNotes';
import AppointmentNoteScreen from './appointmentNoteScreen';
import walkInActions from '../../actions/walkIn';

const mapStateToProps = state => ({
  appointmentNotesState: state.appointmentNotesReducer,
  walkInState: state.walkInReducer,
});

const mapActionsToProps = dispatch => ({
  appointmentNotesActions: bindActionCreators({ ...appointmentNotesActions }, dispatch),
  walkInActions: bindActionCreators({ ...walkInActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(AppointmentNoteScreen);
