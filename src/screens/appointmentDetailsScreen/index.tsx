import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import queueDetailActions from '../../redux/actions/queueDetail';
import AppointmentDetailsScreen from './AppointmentDetailsScreen';

const mapStateToProps = state => ({
  queueDetailState: state.queueDetailReducer,
  queueState: state.queue,
});

const mapActionsToProps = dispatch => ({
  queueDetailActions: bindActionCreators ({...queueDetailActions}, dispatch),
});

export default connect (mapStateToProps, mapActionsToProps) (
  AppointmentDetailsScreen
);
