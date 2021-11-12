import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import turnAwayActions from '../../redux/actions/turnAway';
import turnAwayReasonsActions from '../../redux/actions/turnAwayReasons';
import TurnAwayScreen from './components/turnAwayScreen';
import {
  apptGridSettingsSelector,
} from '../../redux/selectors/apptGridSettingsSelector';

const mapStateToProps = state => ({
  formCache: state.formCache,
  turnAwayState: state.turnAwayReducer,
  turnAwayReasonsState: state.turnAwayReasonsReducer,
  apptGridSettings: apptGridSettingsSelector(state),
});

const mapActionsToProps = dispatch => ({
  turnAwayActions: bindActionCreators({ ...turnAwayActions }, dispatch),
  turnAwayReasonsActions: bindActionCreators(
    { ...turnAwayReasonsActions },
    dispatch,
  ),
});

export default connect(mapStateToProps, mapActionsToProps)(TurnAwayScreen);
