// @flow
import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import PropTypes from 'prop-types';

import SideMenuItem from '../../components/SideMenuItem';
import SalonSearchHeader from '../../components/SalonSearchHeader';

import ProductList from './components/productList';
import CategoryProductsList from './components/categoryProductsList';
import ProductsHeader from './components/ProductsHeader';
import ProductCategoryList from './components/productCategoryList';

const styles = StyleSheet.create({
  highlightStyle: {
    color: '#000',
    fontFamily: 'Roboto',
    fontWeight: '700',
  },
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
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'Roboto',
    padding: 20,
    marginTop: 20,
    alignSelf: 'center',
    backgroundColor: 'transparent',
  },
  phoneToolBar: {
    flex: 0.4,
    backgroundColor: 'rgba(0, 0, 0, 0.40)',
  },
  productsHeader: {
    flex: 1.6,
    backgroundColor: 'rgba(0, 0, 0, 0.30)',
    flexDirection: 'column',
  },
  productsList: {
    flex: 9,
    backgroundColor: 'white',
  },
  productList: {

  },
  productsHeaderTopSection: {
    flex: 1,
    flexDirection: 'row',
  },
  backIconContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonCoontainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    flex: 3,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    marginTop: 20,
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Roboto',
    fontWeight: '700',
    backgroundColor: 'transparent',
  },
  backText: {
    marginTop: 20,
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Roboto',
    fontWeight: '700',
    backgroundColor: 'transparent',
  },
  newProductContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  newProduct: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Roboto',
    fontWeight: '700',
    backgroundColor: 'transparent',
    alignSelf: 'center',
    alignItems: 'center',
  },
  backIcon: {
    marginTop: 20,
    width: 15,
    height: 15,
  },
  productsBarBottomSection: {
    flex: 1,
    flexDirection: 'row',
  },
});


class ProductsScreen extends React.Component {
  static navigationOptions = {
    drawerLabel: props => (
      <SideMenuItem
        {...props}
        title="Products"
        icon={require('../../assets/images/sidemenu/icon_appoint_menu.png')}
      />
    ),
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

    this.props.productsActions.setShowCategoryProducts(false);

    this.props.productsActions.getProducts().then((response) => {
      if (response.data.error) {
        this.goBack();
        alert(response.data.error.message);
      } else {
        const products = response.data.products;
        this.props.productsActions.setProducts(products);
        this.props.productsActions.setFilteredProducts(products);
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  state = {
    title: 'Products',
    showCancel: true,
    showArrow: false,
  }

  goBack = () => {
    if (this.props.productsState.showCategoryProducts) {
      this.props.productsActions.setFilteredProducts(this.props.productsState.products);
      this.props.productsActions.setShowCategoryProducts(false);
      this.setState({ title: 'Products', showCancel: true, showArrow: false });
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
    if (dismissOnSelect) { this.goBack(); }
  }

  filterProducts = (searchText) => {
    const productsCategories = JSON.parse(JSON.stringify(this.props.productsState.products));

    if (searchText && searchText.length > 0) {
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
    this.setState({ title: 'Products', showCancel: true, showArrow: false });
    this.props.productsActions.setShowCategoryProducts(false);
    this.filterProducts(searchText);
  }

  handlePressProductCategory = (item) => {
    this.setState({ title: item.name, showCancel: false, showArrow: true });
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

        <SalonSearchHeader
          hasFilter={false}
          containerStyle={{
            paddingHorizontal: 20,
          }}
          headerContainerStyle={{
            height: this.props.salonSearchHeaderState.showFilter ? 70 : 115,
          }}
          filterList={searchText => this.filterList(searchText)}
        >{<ProductsHeader
          title={this.state.title}
          goBack={this.goBack}
          showArrow={this.state.showArrow}
          showCancel={this.state.showCancel}
        />}
        </SalonSearchHeader>

        <View style={styles.productsList}>

          { (!this.props.productsState.showCategoryProducts
            && !this.props.salonSearchHeaderState.showFilter
            && this.props.productsState.filtered.length > 0) &&
            <ProductCategoryList
              handlePressProductCategory={this.handlePressProductCategory}
              productCategories={this.props.productsState.filtered}
            />
          }

          { (!this.props.productsState.showCategoryProducts
            && this.props.salonSearchHeaderState.showFilter
            && this.props.productsState.filtered.length > 0) &&
            <ProductList
              boldWords={this.props.salonSearchHeaderState.searchText}
              style={styles.productListContainer}
              products={this.props.productsState.filtered}
              onChangeProduct={onChangeProduct}
            />
          }

          { (this.props.productsState.showCategoryProducts
            && this.props.productsState.filtered.length > 0) &&
            <CategoryProductsList
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
