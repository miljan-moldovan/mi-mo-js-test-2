import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import providersActions from '../providersScreen/redux';
import FilterByPositionScreen from './FilterByPositionScreen';

const mapStateToProps = state => ({
  providersState: state.providersReducer,
  salonSearchHeaderState: state.salonSearchHeaderReducer,
});

const mapActionsToProps = dispatch => ({
  providersActions: bindActionCreators({ ...providersActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(FilterByPositionScreen);
