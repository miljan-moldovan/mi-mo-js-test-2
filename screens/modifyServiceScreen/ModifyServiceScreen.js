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
  InputSwitch,
  ServiceInput,
  ProviderInput,
  SectionDivider,
  PromotionInput,
  InputLabel,
} from '../../components/formHelpers';

import PromotionType from '../../constants/PromotionType';
import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import styles from './styles';

export default class ModifyServiceScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    // const canSave = params.canSave || false;
    const clientName = params.clientName || '';
    const canSave = true;
    return {
      tabBarVisible: false,
      headerTitle: (
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>
            {'serviceItem' in params ? 'Modify Service' : 'Add Service'}
          </Text>
          <Text style={styles.subTitleText}>
            {clientName}
          </Text>
        </View>
      ),
      headerLeft: (
        <SalonTouchableOpacity onPress={navigation.goBack}>
          <Text style={styles.leftButtonText}>Cancel</Text>
        </SalonTouchableOpacity>
      ),
      headerRight: (
        <SalonTouchableOpacity
          disabled={!canSave}
          onPress={() => params.handleSave()}
        >
          <Text style={[styles.rightButtonText, { color: canSave ? '#FFFFFF' : '#19428A' }]}>Done</Text>
        </SalonTouchableOpacity>
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
    const serviceItem = params.serviceItem || {};
    const service = get(serviceItem, 'service', null);
    const employee = get(serviceItem, 'employee', null);
    const promotion = get(serviceItem, 'promotion', null);
    const price = get(service, 'price', 0);
    const isProviderRequested = get(serviceItem, 'isProviderRequested', true);
    return {
      price,
      service: {
        ...service,
        name: get(service, 'serviceName', get(service, 'name', null)),
      },
      employee,
      promotion,
      isProviderRequested,
    };
  }

  getDiscountAmount = () => {
    const { promotion } = this.state;
    switch (get(promotion, 'promotionType', null)) {
      case PromotionType.ServiceProductPercentOff:
      case PromotionType.GiftCardPercentOff:
        return `${get(promotion, 'serviceDiscountAmount', 0)} %`;
      case PromotionType.ServiceProductDollarOff:
      case PromotionType.GiftCardDollarOff:
      case PromotionType.ServiceProductFixedPrice:
        return `$ ${get(promotion, 'serviceDiscountAmount', 0)}`;
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

  handleRemove = () => {
    const { onRemove = (itm => itm) } = this.props.navigation.state.params || {};
    onRemove();
    this.props.navigation.goBack();
  }

  handleSave = () => {
    const {
      service,
      employee,
      promotion,
      isProviderRequested,
    } = this.state;
    const { onSave = (itm => itm) } = this.props.navigation.state.params || {};
    onSave({
      service,
      employee,
      promotion,
      isProviderRequested,
    });
    this.props.navigation.goBack();
  }

  handleChangeEmployee = employee => this.setState({ employee }, this.validate)

  handleChangeService = service => this.setState({ service }, this.validate)

  handleChangePromotion = promotion => this.setState({ promotion }, this.validate)

  handleChangeRequested = isProviderRequested => this.setState({ isProviderRequested: !isProviderRequested })

  render() {
    const { navigation: { navigate } } = this.props;
    const {
      price,
      discount,
      service,
      employee,
      promotion,
      isProviderRequested,
    } = this.state;
    const isFirstAvailable = get(employee, 'isFirstAvailable', false);
    return (
      <View style={styles.container}>
        <InputGroup style={{ marginTop: 16 }}>
          <ServiceInput
            noPlaceholder
            navigate={navigate}
            selectedService={service}
            selectedProvider={employee}
            onChange={this.handleChangeService}
            headerProps={{ title: 'Services', ...this.cancelButton() }}
          />
          <InputDivider />
          <ProviderInput
            noPlaceholder
            filterByService
            showFirstAvailable
            label="Provider"
            avatarSize={20}
            navigate={navigate}
            style={styles.innerRow}
            iconStyle={styles.carretIcon}
            onChange={this.handleChangeEmployee}
            selectedService={service}
            selectedProvider={employee}
            headerProps={{ title: 'Providers', ...this.cancelButton() }}
          />
          {
            !isFirstAvailable ?
              <React.Fragment>
                <InputDivider />
                <InputSwitch
                  value={isProviderRequested}
                  onChange={this.handleChangeRequested}
                  text="Provider is requested?"
                />
              </React.Fragment> : null
          }
        </InputGroup>
        <SectionDivider />
        <InputGroup>
          <PromotionInput
            navigate={navigate}
            selectedPromotion={promotion}
            onChange={this.handleChangePromotion}
          />
          <InputDivider />
          <InputLabel label="Discount" value={this.getDiscountAmount()} />
          <InputLabel label="Price" value={`$ ${this.calculatePriceDiscount(promotion, 'serviceDiscountAmount', service.price || 0)}`} />
        </InputGroup>
        <SectionDivider />
        {
          this.canRemove &&
          <InputGroup>
            <SalonTouchableOpacity
              style={styles.removeButton}
              onPress={this.handleRemove}
            >
              <Text style={styles.removeButtonText}>Remove Service</Text>
            </SalonTouchableOpacity>
          </InputGroup>
        }
      </View>
    );
  }
}
