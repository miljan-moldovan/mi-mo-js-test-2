import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { appointmentCalendarActions } from '../../actions/appointmentBook';
import apptBookSetEmployeeOrderActions from '../../actions/apptBookSetEmployeeOrder';
import ApptBookViewOptionScreen from './apptBookViewOptionsScreen';

const mapStateToProps = state => ({
  apptBookViewOptionsState: state.apptBookViewOptionsReducer,
  apptBookState: state.appointmentBookReducer,
  employeeOrderState: state.apptBookSetEmployeeOrderReducer,
});

const mapActionsToProps = dispatch => ({
  apptBookActions: bindActionCreators({ ...appointmentCalendarActions }, dispatch),
  employeeOrderActions: bindActionCreators({ ...apptBookSetEmployeeOrderActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(ApptBookViewOptionScreen);
