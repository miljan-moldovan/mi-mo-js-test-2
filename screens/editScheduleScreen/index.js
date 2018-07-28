import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import EditScheduleScreen from './EditScheduleScreen';
import employeeScheduleActions from '../../actions/employeeSchedule';
import { appointmentCalendarActions } from '../appointmentCalendarScreen/redux/appointmentScreen';

const mapStateToProps = state => ({
  employeeScheduleState: state.employeeScheduleReducer,
  formCache: state.formCache,
});

const mapActionsToProps = dispatch => ({
  appointmentCalendarActions: bindActionCreators({ ...appointmentCalendarActions }, dispatch),
  employeeScheduleActions: bindActionCreators({ ...employeeScheduleActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(EditScheduleScreen);
