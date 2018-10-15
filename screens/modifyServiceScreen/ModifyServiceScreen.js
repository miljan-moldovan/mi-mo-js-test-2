import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
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
import TrackRequestSwitch from '../../components/TrackRequestSwitch';

import { Services } from '../../utilities/apiWrapper';
import { showErrorAlert } from '../../actions/utils';

import PromotionType from '../../constants/PromotionType';
import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import styles from './styles';
import LoadingOverlay from '../../components/LoadingOverlay';

export default class ModifyServiceScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    const clientName = params.clientName || '';
    const canSave = get(params, 'canSave', false);
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
    const canSave = this.state.service && this.state.employee;
    this.props.navigation.setParams({ handleSave: this.handleSave, canSave });
  }

  componentDidMount() {
    this.getEmployeePrice();
  }


  componentWillUpdate(nextProps, nextState) {
    const canSave = nextState.service && nextState.employee;
    const { navigation } = nextProps;
    if (navigation.state.params.canSave !== canSave) {
      this.props.navigation.setParams({ handleSave: this.handleSave, canSave });
    }
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
    const price = get(serviceItem, 'price', 0);
    const isFirstAvailable = get(serviceItem, 'isFirstAvailable', false);
    const isProviderRequested = get(serviceItem, 'isProviderRequested', true);
    const isInService = get(params, 'isInService', false);

    return {
      isLoading: false,
      price,
      service,
      employee: isFirstAvailable ? {
        isFirstAvailable,
        name: 'First',
        lastName: 'Available',
      } : employee,
      promotion,
      isFirstAvailable,
      isProviderRequested,
      isInService,
    };
  }

  getEmployeePrice = () => {
    const { employee, service } = this.state;
    if (employee && service) {
      if (get(employee, 'isFirstAvailable', false)) {
        console.log(employee);
        this.setState({ price: get(service, 'price', 0) });
        return;
      }
      const employeeId = get(employee, 'id', false);
      const serviceId = get(service, 'id', false);
      if (employeeId && serviceId) {
        this.setState({ isLoading: true }, () => {
          Services.getServiceEmployeeCheck({ employeeId, serviceId })
            .then(result => this.setState({ isLoading: false, price: get(result, 'price', 0) }))
            .catch((error) => {
              showErrorAlert(error);
              this.setState({ isLoading: false });
            });
        });
      }
    }
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
      price,
      service,
      employee,
      promotion,
      isProviderRequested,
    } = this.state;
    const isFirstAvailable = get(employee, 'isFirstAvailable', false);
    const { onSave = (itm => itm) } = this.props.navigation.state.params || {};


    onSave({
      price,
      service,
      employee,
      promotion,
      isFirstAvailable,
      isProviderRequested,
    });
    this.props.navigation.goBack();
  }

  handleChangeEmployee = employee => {
    const canSave = this.state.service && employee;
    this.setState({ employee }, this.getEmployeePrice);
  }

  handleChangeService = service => this.setState({ service }, this.getEmployeePrice)

  handleChangePromotion = promotion => this.setState({ promotion }, this.getEmployeePrice)

  handleChangeRequested = (isProviderRequested) => {
    this.setState({ isProviderRequested });
  }

  render() {
    const { navigation: { navigate } } = this.props;
    const {
      price,
      isLoading,
      service,
      employee,
      promotion,
      isProviderRequested,
      isInService,
    } = this.state;
    const priceLabelValue = `$ ${this.calculatePriceDiscount(promotion, 'serviceDiscountAmount', price)}`;
    const isFirstAvailable = get(employee, 'isFirstAvailable', false);
    return (
      <View style={styles.container}>
        {
          isLoading &&
          <LoadingOverlay />
        }
        <InputGroup style={styles.marginTop}>
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
            queueList
            placeholder={false}
            filterByService
            showFirstAvailable={!isInService}
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
            employee ? (
              <TrackRequestSwitch
                onChange={this.handleChangeRequested}
                isFirstAvailable={isFirstAvailable}
                initialValue={isProviderRequested}
              />
            ) : null
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
          <InputLabel label="Price" value={priceLabelValue} />
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
