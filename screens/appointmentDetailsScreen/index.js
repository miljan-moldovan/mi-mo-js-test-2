import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import queueDetailActions from '../../actions/queueDetail';
import AppointmentDetailsScreen from './AppointmentDetailsScreen';

const mapStateToProps = state => ({
  queueDetailState: state.queueDetailReducer,
  queueState: state.queue,
});

const mapActionsToProps = dispatch => ({
  queueDetailActions: bindActionCreators({ ...queueDetailActions }, dispatch),
});

const ConnectedScreen = connect(mapStateToProps, mapActionsToProps)(AppointmentDetailsScreen);
ConnectedScreen.navigationOptions = AppointmentDetailsScreen.navigationOptions;
export default ConnectedScreen;
