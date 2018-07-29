import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import apptBookTurnAwayActions from '../../actions/apptBookTurnAway';
import ApptBookTurnAwayScreen from './components/apptBookTurnAwayScreen';

const mapStateToProps = state => ({
  apptBookTurnAwayState: state.apptBookTurnAwayReducer,
  formCache: state.formCache,
});

const mapActionsToProps = dispatch => ({
  apptBookTurnAwayActions: bindActionCreators({ ...apptBookTurnAwayActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(ApptBookTurnAwayScreen);
