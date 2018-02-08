import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import clientsSearchActions from '../../actions/clientsSearch';
import ClientsSearchScreen from './ClientsSearchScreen';
import walkInActions from '../../actions/walkIn';

const mapStateToProps = state => ({
  clientsSearchState: state.clientsSearchReducer,
  walkInState: state.walkInReducer,
});

const mapActionsToProps = dispatch => ({
  clientsSearchActions: bindActionCreators({ ...clientsSearchActions }, dispatch),
  walkInActions: bindActionCreators({ ...walkInActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(ClientsSearchScreen);
