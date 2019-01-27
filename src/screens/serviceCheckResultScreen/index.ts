import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ServiceCheckResultScreen from './ServiceCheckResultScreen';

const mapStateToProps = state => ({
  providersState: state.providersReducer,
});

const mapActionsToProps = dispatch => ({
});

export default connect(mapStateToProps, mapActionsToProps)(ServiceCheckResultScreen);
