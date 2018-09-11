import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import queueDetailActions from '../../actions/queueDetail';
import AppointmentDetailsScreen from './AppointmentDetailsScreen';

const mapStateToProps = state => ({
  queueDetailState: state.queueDetailReducer,
});

const mapActionsToProps = dispatch => ({
  queueDetailActions: bindActionCreators({ ...queueDetailActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(AppointmentDetailsScreen);
