import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import providersActions from '../../redux/actions/providers';
import ProvidersScreen from './ProvidersScreen';
import queueListSelector from '../../redux/selectors/providers/queueListSelector';
import receptionistListSelector from '../../redux/selectors/providers/receptionistListSelector';
import groupedSettingsSelector from '../../redux/selectors/settingsSelector';
import settingsActions from '../../redux/actions/settings';
import getAvailabilityWithGaps from '@/redux/selectors/availabilitySelector';


const mapStateToProps = state => ({
  settingsState: state.settingsReducer,
  queueList: queueListSelector(state),
  receptionistList: receptionistListSelector(state),
  quickQueueEmployees: state.providersReducer.quickQueueEmployees,
  providersState: state.providersReducer,
  availability: getAvailabilityWithGaps(state),
  salonSearchHeaderState: state.salonSearchHeaderReducer,
  groupedSettings: groupedSettingsSelector(state),
});

const mapActionsToProps = dispatch => ({
  providersActions: bindActionCreators({ ...providersActions }, dispatch),
  settingsActions: bindActionCreators({ ...settingsActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(ProvidersScreen);
