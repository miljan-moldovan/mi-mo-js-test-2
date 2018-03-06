import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import walkInActions from '../../actions/walkIn';
import salonSearchHeaderActions from '../../components/SalonSearchHeader/redux';
import WalkInScreen from './components/WalkInScreen';

const mapStateToProps = state => ({
  walkInState: state.walkInReducer,
  salonSearchHeaderState: state.salonSearchHeaderReducer,
});

const mapActionsToProps = dispatch => ({
  walkInActions: bindActionCreators({ ...walkInActions }, dispatch),
  salonSearchHeaderActions: bindActionCreators({ ...salonSearchHeaderActions }, dispatch),

});

export default connect(mapStateToProps, mapActionsToProps)(WalkInScreen);
