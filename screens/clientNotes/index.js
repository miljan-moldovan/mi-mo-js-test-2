import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import noteActions from '../../actions/appointmentNotes';
import ClientNoteScreen from './components/clientNoteScreen';

const mapStateToProps = state => ({
  clientsState: state.clientsReducer,
  appointmentNotesState: state.appointmentNotesReducer,
});

const mapActionsToProps = dispatch => ({
  noteActions: bindActionCreators({ ...noteActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(ClientNoteScreen);
