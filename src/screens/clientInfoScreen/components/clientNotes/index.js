import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import clientNotesActions from '../../../../redux/actions/clientNotes';
import clientInfoActions from '../../../../redux/actions/clientInfo';

import ClientNotesScreen from './clientNotes';

const mapStateToProps = state => ({
  clientNotesState: state.clientNotesReducer,
});

const mapActionsToProps = dispatch => ({
  clientNotesActions: bindActionCreators ({...clientNotesActions}, dispatch),
  clientInfoActions: bindActionCreators ({...clientInfoActions}, dispatch),
});

export default connect (mapStateToProps, mapActionsToProps) (ClientNotesScreen);
