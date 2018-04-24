// @flow
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import FontAwesome, { Icons } from 'react-native-fontawesome';

import SalonSearchHeader from '../../components/SalonSearchHeader';
import ProductList from './components/productList';
import CategoryProductsList from './components/categoryProductsList';
import ProductCategoryList from './components/productCategoryList';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
    flexDirection: 'column',
  },
  productListContainer: {
    flex: 1,
    backgroundColor: '#333',
    flexDirection: 'column',
  },
  productsList: {
    flex: 9,
    backgroundColor: 'white',
  },
  leftButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
  },
  backIcon: {
    fontSize: 30,
    marginLeft: 10,
    textAlign: 'left',
    color: '#FFFFFF',
  },
  rightButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
    textAlign: 'right',
  },
});


class ProductsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const defaultProps = navigation.state.params && navigation.state.params.defaultProps ? navigation.state.params.defaultProps : {};
    const ignoreNav = navigation.state.params ? navigation.state.params.ignoreNav : false;

    const { leftButton } = navigation.state.params &&
    navigation.state.params.headerProps && !ignoreNav ? navigation.state.params.headerProps : { leftButton: defaultProps.leftButton };
    const { rightButton } = navigation.state.params &&
    navigation.state.params.headerProps && !ignoreNav ? navigation.state.params.headerProps : { rightButton: defaultProps.rightButton };
    const { leftButtonOnPress } = navigation.state.params &&
    navigation.state.params.headerProps && !ignoreNav ? navigation.state.params.headerProps : { leftButtonOnPress: defaultProps.leftButtonOnPress };
    const { rightButtonOnPress } = navigation.state.params &&
    navigation.state.params.headerProps && !ignoreNav ? navigation.state.params.headerProps : { rightButtonOnPress: defaultProps.rightButtonOnPress };
    const { title } = navigation.state.params &&
    navigation.state.params.headerProps && !ignoreNav ? navigation.state.params.headerProps : { title: defaultProps.title };
    const { subTitle } = navigation.state.params &&
    navigation.state.params.headerProps && !ignoreNav ? navigation.state.params.headerProps : { subTitle: defaultProps.subTitle };

    return {
      header: props => (<SalonSearchHeader
        title={title}
        subTitle={subTitle}
        leftButton={leftButton}
        leftButtonOnPress={() => { leftButtonOnPress(navigation); }}
        rightButton={rightButton}
        rightButtonOnPress={() => { rightButtonOnPress(navigation); }}
        hasFilter={false}
        containerStyle={{
          paddingHorizontal: 20,
        }}
      />),
    };
  };

  static flexFilter(list, info) {
    let matchesFilter = [];
    const matches = [];

    matchesFilter = function match(item) {
      let count = 0;
      for (let n = 0; n < info.length; n += 1) {
        if (item[info[n].Field] && item[info[n].Field].toLowerCase().indexOf(info[n].Values) > -1) {
          count += 1;
        }
      }
      return count > 0;
    };

    for (let i = 0; i < list.length; i += 1) {
      if (matchesFilter(list[i])) {
        matches.push(list[i]);
      }
    }

    return matches;
  }

  constructor(props) {
    super(props);
    this.getProducts();
  }

  getProducts = (callback) => {
    this.props.productsActions.setShowCategoryProducts(false);
    this.props.productsActions.getProducts().then((response) => {
      if (response.data.error) {
        this.goBack();
      } else {
        const products = response.data.products;
        this.props.productsActions.setProducts(products);
        this.props.productsActions.setFilteredProducts(products);
        if (callback) {
          callback();
        }
      }
    }).catch((error) => {
    });
  }

  state = {
    prevHeaderProps: {

    },
    headerProps: {
      title: 'Products',
      subTitle: null,
      leftButtonOnPress: () => { this.goBack(); },
      leftButton: <Text style={styles.leftButtonText}>Cancel</Text>,
    },
    defaultHeaderProps: {
      title: 'Products',
      subTitle: null,
      leftButtonOnPress: () => { this.goBack(); },
      leftButton: <Text style={styles.leftButtonText}>Cancel</Text>,
    },
  }

  componentWillMount() {
    this.props.navigation.setParams({ defaultProps: this.state.defaultHeaderProps, ignoreNav: false });
    const selectedProduct = this.props.navigation.state.params ? this.props.navigation.state.params.selectedProduct : null;
    this.props.productsActions.setSelectedProduct(selectedProduct);
  }

  setHeaderData(props, ignoreNav = false) {
    this.setState({ prevHeaderProps: this.state.headerProps });
    this.props.navigation.setParams({ defaultProps: props, ignoreNav });
    this.props.salonSearchHeaderActions.setFilterAction(searchText => this.filterList(searchText));
    this.setState({ headerProps: props });
  }

  goBack = () => {
    if (this.props.productsState.showCategoryProducts) {
      this.props.productsActions.setFilteredProducts(this.props.productsState.products);
      this.props.productsActions.setShowCategoryProducts(false);
      this.setHeaderData(this.state.prevHeaderProps);
    } else {
      this.props.navigation.goBack();
    }
  }

  handleOnChangeProduct = (product) => {
    if (!this.props.navigation.state || !this.props.navigation.state.params) {
      return;
    }
    const { onChangeProduct, dismissOnSelect } = this.props.navigation.state.params;
    if (this.props.navigation.state.params && onChangeProduct) { onChangeProduct(product); }

    if (dismissOnSelect) { this.props.navigation.goBack(); }
  }


  filterProducts = (searchText) => {
    const productsCategories = JSON.parse(JSON.stringify(this.props.productsState.products));

    if (searchText && searchText.length > 0) {
      this.setHeaderData(this.state.headerProps);

      const criteria = [
        { Field: 'name', Values: [searchText.toLowerCase()] },
      ];

      const filtered = [];

      for (let i = 0; i < productsCategories.length; i += 1) {
        const productsCategory = productsCategories[i];
        productsCategory.products = ProductsScreen.flexFilter(productsCategory.products, criteria);
        if (productsCategory.products.length > 0) {
          filtered.push(productsCategory);
        }
      }

      this.props.productsActions.setFilteredProducts(filtered);
    } else {
      this.setHeaderData(this.state.defaultHeaderProps);
      this.props.productsActions.setFilteredProducts(productsCategories);
    }

    this.props.navigation.setParams({
      searchText: this.props.salonSearchHeaderState.searchText,
    });
  }

  onPressItem = (item) => {
    this.props.salonSearchHeaderActions.setSearchText(item);
    this.filterProducts(item);
    this.props.salonSearchHeaderActions.setShowFilter(false);
  }

  filterList = (searchText) => {
    this.props.productsActions.setShowCategoryProducts(false);
    this.filterProducts(searchText);
  }

  handlePressProductCategory = (item) => {
    this.setHeaderData({
      title: item.name,
      subTitle: null,
      leftButton:
  <TouchableOpacity
    style={{ flex: 1 }}
    onPress={() => { this.goBack(); }}
  >
    <FontAwesome style={styles.backIcon}>
      {Icons.angleLeft}
    </FontAwesome>
  </TouchableOpacity>,
    }, true);
    this.props.productsActions.setShowCategoryProducts(true);
    this.props.productsActions.setCategoryProducts(item.products);
  }

  render() {
    let onChangeProduct = null;
    const { state } = this.props.navigation;
    // make sure we only pass a callback to the component if we have one for the screen
    if (state.params && state.params.onChangeProduct) { onChangeProduct = this.handleOnChangeProduct; }

    return (
      <View style={styles.container}>
        <View style={styles.productsList}>
          { (!this.props.productsState.showCategoryProducts
            && !this.props.salonSearchHeaderState.showFilter
            && this.props.productsState.filtered.length > 0) &&
            <ProductCategoryList
              onRefresh={this.getProducts}
              handlePressProductCategory={this.handlePressProductCategory}
              productCategories={this.props.productsState.filtered}
            />
          }

          { (!this.props.productsState.showCategoryProducts
            && this.props.salonSearchHeaderState.showFilter
            && this.props.productsState.filtered.length > 0) &&
            <ProductList
              {...this.props}
              onRefresh={this.getProducts}
              boldWords={this.props.salonSearchHeaderState.searchText}
              style={styles.productListContainer}
              products={this.props.productsState.filtered}
              onChangeProduct={onChangeProduct}
            />
          }

          { (this.props.productsState.showCategoryProducts
            && this.props.productsState.filtered.length > 0) &&
            <CategoryProductsList
              {...this.props}
              onRefresh={this.getProducts}
              onChangeProduct={onChangeProduct}
              categoryProducts={this.props.productsState.categoryProducts}
            />
          }

        </View>

      </View>
    );
  }
}

ProductsScreen.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
    state: PropTypes.shape({
      params: PropTypes.shape({
        onChangeProduct: PropTypes.func,
        dismissOnSelect: PropTypes.bool,
      }),
    }),
  }),
};

ProductsScreen.defaultProps = {
  navigation: null,
};

export default ProductsScreen;
