import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import ClientMergeScreen from './ClientMergeScreen';
import clientsActions from '../../redux/actions/clients';

const mapStateToProps = ({clientsReducer: clients}, ownProps) => ({
  mergeableClients: clients.mergeableClients,
  isLoading: clients.isLoading,
  waitingMerge: clients.waitingMerge,
  error: clients.error,
});

const mapActionsToProps = dispatch => ({
  clientsActions: bindActionCreators ({...clientsActions}, dispatch),
});

export default connect (mapStateToProps, mapActionsToProps) (ClientMergeScreen);
