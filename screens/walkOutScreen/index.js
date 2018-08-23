import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import WalkoutScreen from './walkoutScreen';
import walkoutActions from '../../actions/walkout';

const mapStateToProps = state => ({
  walkoutState: state.walkoutReducer,
});

const mapActionsToProps = dispatch => ({
  walkoutActions: bindActionCreators({ ...walkoutActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(WalkoutScreen);
