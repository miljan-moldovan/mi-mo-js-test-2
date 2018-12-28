import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import clientInfoActions from '@/redux/actions/clientInfo';
import {
  appointmentCalendarActions,
} from '@/redux/actions/appointmentBook';
import ClientDetails from './clientDetails';
import settingsActions from '@/redux/actions/settings';

const mapStateToProps = state => ({
  settingsState: state.settingsReducer,
  clientInfoState: state.clientInfoReducer,
});

const mapActionsToProps = dispatch => ({
  settingsActions: bindActionCreators({ ...settingsActions as any }, dispatch),
  clientInfoActions: bindActionCreators({ ...clientInfoActions as any }, dispatch),
  appointmentCalendarActions: bindActionCreators(
    { ...appointmentCalendarActions },
    dispatch,
  ),
});

export default connect(mapStateToProps, mapActionsToProps)(ClientDetails);
