import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ModifyProductScreen from './ModifyProductScreen';

const mapStateToProps = state => ({
  queueDetailState: state.queueDetailReducer,
});

const mapActionsToProps = dispatch => ({
});

export default connect(mapStateToProps, mapActionsToProps)(ModifyProductScreen);
