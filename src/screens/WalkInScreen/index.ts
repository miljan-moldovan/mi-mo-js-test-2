import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import walkInActions from '../../redux/actions/walkIn';
import * as queueActions from '../../redux/actions/queue';
import salonSearchHeaderActions from '../../redux/reducers/searchHeader';
import settingsActions from '../../redux/actions/settings';
import WalkInScreen from './WalkInScreen';

const mapStateToProps = state => ({
  queue: state.queue,
  walkInState: state.walkInReducer,
  salonSearchHeaderState: state.salonSearchHeaderReducer,
  clientInfoState: state.clientInfoReducer,
  settings: state.settingsReducer,
});

const mapActionsToProps = dispatch => ({
  walkInActions: bindActionCreators({ ...walkInActions }, dispatch),
  queueActions: bindActionCreators({ ...queueActions as any }, dispatch),
  salonSearchHeaderActions: bindActionCreators(
    { ...salonSearchHeaderActions },
    dispatch
  ),
  settingsActions: bindActionCreators({ ...settingsActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(WalkInScreen);
