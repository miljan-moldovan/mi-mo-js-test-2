import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import appointmentNotesActions from '../../redux/actions/appointmentNotes';
import NewAppointmentNoteScreen from './newAppointmentNoteScreen';

const mapStateToProps = state => ({
  appointmentNotesState: state.appointmentNotesReducer,
});

const mapActionsToProps = dispatch => ({
  appointmentNotesActions: bindActionCreators (
    {...appointmentNotesActions},
    dispatch
  ),
});

export default connect (mapStateToProps, mapActionsToProps) (
  NewAppointmentNoteScreen
);
