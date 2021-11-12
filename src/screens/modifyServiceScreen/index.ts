import { connect } from 'react-redux';
import ModifyServiceScreen from './ModifyServiceScreen';
import queueDetailActions from '../../redux/actions/queueDetail';

const mapStateToProps = state => ({
  queueDetailState: state.queueDetailReducer,
});
const mapDispatchToProps = dispatch => ({
  getServiceCheck: () => dispatch(queueDetailActions.getServiceCheck()),
});

export default connect(mapStateToProps, mapDispatchToProps)(
  ModifyServiceScreen,
);
