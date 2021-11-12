import { connect } from 'react-redux';
import RecommendProductScreen from './components/RecommendProductScreen';

const mapStateToProps = state => ({
  providersState: state.providersReducer,
});

export default connect(mapStateToProps)(RecommendProductScreen);
