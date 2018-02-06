import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import clientsSearchActions from '../../actions/clientsSearch';
import ClientsSearchScreen from './ClientsSearchScreen';

const mapStateToProps = state => ({
  clientsSearchState: state.clientsSearchReducer,
});

const mapActionsToProps = dispatch => ({
  clientsSearchActions: bindActionCreators({ ...clientsSearchActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(ClientsSearchScreen);
