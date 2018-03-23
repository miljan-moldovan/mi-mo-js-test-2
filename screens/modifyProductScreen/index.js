import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ModifyProductScreen from './ModifyProductScreen';
import appointmentDetailsActions from '../appointmentDetailsScreen/redux';

const mapStateToProps = state => ({
  appointmentDetailsState: state.appointmentDetailsReducer,
});

const mapActionsToProps = dispatch => ({
  appointmentDetailsActions: bindActionCreators({ ...appointmentDetailsActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(ModifyProductScreen);
