import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import apptBookViewOptionsActions from '../../actions/apptBookViewOptions';
import ApptBookViewOptionScreen from './apptBookViewOptionsScreen';
import walkInActions from '../../actions/walkIn';

const mapStateToProps = state => ({
  apptBookViewOptionsState: state.apptBookViewOptionsReducer,
  walkInState: state.walkInReducer,
  formCache: state.formCache,
});

const mapActionsToProps = dispatch => ({
  apptBookViewOptionsActions: bindActionCreators({ ...apptBookViewOptionsActions }, dispatch),
  walkInActions: bindActionCreators({ ...walkInActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(ApptBookViewOptionScreen);
