import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import servicesActions from '../../actions/service';
import ServicesScreen from './ServicesScreen';
import salonSearchHeaderActions from '../../components/SalonSearchHeader/redux';

const mapStateToProps = state => ({
  walkInState: state.walkInReducer,
  servicesState: state.serviceReducer,
  salonSearchHeaderState: state.salonSearchHeaderReducer,
});

const mapActionsToProps = dispatch => ({
  servicesActions: bindActionCreators({ ...servicesActions }, dispatch),
  salonSearchHeaderActions: bindActionCreators({ ...salonSearchHeaderActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(ServicesScreen);
