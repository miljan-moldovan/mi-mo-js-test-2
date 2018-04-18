import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import turnAwayActions from '../../actions/turnAway';
import TurnAwayScreen from './components/turnAwayScreen';

const mapStateToProps = state => ({
  turnAwayState: state.turnAwayReducer,
  formCache: state.formCache,
});

const mapActionsToProps = dispatch => ({
  turnAwayActions: bindActionCreators({ ...turnAwayActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(TurnAwayScreen);
