import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import CancelAppointment from './components/cancelAppointmentScreen';
import appointmentActions from '../../redux/actions/appointment';
import blockActions from '../../redux/actions/blockTime';

const {postAppointmentCancel} = appointmentActions;
const {cancelBlockTime} = blockActions;

const mapStateToProps = state => ({
  currentUserEmployee: state.userInfoReducer.currentEmployee,
  isCancelling: state.appointmentReducer.isCancelling ||
    state.blockTimeReducer.isCancelling,
});

const mapActionsToProps = dispatch => ({
  cancelAppointment: bindActionCreators (postAppointmentCancel, dispatch),
  cancelBlock: bindActionCreators (cancelBlockTime, dispatch),
});

export default connect (mapStateToProps, mapActionsToProps) (CancelAppointment);
