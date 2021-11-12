import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import clientsActions from '../../redux/actions/clients';
import RecommendationsScreen from './RecommendationsScreen';
import walkInActions from '../../redux/actions/walkIn';

const mapStateToProps = state => ({
  clientsState: state.clientsReducer,
  walkInState: state.walkInReducer,
});

const mapActionsToProps = dispatch => ({
  clientsActions: bindActionCreators ({...clientsActions}, dispatch),
  walkInActions: bindActionCreators ({...walkInActions}, dispatch),
});

export default RecommendationsScreen;
