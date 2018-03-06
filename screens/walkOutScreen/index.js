import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import WalkoutScreen from './components/walkoutScreen';
import walkoutActions from '../../actions/walkout';

const mapStateToProps = state => ({
  reasonTypes: state.walkoutReducer.reasonTypes,
  isLoading: state.walkoutReducer.isLoading,
  error: state.walkoutReducer.error,
  formCache: state.formCache,
});

const mapActionsToProps = dispatch => ({
  walkoutActions: bindActionCreators({ ...walkoutActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(WalkoutScreen);
