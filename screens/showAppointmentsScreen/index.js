import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import clientApptActions from '../../actions/clientAppointments';
import ShowApptScreen from './components/showApptScreen';
import clientApptSelectors from '../../redux/selectors/clientAppt';
import { appointmentCalendarActions } from '../../actions/appointmentBook';

const mapStateToProps = state => ({
  isLoading: state.clientAppointmentsReducer.isLoading,
  isLoadingMore: state.clientAppointmentsReducer.isLoadingMore,
  total: state.clientAppointmentsReducer.total,
  showing: clientApptSelectors.getAppointmentsLength(state),
  error: state.clientAppointmentsReducer.error,
  appointments: clientApptSelectors.groupApptByDateSelector(state),
});

const mapActionsToProps = dispatch => ({
  clientApptActions: bindActionCreators({ ...clientApptActions }, dispatch),
  appointmentCalendarActions: bindActionCreators({ ...appointmentCalendarActions }, dispatch),

});

export default connect(mapStateToProps, mapActionsToProps)(ShowApptScreen);
