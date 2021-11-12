import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import servicesActions from '@/redux/actions/service';
import ServicesScreen from './ServicesScreen';
import {
  flatServicesSelector,
  quickQueueServicesSelector,
} from '@/redux/selectors/services';
import salonSearchHeaderActions from '@/redux/reducers/searchHeader';

const mapStateToProps = state => ({
  walkInState: state.walkInReducer,
  servicesState: state.serviceReducer,
  salonSearchHeaderState: state.salonSearchHeaderReducer,
  flatServices: flatServicesSelector(state),
  quickQueueServices: quickQueueServicesSelector(state),
});

const mapActionsToProps = dispatch => ({
  servicesActions: bindActionCreators({ ...servicesActions }, dispatch),
  salonSearchHeaderActions: bindActionCreators(
    { ...salonSearchHeaderActions },
    dispatch,
  ),
});

export default connect(mapStateToProps, mapActionsToProps)(ServicesScreen);
