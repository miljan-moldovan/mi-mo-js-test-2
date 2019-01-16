import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import clientFormulasActions from '../../../../redux/actions/clientFormulas';
import ClientFormulas from './clientFormulas';
import clientInfoActions from '../../../../redux/actions/clientInfo';
import settingsActions from '@/redux/actions/settings';

const mapStateToProps = state => ({
  clientFormulasState: state.clientFormulasReducer,
});

const mapActionsToProps = dispatch => ({
  clientFormulasActions: bindActionCreators(
    { ...clientFormulasActions },
    dispatch,
  ),
  clientInfoActions: bindActionCreators({ ...clientInfoActions }, dispatch),
  settingsActions: bindActionCreators({ ...settingsActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(ClientFormulas);
