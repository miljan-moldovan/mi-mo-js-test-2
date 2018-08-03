import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import clientNotesActions from '../../../../actions/clientNotes';
import ClientNotesScreen from './clientNotes';

const mapStateToProps = state => ({
  clientNotesState: state.clientNotesReducer,
});

const mapActionsToProps = dispatch => ({
  clientNotesActions: bindActionCreators({ ...clientNotesActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(ClientNotesScreen);
