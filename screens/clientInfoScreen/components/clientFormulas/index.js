import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import clientFormulasActions from '../../../../actions/clientFormulas';
import ClientFormulas from './clientFormulas';

const mapStateToProps = state => ({
  clientFormulasState: state.clientFormulasReducer,
});

const mapActionsToProps = dispatch => ({
  clientFormulasActions: bindActionCreators({ ...clientFormulasActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(ClientFormulas);
