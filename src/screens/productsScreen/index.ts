import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import productsActions from '../../redux/actions/products';
import ProductsScreen from './ProductsScreen';
import salonSearchHeaderActions from '../../redux/reducers/searchHeader';

const mapStateToProps = state => ({
  searchHeaderState: state.salonSearchHeaderReducer,
  walkInState: state.walkInReducer,
  productsState: state.productsReducer,
  salonSearchHeaderState: state.salonSearchHeaderReducer,
});

const mapActionsToProps = dispatch => ({
  productsActions: bindActionCreators ({...productsActions}, dispatch),
  salonSearchHeaderActions: bindActionCreators (
    {...salonSearchHeaderActions},
    dispatch
  ),
});

export default connect (mapStateToProps, mapActionsToProps) (ProductsScreen);
