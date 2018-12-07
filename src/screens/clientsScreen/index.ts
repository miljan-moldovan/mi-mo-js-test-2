import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import clientsActions from '../../redux/actions/clients';
import ClientsScreen from './ClientsScreen';
import salonSearchHeaderActions from '../../redux/reducers/searchHeader';
import clientsSectionSelector from '../../redux/selectors/clientsSelector';
import * as LoginActions from '../../redux/actions/login';
import storeActions from '../../redux/actions/store';

const mapStateToProps = state => ({
  walkInState: state.walkInReducer,
  clientsState: state.clientsReducer,
  salonSearchHeaderState: state.salonSearchHeaderReducer,
  clientsSectionDataSource: clientsSectionSelector (state),
  total: state.clientsReducer.total,
  showing: state.clientsReducer.clients.length,
  isLoadingMore: state.clientsReducer.isLoadingMore,
});

const mapActionsToProps = dispatch => ({
  clientsActions: bindActionCreators ({...clientsActions}, dispatch),
  salonSearchHeaderActions: bindActionCreators (
    {...salonSearchHeaderActions},
    dispatch
  ),
  auth: bindActionCreators ({...LoginActions}, dispatch),
  storeActions: bindActionCreators ({...storeActions}, dispatch),
});

export default connect (mapStateToProps, mapActionsToProps) (ClientsScreen);
