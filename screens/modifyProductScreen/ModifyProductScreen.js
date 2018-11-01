import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import {
  InputGroup,
  InputDivider,
  ProductInput,
  ProviderInput,
  SectionDivider,
  PromotionInput,
  InputLabel,
} from '../../components/formHelpers';
import PromotionType from '../../constants/PromotionType';
import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import styles from '../modifyServiceScreen/styles';
import LoadingOverlay from '../../components/LoadingOverlay';
import headerStyles from '../../constants/headerStyles';
import SalonHeader from '../../components/SalonHeader';

class ModifyProductScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    // const canSave = params.canSave || false;
    const clientName = params.clientName || '';
    const canSave = true;
    return {
      header: (
        <SalonHeader
          title={'productItem' in params ? 'Modify Product' : 'Add Product'}
          subTitle={clientName}
          headerLeft={(
            <SalonTouchableOpacity style={{ paddingLeft: 10 }} onPress={navigation.goBack}>
              <Text style={styles.leftButtonText}>Cancel</Text>
            </SalonTouchableOpacity>
          )}
          headerRight={(
            <SalonTouchableOpacity
              disabled={!canSave}
              style={{ paddingRight: 10 }}
              onPress={() => params.handleSave()}
            >
              <Text style={[styles.rightButtonText, { color: canSave ? '#FFFFFF' : '#19428A' }]}>Done</Text>
            </SalonTouchableOpacity>
          )}
        />
      ),
    };
  }

  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;
    this.state = this.getStateFromParams();
    this.props.navigation.setParams({ ...params, handleSave: this.handleSave });
  }

  get canRemove() {
    const params = this.props.navigation.state.params || {};
    return 'onRemove' in params;
  }

  getStateFromParams = () => {
    const params = this.props.navigation.state.params || {};
    const productItem = params.productItem || {};
    const product = get(productItem, 'product', null);
    const employee = get(productItem, 'employee', null);
    const promotion = get(productItem, 'promotion', null);
    return {
      product,
      employee,
      promotion,
    };
  }

  getDiscountAmount = () => {
    const { promotion } = this.state;
    switch (get(promotion, 'promotionType', null)) {
      case PromotionType.ServiceProductPercentOff:
      case PromotionType.GiftCardPercentOff:
        return `${get(promotion, 'retailDiscountAmount', 0)} %`;
      case PromotionType.ServiceProductDollarOff:
      case PromotionType.GiftCardDollarOff:
      case PromotionType.ServiceProductFixedPrice:
        return `$ ${get(promotion, 'retailDiscountAmount', 0)}`;
      default: return '';
    }
  }

  calculatePercentFromPrice = (price, percent) =>
    Number((percent ? price - percent / 100 * price : price).toFixed(2))

  calculatePriceDiscount = (promo, prop, price = null) => {
    if (price === null) { return 0; }

    switch (get(promo, 'promotionType', null)) {
      case PromotionType.ServiceProductPercentOff:
      case PromotionType.GiftCardPercentOff:
        return this.calculatePercentFromPrice(price, get(promo, prop, 0));
      case PromotionType.ServiceProductDollarOff:
      case PromotionType.GiftCardDollarOff:
        return price - get(promo, prop, 0);
      case PromotionType.ServiceProductFixedPrice:
        return get(promo, prop, 0);
      default: return price;
    }
  }

  cancelButton = () => ({
    leftButton: <Text style={styles.cancelButton}>Cancel</Text>,
    leftButtonOnPress: (navigation) => {
      navigation.goBack();
    },
  })

  handleChangeProduct = product => this.setState({ product })

  handleChangeEmployee = employee => this.setState({ employee })

  handleChangePromotion = promotion => this.setState({ promotion })

  handleRemove = () => {
    const { onRemove = (itm => itm) } = this.props.navigation.state.params || {};
    onRemove();
    this.props.navigation.goBack();
  }

  handleSave = () => {
    const {
      product,
      employee,
      promotion,
    } = this.state;
    if (!product || !employee) {
      return;
    }
    const { onSave = (itm => itm) } = this.props.navigation.state.params || {};
    onSave({
      product,
      employee,
      promotion,
    }, this.props.navigation.goBack);
  }

  render() {
    const {
      navigation: { navigate },
      queueDetailState: { isLoading },
    } = this.props;
    const {
      product,
      employee,
      promotion,
    } = this.state;
    const price = get(product, 'price', 0);
    const priceText = `$ ${this.calculatePriceDiscount(promotion, 'retailDiscountAmount', price)}`;
    return (
      <View style={styles.container}>
        {
          isLoading &&
          <LoadingOverlay />
        }
        <InputGroup style={styles.marginTop}>
          <ProductInput
            navigate={navigate}
            selectedProduct={product}
            onChange={this.handleChangeProduct}
            headerProps={{ title: 'Products', ...this.cancelButton() }}
          />
          <InputDivider />
          <ProviderInput
            mode="employees"
            navigate={navigate}
            placeholder={false}
            showFirstAvailable={false}
            selectedProvider={employee}
            onChange={this.handleChangeEmployee}
            headerProps={{ title: 'Providers', ...this.cancelButton() }}
          />
        </InputGroup>
        <SectionDivider />
        <InputGroup>
          <PromotionInput
            mode="product"
            navigate={navigate}
            selectedPromotion={promotion}
            onChange={this.handleChangePromotion}
          />
          <InputDivider />
          <InputLabel label="Discount" value={this.getDiscountAmount()} />
          <InputDivider />
          <InputLabel label="Price" value={priceText} />
        </InputGroup>
        <SectionDivider />
        {
          this.canRemove &&
          <InputGroup>
            <SalonTouchableOpacity
              style={styles.removeButton}
              onPress={this.handleRemove}
            >
              <Text style={styles.removeButtonText}>Remove Product</Text>
            </SalonTouchableOpacity>
          </InputGroup>
        }
      </View>
    );
  }
}
export default ModifyProductScreen;
