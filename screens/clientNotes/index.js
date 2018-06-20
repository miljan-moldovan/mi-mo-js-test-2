import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import clientsActions from '../../actions/clients';
import ClientNotesScreen from './components/clientNoteScreen';

const mapStateToProps = state => ({
  clientsState: state.clientsReducer,
});

const mapActionsToProps = dispatch => ({
  clientsActions: bindActionCreators({ ...clientsActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(ClientNotesScreen);
