import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import turnAwayActions from '../../actions/turnAway';
import turnAwayReasonsActions from '../../actions/turnAwayReasons';
import TurnAwayScreen from './components/turnAwayScreen';

const mapStateToProps = state => ({
  turnAwayState: state.turnAwayReducer,
  turnAwayReasonsState: state.turnAwayReasonsReducer,
  formCache: state.formCache,
});

const mapActionsToProps = dispatch => ({
  turnAwayActions: bindActionCreators({ ...turnAwayActions }, dispatch),
  turnAwayReasonsActions: bindActionCreators({ ...turnAwayReasonsActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(TurnAwayScreen);
