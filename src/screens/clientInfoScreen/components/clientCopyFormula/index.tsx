import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import clientFormulasActions from '../../../../redux/actions/clientFormulas';
import ClientCopyFormula from './clientCopyFormula';
import clientInfoActions from '../../../../redux/actions/clientInfo';

const mapStateToProps = state => ({
  clientFormulasState: state.clientFormulasReducer,
});

const mapActionsToProps = dispatch => ({
  clientFormulasActions: bindActionCreators (
    {...clientFormulasActions},
    dispatch
  ),
  clientInfoActions: bindActionCreators ({...clientInfoActions}, dispatch),
});

export default connect (mapStateToProps, mapActionsToProps) (ClientCopyFormula);
