import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import appointmentFormulasActions from './redux';
import AppointmentFormulas from './AppointmentFormulas';

const mapStateToProps = state => ({
  appointmentFormulasState: state.appointmentFormulasReducer,
});

const mapActionsToProps = dispatch => ({
  appointmentFormulasActions: bindActionCreators({ ...appointmentFormulasActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(AppointmentFormulas);
