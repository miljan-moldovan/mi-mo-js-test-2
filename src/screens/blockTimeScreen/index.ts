import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import BlockTimeScreen from './BlockTimeScreen';
import blockTimeActions from '../../redux/actions/blockTime';
import {appointmentCalendarActions} from '../../redux/actions/appointmentBook';
import apptGridSettingsSelector
  from '../../redux/selectors/apptGridSettingsSelector';

const mapStateToProps = state => ({
  apptGridSettings: apptGridSettingsSelector (state),
  blockTimeState: state.blockTimeReducer,
  formCache: state.formCache,
});

const mapActionsToProps = dispatch => ({
  appointmentCalendarActions: bindActionCreators (
    {...appointmentCalendarActions},
    dispatch
  ),
  blockTimeActions: bindActionCreators ({...blockTimeActions}, dispatch),
});

export default connect (mapStateToProps, mapActionsToProps) (BlockTimeScreen);
