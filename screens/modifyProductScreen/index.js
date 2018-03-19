import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import clientsActions from '../../actions/clients';
import ModifyProductScreen from './ModifyProductScreen';
import walkInActions from '../../actions/walkIn';

const mapStateToProps = state => ({
  clientsState: state.clientsReducer,
  walkInState: state.walkInReducer,
});

const mapActionsToProps = dispatch => ({
  clientsActions: bindActionCreators({ ...clientsActions }, dispatch),
  walkInActions: bindActionCreators({ ...walkInActions }, dispatch),
});

export default (ModifyProductScreen);
