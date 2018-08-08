
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import CancelAppointment from './components/cancelAppointmentScreen';
import appointmentActions from '../../actions/appointment';

const { postAppointmentCancel } = appointmentActions;

const mapStateToProps = state => ({
  isCancelling: state.appointmentReducer.isCancelling,
});

const mapActionsToProps = dispatch => ({
  cancelAppointment: bindActionCreators(postAppointmentCancel, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(CancelAppointment);
