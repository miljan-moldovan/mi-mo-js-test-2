import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import providersActions from '../../actions/providers';
import ProvidersScreen from './ProvidersScreen';
import queueListSelector from '../../redux/selectors/providers/queueListSelector';
import receptionistListSelector from '../../redux/selectors/providers/receptionistListSelector';

const mapStateToProps = state => ({
  settings: state.settingsReducer.settings,
  queueList: queueListSelector(state),
  receptionistList: receptionistListSelector(state),
  providersState: state.providersReducer,
  salonSearchHeaderState: state.salonSearchHeaderReducer,
});

const mapActionsToProps = dispatch => ({
  providersActions: bindActionCreators({ ...providersActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(ProvidersScreen);
