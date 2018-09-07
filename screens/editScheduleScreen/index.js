import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import EditScheduleScreen from './EditScheduleScreen';
import employeeScheduleActions from '../../actions/employeeSchedule';
import { appointmentCalendarActions } from '../../actions/appointmentBook';

const mapStateToProps = state => ({
  employeeScheduleState: state.employeeScheduleReducer,
  storeState: state.storeReducer,
  formCache: state.formCache,
});

const mapActionsToProps = dispatch => ({
  appointmentCalendarActions: bindActionCreators({ ...appointmentCalendarActions }, dispatch),
  employeeScheduleActions: bindActionCreators({ ...employeeScheduleActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(EditScheduleScreen);
