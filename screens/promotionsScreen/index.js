import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import walkInActions from '../../actions/walkIn';
import promotionsActions from '../../actions/promotions';
import PromotionsScreen from './PromotionsScreen';

const mapStateToProps = state => ({
  walkInState: state.walkInReducer,
  promotionsState: state.promotionsReducer,
});

const mapActionsToProps = dispatch => ({
  walkInActions: bindActionCreators({ ...walkInActions }, dispatch),
  promotionsActions: bindActionCreators({ ...promotionsActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(PromotionsScreen);
