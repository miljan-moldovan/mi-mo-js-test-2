import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import appointmentNotesActions from '../../../../actions/appointmentNotes';
import AppointmentNotesScreen from './appointmentNotesScreen';

const mapStateToProps = state => ({
  appointmentNotesState: state.appointmentNotesReducer,
});

const mapActionsToProps = dispatch => ({
  appointmentNotesActions: bindActionCreators({ ...appointmentNotesActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(AppointmentNotesScreen);
