import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import providersActions from '../../redux/actions/providers';
import FilterOptionsScreen from './FilterOptionsScreen';
import {
  apptGridSettingsSelector,
} from '../../redux/selectors/apptGridSettingsSelector';
import serviceActions from '@/redux/actions/service';
import isResourcesAvailable from '@/redux/selectors/services/isResourcesAvailableSelector';

const mapStateToProps = state => ({
  providersState: state.providersReducer,
  apptScreenState: state.appointmentBookReducer,
  apptGridSettings: apptGridSettingsSelector(state),
  salonSearchHeaderState: state.salonSearchHeaderReducer,
  showResources: isResourcesAvailable(state),
});

const mapActionsToProps = dispatch => ({
  servicesActions: bindActionCreators({ ...serviceActions }, dispatch),
  providersActions: bindActionCreators({ ...providersActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(FilterOptionsScreen);
