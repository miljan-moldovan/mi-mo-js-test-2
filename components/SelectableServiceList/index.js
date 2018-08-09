import { connect } from 'react-redux';
import { flatServicesSelector } from '../../redux/selectors/services';
import SelectableServiceList from './SelectableServiceList';

const mapStateToProps = state => ({
  services: flatServicesSelector(state),
});
const mapActionsToProps = dispatch => ({});
export default connect(mapStateToProps, mapActionsToProps)(SelectableServiceList);
