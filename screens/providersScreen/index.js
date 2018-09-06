import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import providersActions from '../../actions/providers';
import ProvidersScreen from './ProvidersScreen';
import queueListSelector from '../../redux/selectors/providers/queueListSelector';

const mapStateToProps = state => ({
  // queueList: queueListSelector(state),
  providersState: state.providersReducer,
  salonSearchHeaderState: state.salonSearchHeaderReducer,
});

const mapActionsToProps = dispatch => ({
  providersActions: bindActionCreators({ ...providersActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(ProvidersScreen);
