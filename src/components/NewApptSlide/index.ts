import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import newApptActions from '../../redux/actions/newAppointment';
import serviceActions from '../../redux/actions/service';
import { appointmentCalendarActions } from '../../redux/actions/appointmentBook';

import { getEndTime, appointmentLength } from '../../redux/selectors/newAppt';
import NewApptSlide from './NewApptSlide';
import { AppStore } from '@/models';

const mapStateToProps = (state: AppStore) => {
  return {
    newApptState: state.newAppointmentReducer,
    userInfo: state.userInfoReducer,
    getLength: appointmentLength(state),
    getEndTime: getEndTime(state),
  };
};

const mapActionsToProps = dispatch => ({
  apptBookActions: bindActionCreators(
    { ...appointmentCalendarActions },
    dispatch,
  ),
  newApptActions: bindActionCreators({ ...newApptActions }, dispatch),
  servicesActions: bindActionCreators({ ...serviceActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(NewApptSlide);
