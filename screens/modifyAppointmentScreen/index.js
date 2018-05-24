import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import modifyApptActions from './redux';
import ModifyAppointmentScreen from './ModifyAppointmentScreen';

const mapStateToProps = state => ({
  state: state.modifyApptReducer,
});

const mapActionsToProps = dispatch => ({
  actions: bindActionCreators({ ...modifyApptActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(ModifyAppointmentScreen);
