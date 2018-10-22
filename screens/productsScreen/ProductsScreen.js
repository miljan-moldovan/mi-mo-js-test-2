import React from 'react';
import {
  Text,
  View,
  FlatList,
  SectionList,
} from 'react-native';
import PropTypes from 'prop-types';
import { get, sortBy, isFunction, isNumber } from 'lodash';

import Icon from '../../components/UI/Icon';
import WordHighlighter from '../../components/wordHighlighter';
import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import SalonSearchHeader from '../../components/SalonSearchHeader';
import LoadingOverlay from '../../components/LoadingOverlay';
import Colors from '../../constants/Colors';
import styles from './styles';

const PRODUCT_ITEM_HEIGHT = 48; // 12 (paddingVertical) + (18 (lineHeight) * 2)
const CATEGORY_ITEM_HEIGHT = 24;

class ProductsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    const clearCategory = params.clearCategory || navigation.goBack;
    const selectedCategory = params.selectedCategory || null;
    const title = selectedCategory ? get(selectedCategory, 'name', 'Products') : 'Products';
    const leftButton = selectedCategory
      ? (
        <Icon
          name="angleLeft"
          color={Colors.white}
          size={24}
        />
      ) : (
        <Text style={styles.headerButton}>Cancel</Text>
      );
    const leftButtonOnPress = selectedCategory ? clearCategory : navigation.goBack;
    return {
      header: props => (
        <SalonSearchHeader
          title={title}
          hasFilter={false}
          leftButton={leftButton}
          lreftButtonOnPress={leftButtonOnPress}
          containerStyle={styles.headerContainer}
        />
      ),
    };
  };

  constructor(props) {
    super(props);

    const { selectedProduct = null } = props.navigation.state.params || {};
    this.state = {
      selectedProduct,
      selectedCategory: null,
    };
    props.salonSearchHeaderActions.setIgnoredNumberOfLetters(0);
    props.navigation.setParams({ clearCategory: this.clearCategory });
  }

  componentDidMount() {
    const {
      productsActions: {
        getProducts,
      },
    } = this.props;
    getProducts();
  }

  shouldComponentUpdate(nextProps) {
    return (
      nextProps.searchHeaderState.searchText.length === 0 ||
      nextProps.searchHeaderState.showFilter !== this.props.searchHeaderState.showFilter ||
      nextProps.searchHeaderState.searchText !== this.props.searchHeaderState.searchText ||
      nextProps.productsState.isLoading !== this.props.productsState.isLoading
    );
  }

  onChangeProduct = (item) => {
    const {
      dismissOnSelect,
      onChangeProduct = (itm => itm),
    } = get(this.props.navigation, 'state.params', {});
    onChangeProduct(item);
    if (dismissOnSelect) {
      this.props.navigation.goBack();
    }
  }

  onChangeCategory = (selectedCategory) => {
    this.setState({
      selectedCategory: get(selectedCategory, 'id', null),
    });
    this.props.navigation.setParams({ selectedCategory });
  }

  get currentData() {
    const {
      searchHeaderState: { searchText, showFilter },
      productsState: { products: categories },
    } = this.props;
    const { selectedCategory: categoryId } = this.state;
    const sortByName = itm => get(itm, 'name', '').toLowerCase();
    const selectedCategory = categories.find(itm => isNumber(categoryId) && get(itm, 'id', null) === categoryId);
    if (searchText.length > 0 || showFilter) {
      const filterFunc = itm => searchText === '' || get(itm, 'name', '').toLowerCase().indexOf(searchText.toLowerCase()) >= 0;
      return searchText === '' ? [] : categories.filter((cat) => {
        const productMatches = cat.inventoryItems.filter(filterFunc);
        return productMatches.length > 0;
      }).map(cat => ({
        data: sortBy(cat.inventoryItems.filter(filterFunc), sortByName),
        title: get(cat, 'name', 'Products'),
      }));
    }
    const currentData = selectedCategory
      ? get(selectedCategory, 'inventoryItems', [])
      : categories;
    const sorted = sortBy(currentData, sortByName);
    return sorted;
  }

  getItemLayout = (data, index) => {
    const { selectedCategory } = this.state;
    const {
      searchHeaderState: { searchText },
    } = this.props;
    const length = selectedCategory || searchText.length > 0 ?
      PRODUCT_ITEM_HEIGHT : CATEGORY_ITEM_HEIGHT;
    const offset = length * index;
    return { length, offset, index };
  }

  clearCategory = () => {
    this.onChangeCategory(null);
  }

  scrollToLetter = (letter) => {
    for (let i = 0; i <= this.currentData.length; i += 1) {
      const firstChar = get(this.currentData[i], 'name', '').toUpperCase().charAt(0);
      if (letter === '#' && !isNaN(Number(firstChar))) {
        this.listRef.scrollToIndex({ index: i });
        break;
      }
      if (firstChar === letter.toUpperCase()) {
        this.listRef.scrollToIndex({ index: i });
        break;
      }
    }
  }

  keyExtractor = item => get(item, 'id');

  renderSeparator = () => <View style={styles.itemSeparator} />

  renderEmptyListComponent = () => {
    const {
      productsState: { isLoading },
      searchHeaderState: { searchText, showFilter },
    } = this.props;
    if (isLoading) {
      return null;
    }
    const { selectedCategory } = this.state;
    const NoContent = ({ text }) => (
      <View style={styles.noContentContainer}>
        <Text style={styles.noContentText}>{text}</Text>
      </View>
    );
    if (searchText === '' && showFilter) {
      return <NoContent text="Start typing to search for products..." />;
    } else if (searchText.length >= 0 && showFilter) {
      return <NoContent text="No products matched your search" />;
    }
    return selectedCategory
      ? <NoContent text="No products found in category" />
      : <NoContent text="No products found" />;
  }

  renderCategoryItem = ({ item }) => {
    const { searchHeaderState: { searchText } } = this.props;
    const name = get(item, 'name', '');
    const onPress = () => this.onChangeCategory(item);
    return (
      <SalonTouchableOpacity
        onPress={onPress}
        style={styles.itemRow}
      >
        <WordHighlighter
          numberOfLines={1}
          highlight={searchText}
          highlightStyle={styles.highlightText}
          style={[styles.itemText, styles.container]}
        >
          {name}
        </WordHighlighter>
        <Icon name="angleRight" size={20} color={Colors.defaultGrey} style={styles.caretIcon} />
      </SalonTouchableOpacity>
    );
  }

  renderProductItem = ({ item }) => {
    const { selectedProduct } = this.state;
    const { searchHeaderState: { searchText } } = this.props;
    const isSelected = (
      isNumber(get(selectedProduct, 'id', null)) && isNumber(get(item, 'id', null))
      && item.id === selectedProduct.id
    );
    const name = get(item, 'name', '');
    const size = get(item, 'productSize', null);
    const price = get(item, 'price', 0);
    const selectedStyle = isSelected ? styles.selectedText : {};
    const icon = isSelected ? (
      <Icon
        size={14}
        type="solid"
        name="checkCircle"
        style={styles.iconStyle}
        color={Colors.selectedGreen}
      />
    ) : null;
    const onPress = () => this.onChangeProduct(item);
    return (
      <SalonTouchableOpacity
        onPress={onPress}
        style={styles.itemRow}
      >
        <View style={styles.container}>
          <WordHighlighter
            numberOfLines={1}
            highlight={searchText}
            highlightStyle={styles.highlightText}
            style={[styles.itemText, styles.container, selectedStyle]}
          >
            {name}
          </WordHighlighter>
          <View style={[styles.container, styles.info]}>
            {
              size &&
              <Text style={styles.sizeText}>{size}</Text>
            }
            <Text style={styles.priceText}>{`$ ${price}`}</Text>
          </View>
        </View>
        <View style={styles.iconContainer}>
          {icon}
        </View>
      </SalonTouchableOpacity>
    );
  }

  renderSectionHeader = ({ section: { title } }) => (
    <View style={styles.sectionHeaderContainer}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  )

  renderList = () => {
    const {
      selectedCategory,
    } = this.state;
    const {
      searchHeaderState: { searchText },
    } = this.props;
    if (!this.currentData.length) {
      return this.renderEmptyListComponent();
    }
    if (searchText.length > 0) {
      return (
        <SectionList
          ref={(ref) => { this.listRef = ref; }}
          sections={this.currentData}
          getItemLayout={this.getItemLayout}
          style={styles.listContainer}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderProductItem}
          ItemSeparatorComponent={this.renderSeparator}
          renderSectionHeader={this.renderSectionHeader}
        />
      );
    }
    return selectedCategory ?
      <FlatList
        ref={(ref) => { this.listRef = ref; }}
        data={this.currentData}
        getItemLayout={this.getItemLayout}
        style={styles.listContainer}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderProductItem}
        ItemSeparatorComponent={this.renderSeparator}
      /> :
      <FlatList
        ref={(ref) => { this.listRef = ref; }}
        data={this.currentData}
        getItemLayout={this.getItemLayout}
        style={styles.listContainer}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderCategoryItem}
        ItemSeparatorComponent={this.renderSeparator}
      />;
  }

  render() {
    const {
      productsState: { isLoading },
    } = this.props;
    return (
      <View style={styles.listContainer}>
        {
          isLoading &&
          <LoadingOverlay />
        }
        <View style={[styles.container, styles.flexRow]}>
          {
            this.renderList()
          }
        </View>
      </View>
    );
  }
}
ProductsScreen.propTypes = {
  productsActions: PropTypes.shape({
    getProducts: PropTypes.func,
  }).isRequired,
  productsState: PropTypes.shape({
    isLoading: PropTypes.bool,
    products: PropTypes.array,
  }).isRequired,
  salonSearchHeaderActions: PropTypes.shape({
    setSearchText: PropTypes.func,
    setIgnoredNumberOfLetters: PropTypes.func,
  }).isRequired,
  searchHeaderState: PropTypes.shape({
    showFilter: PropTypes.bool,
    searchText: PropTypes.string,
  }).isRequired,
};
export default ProductsScreen;
