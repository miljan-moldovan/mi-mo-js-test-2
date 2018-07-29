import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import BlockTimeScreen from './BlockTimeScreen';
import blockTimeActions from '../../actions/blockTime';
import { appointmentCalendarActions } from '../appointmentCalendarScreen/redux/appointmentScreen';

const mapStateToProps = state => ({
  blockTimeState: state.blockTimeReducer,
  formCache: state.formCache,
});

const mapActionsToProps = dispatch => ({
  appointmentCalendarActions: bindActionCreators({ ...appointmentCalendarActions }, dispatch),
  blockTimeActions: bindActionCreators({ ...blockTimeActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(BlockTimeScreen);
