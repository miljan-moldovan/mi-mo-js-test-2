import React from 'react';
import {
  Text,
  View,
  FlatList,
} from 'react-native';
import PropTypes from 'prop-types';
import { get, isNumber } from 'lodash';
import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import Icon from '../../components/UI/Icon';
import {
  InputButton, InputDivider,
} from '../../components/formHelpers';

import Colors from '../../constants/Colors';
import styles from './styles';

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

  get currentData() {
    const {
      productsState: { products },
    } = this.props;
    return products;
  }

  keyExtractor = item => get(item, 'id');

  renderSeparator = () => <View style={styles.itemSeparator} />

  renderItem = ({ item }) => {
    const { selectedProduct } = this.state;
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
        type="solid"
        name="checkCircle"
        color={Colors.selectedGreen}
        size={14}
      />
    ) : null;
    const onPress = () => this.onChangeProduct(item);
    return (
      <SalonTouchableOpacity
        onPress={onPress}
        style={styles.itemRow}
      >
        <View style={[styles.container, styles.flexRow]}>
          <Text numberOfLines={1} style={[styles.itemText, styles.container, selectedStyle]}>{name}</Text>
          <View style={styles.info}>
            {
              size &&
              <Text style={styles.sizeText}>{size}</Text>
            }
            <Text style={styles.priceText}>{`$ ${price}`}</Text>
          </View>
        </View>
        {icon}
      </SalonTouchableOpacity>
    );
  }

  render() {
    return (
      <View style={[styles.container, styles.whiteBg]}>
        <FlatList
          data={this.currentData}
          style={[styles.container, styles.whiteBg]}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          ItemSeparatorComponent={this.renderSeparator}
        />
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
