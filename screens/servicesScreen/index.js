import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import walkInActions from '../../actions/walkIn';
import ServicesScreen from './ServicesScreen';

const mapStateToProps = state => ({
  walkInState: state.walkInReducer,
});

const mapActionsToProps = dispatch => ({
  walkInActions: bindActionCreators({ ...walkInActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(ServicesScreen);
