import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import providersActions from '../../screens/providersScreen/redux';
import appointmentActions from '../../actions/appointment';
import SalonCalendar from './components/calendar';

const mapStateToProps = state => ({
  providersState: state.providersReducer,
  appointmentState: state.appointmentReducer,
});

const mapActionsToProps = dispatch => ({
  providersActions: bindActionCreators({ ...providersActions }, dispatch),
  appointmentActions: bindActionCreators({ ...appointmentActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(SalonCalendar);
