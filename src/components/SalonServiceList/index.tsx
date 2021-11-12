import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import appointmentDetailsActions from './redux';
import SalonServiceList from './SalonServiceList';

const mapStateToProps = state => ({
  appointmentDetailsState: state.appointmentDetailsReducer,
});

const mapActionsToProps = dispatch => ({
  appointmentDetailsActions: bindActionCreators({ ...appointmentDetailsActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(SalonServiceList);
