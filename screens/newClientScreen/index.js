import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import clientsActions from '../../actions/clients';
import clientInfoActions from '../../actions/clientInfo';
import NewClientScreen from './newClientScreen';

const mapStateToProps = state => ({
  clientsState: state.clientsReducer,
  clientInfoState: state.clientInfoReducer,
});

const mapActionsToProps = dispatch => ({
  clientsActions: bindActionCreators({ ...clientsActions }, dispatch),
  clientInfoActions: bindActionCreators({ ...clientInfoActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(NewClientScreen);
