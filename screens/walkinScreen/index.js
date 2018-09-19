import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import walkInActions from '../../actions/walkIn';
import * as queueActions from '../../actions/queue';
import salonSearchHeaderActions from '../../reducers/searchHeader';
import settingsActions from '../../actions/settings';
import WalkInScreen from './walkInScreen';

const mapStateToProps = state => ({
  queue: state.queue,
  walkInState: state.walkInReducer,
  salonSearchHeaderState: state.salonSearchHeaderReducer,
  settings: state.settingsReducer,
});

const mapActionsToProps = dispatch => ({
  walkInActions: bindActionCreators({ ...walkInActions }, dispatch),
  queueActions: bindActionCreators({ ...queueActions }, dispatch),
  salonSearchHeaderActions: bindActionCreators({ ...salonSearchHeaderActions }, dispatch),
  settingsActions: bindActionCreators({ ...settingsActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(WalkInScreen);
