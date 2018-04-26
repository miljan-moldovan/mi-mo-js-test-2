import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ModifyServiceScreen from './ModifyServiceScreen';
import * as actions from '../../actions/queue';

const mapStateToProps = state => ({
  appointmentDetailsState: state.appointmentDetailsReducer,
});


export default connect(mapStateToProps, actions)(ModifyServiceScreen);
