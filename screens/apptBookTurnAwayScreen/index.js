import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import apptBookTurnAwayActions from '../../actions/apptBookTurnAway';
import turnAwayReasonsActions from '../../actions/turnAwayReasons';
import ApptBookTurnAwayScreen from './components/apptBookTurnAwayScreen';

const mapStateToProps = state => ({
  apptBookTurnAwayState: state.apptBookTurnAwayReducer,
  turnAwayReasonsState: state.turnAwayReasonsReducer,
  formCache: state.formCache,
});

const mapActionsToProps = dispatch => ({
  apptBookTurnAwayActions: bindActionCreators({ ...apptBookTurnAwayActions }, dispatch),
  turnAwayReasonsActions: bindActionCreators({ ...turnAwayReasonsActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(ApptBookTurnAwayScreen);
