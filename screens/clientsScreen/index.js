import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import clientsActions from '../../actions/clients';
import ClientsScreen from './ClientsScreen';
import salonSearchHeaderActions from '../../components/SalonSearchHeader/redux';
import clientsSectionSelector from '../../redux/selectors/clientsSelector';

const mapStateToProps = state => ({
  walkInState: state.walkInReducer,
  clientsState: state.clientsReducer,
  salonSearchHeaderState: state.salonSearchHeaderReducer,
  clientsSectionDataSource: clientsSectionSelector(state),
});

const mapActionsToProps = dispatch => ({
  clientsActions: bindActionCreators({ ...clientsActions }, dispatch),
  salonSearchHeaderActions: bindActionCreators({ ...salonSearchHeaderActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(ClientsScreen);
