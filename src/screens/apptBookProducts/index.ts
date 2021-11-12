import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import productsActions from '../../redux/actions/products';
import productsSelectors from '../../redux/selectors/products';
import ProductsScreen from './ProductsScreen';

const mapStateToProps = state => ({
  productsState: state.productsReducer,
  categoryList: productsSelectors.productCategoryList (state),
});
const mapActionsToProps = dispatch => ({
  getProducts: () => dispatch (productsActions.getProducts ()),
});
export default connect (mapStateToProps, mapActionsToProps) (ProductsScreen);
