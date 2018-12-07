import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import newAppointmentActions from '../../redux/actions/newAppointment';
import ConflictsScreen from './ConflictsScreen';

const mapStateToProps = state => ({
  newApptState: state.newAppointmentReducer,
});

const mapActionsToProps = dispatch => ({
  newApptActions: bindActionCreators ({...newAppointmentActions}, dispatch),
});

export default connect (mapStateToProps, mapActionsToProps) (ConflictsScreen);
