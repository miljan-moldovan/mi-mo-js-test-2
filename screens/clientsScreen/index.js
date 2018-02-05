import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import clientsActions from '../../actions/clients';
import ClientsScreen from './ClientsScreen';

const mapStateToProps = state => ({
  clientsState: state.clientsReducer,
});

const mapActionsToProps = dispatch => ({
  clientsActions: bindActionCreators({ ...clientsActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(ClientsScreen);
