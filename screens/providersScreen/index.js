import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import providersActions from './redux';
import ProvidersScreen from './ProvidersScreen';

const mapStateToProps = state => ({
  providersState: state.providersReducer,
  salonSearchHeaderState: state.salonSearchHeaderReducer,
});

const mapActionsToProps = dispatch => ({
  providersActions: bindActionCreators({ ...providersActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(ProvidersScreen);
