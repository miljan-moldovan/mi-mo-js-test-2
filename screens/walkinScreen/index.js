import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import walkInActions from '../../actions/walkIn';
import WalkInScreen from './WalkInScreen';

const mapStateToProps = state => ({
  walkInState: state.walkInReducer,
});

const mapActionsToProps = dispatch => ({
  walkInActions: bindActionCreators({ ...walkInActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(WalkInScreen);
