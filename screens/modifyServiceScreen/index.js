import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import clientsActions from '../../actions/clients';
import ModifyServiceScreen from './ModifyServiceScreen';
import appointmentDetailsActions from '../appointmentDetailsScreen/redux';

const mapStateToProps = state => ({
  appointmentDetailsState: state.appointmentDetailsReducer,
});

const mapActionsToProps = dispatch => ({
  appointmentDetailsActions: bindActionCreators({ ...appointmentDetailsActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(ModifyServiceScreen);
