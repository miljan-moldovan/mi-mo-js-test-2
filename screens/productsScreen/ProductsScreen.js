import React from 'react';
import {
  Text,
  View,
  FlatList,
} from 'react-native';
import PropTypes from 'prop-types';
import { get, chain, isNaN, sortBy, isNumber } from 'lodash';

import Icon from '../../components/UI/Icon';
import WordHighlighter from '../../components/wordHighlighter';
import ListLetterFilter from '../../components/listLetterFilter';
import SalonSearchBar from '../../components/SalonSearchBar';
import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import Colors from '../../constants/Colors';
import styles from './styles';
import LoadingOverlay from '../../components/LoadingOverlay';

const ITEM_HEIGHT = 48; // 12 (paddingVertical) + (18 (lineHeight) * 2)

class ProductsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Products',
    headerLeft: (
      <SalonTouchableOpacity onPress={navigation.goBack}>
        <Text style={styles.headerButton}>Cancel</Text>
      </SalonTouchableOpacity>
    ),
  });

  constructor(props) {
    super(props);

    const { selectedProduct = null } = props.navigation.state.params || {};
    this.state = {
      searchText: '',
      selectedProduct,
    };
  }

  componentDidMount() {
    const {
      productsActions: {
        getProducts,
      },
    } = this.props;
    getProducts();
  }

  onChangeProduct = (item) => {
    const {
      dismissOnSelect,
      onChangeProduct = (itm => itm),
    } = this.props.navigation.state.params || {};
    onChangeProduct(item);
    if (dismissOnSelect) {
      this.props.navigation.goBack();
    }
  }

  onChangeSearchText = searchText => this.setState({ searchText })

  get currentData() {
    const {
      productsState: { products },
    } = this.props;
    const { searchText } = this.state;
    const sortByName = itm => get(itm, 'name', '').toLowerCase();
    const sorted = sortBy(products, sortByName);
    if (searchText !== '') {
      return sorted.filter(itm => get(itm, 'name', '').toLowerCase().indexOf(searchText.toLowerCase()) >= 0);
    }
    return sorted;
  }

  getItemLayout = (data, index) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index })

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

  renderItem = ({ item }) => {
    const { selectedProduct, searchText } = this.state;
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

  render() {
    const {
      searchText,
    } = this.state;
    const {
      productsState: { isLoading },
    } = this.props;
    return (
      <View style={[styles.container, styles.whiteBg]}>
        {
          isLoading &&
          <LoadingOverlay />
        }
        <SalonSearchBar
          marginVertical={0}
          searchText={searchText}
          placeHolderText="Search"
          searchIconPosition="left"
          borderColor="transparent"
          fontColor={Colors.defaultGrey}
          iconsColor={Colors.defaultGrey}
          onChangeText={this.onChangeSearchText}
          placeholderTextColor={Colors.defaultGrey}
          containerStyle={styles.searchBarContainer}
          backgroundColor="rgba(142, 142, 147, 0.24)"
        />
        <View style={[styles.container, styles.flexRow]}>
          <FlatList
            ref={(ref) => { this.listRef = ref; }}
            data={this.currentData}
            getItemLayout={this.getItemLayout}
            style={[styles.container, styles.whiteBg]}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderItem}
            ItemSeparatorComponent={this.renderSeparator}
          />
          <View style={styles.iconContainer}>
            <ListLetterFilter onPress={this.scrollToLetter} />
          </View>
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
};
export default ProductsScreen;
