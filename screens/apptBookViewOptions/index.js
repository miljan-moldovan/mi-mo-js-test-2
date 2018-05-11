import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { appointmentCalendarActions } from '../appointmentCalendarScreen/redux/appointmentScreen';
import ApptBookViewOptionScreen from './apptBookViewOptionsScreen';

const mapStateToProps = state => ({
  apptBookViewOptionsState: state.apptBookViewOptionsReducer,
  apptBookState: state.appointmentScreenReducer,
});

const mapActionsToProps = dispatch => ({
  apptBookActions: bindActionCreators({ ...appointmentCalendarActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(ApptBookViewOptionScreen);
