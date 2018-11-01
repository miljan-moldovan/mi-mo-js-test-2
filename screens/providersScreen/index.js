import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import providersActions from '../../actions/providers';
import ProvidersScreen from './ProvidersScreen';
import queueListSelector from '../../redux/selectors/providers/queueListSelector';
import receptionistListSelector from '../../redux/selectors/providers/receptionistListSelector';
import groupedSettingsSelector from '../../redux/selectors/settingsSelector';

const mapStateToProps = state => ({
  settings: state.settingsReducer.settings,
  queueList: queueListSelector(state),
  receptionistList: receptionistListSelector(state),
  quickQueueEmployees: state.providersReducer.quickQueueEmployees,
  providersState: state.providersReducer,
  salonSearchHeaderState: state.salonSearchHeaderReducer,
  groupedSettings: groupedSettingsSelector(state),
});

const mapActionsToProps = dispatch => ({
  providersActions: bindActionCreators({ ...providersActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(ProvidersScreen);
