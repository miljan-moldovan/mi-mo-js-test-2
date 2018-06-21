import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import formulaActions from '../../actions/formulasAndNotes';
import ClientFormulasScreen from './components/clientFormulasScreen';

const mapStateToProps = state => ({
  formulasState: state.formulasAndNotesReducer,
});

const mapActionsToProps = dispatch => ({
  formulaActions: bindActionCreators({ ...formulaActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(ClientFormulasScreen);
