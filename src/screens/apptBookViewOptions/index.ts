import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { appointmentCalendarActions } from '@/redux/actions/appointmentBook';
import apptBookSetEmployeeOrderActions from '@/redux/actions/apptBookSetEmployeeOrder';
import ApptBookViewOptionScreen from './apptBookViewOptionsScreen';
import { onlyOwnApptSelector } from '@/redux/selectors/restrictions';

const mapStateToProps = state => ({
  onlyOwnAppt : onlyOwnApptSelector(state),
  apptBookViewOptionsState: state.apptBookViewOptionsReducer,
  apptBookState: state.appointmentBookReducer,
  employeeOrderState: state.apptBookSetEmployeeOrderReducer,
});

const mapActionsToProps = dispatch => ({
  apptBookActions: bindActionCreators(
    { ...appointmentCalendarActions },
    dispatch,
  ),
  employeeOrderActions: bindActionCreators(
    { ...apptBookSetEmployeeOrderActions },
    dispatch,
  ),
});

export default connect(mapStateToProps, mapActionsToProps)(ApptBookViewOptionScreen);
