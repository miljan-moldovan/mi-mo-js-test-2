import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { flatServicesSelector } from '../../redux/selectors/services';
import AddonServicesScreen from './AddonServicesScreen';

const mapStateToProps = state => ({
  services: flatServicesSelector(state),
});
const mapActionsToProps = dispatch => ({
});

export default connect(mapStateToProps, mapActionsToProps)(AddonServicesScreen);
