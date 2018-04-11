import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import providersActions from '../providersScreen/redux';
import FilterOptionsScreen from './FilterOptionsScreen';

const mapStateToProps = state => ({
  providersState: state.providersReducer,
  salonSearchHeaderState: state.salonSearchHeaderReducer,
});

const mapActionsToProps = dispatch => ({
  providersActions: bindActionCreators({ ...providersActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(FilterOptionsScreen);
