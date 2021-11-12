import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import newAppointmentActions from '../../redux/actions/newAppointment';
import RepeatsOnScreen from './RepeatsOnScreen';

const mapStateToProps = state => ({
  newAppointmentState: state.newAppointmentReducer,
});
const mapActionsToProps = dispatch => ({
  newAppointmentActions: bindActionCreators (
    {...newAppointmentActions},
    dispatch
  ),
});
export default connect (mapStateToProps, mapActionsToProps) (RepeatsOnScreen);
