import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import apptBookSetEmployeeOrderActions from '../../actions/apptBookSetEmployeeOrder';
import ApptBookSetEmployeeOrderScreen from './apptBookSetEmployeeOrderScreen';

const mapStateToProps = state => ({
  apptBookSetEmployeeOrderState: state.apptBookSetEmployeeOrderReducer,
  formCache: state.formCache,
});

const mapActionsToProps = dispatch => ({
  apptBookSetEmployeeOrderActions: bindActionCreators({ ...apptBookSetEmployeeOrderActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(ApptBookSetEmployeeOrderScreen);
