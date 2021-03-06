import * as React from 'react';
import { View, ScrollView, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import PropTypes from 'prop-types';
import moment from 'moment';
import { get, includes, cloneDeep } from 'lodash';
import uuid from 'uuid/v4';

import {
  QUEUE_ITEM_FINISHED,
  QUEUE_ITEM_RETURNING,
  QUEUE_ITEM_NOT_ARRIVED,
} from '../../../../constants/QueueStatus';
import queueDetailActions from '../../../../redux/actions/queueDetail';

import CircularCountdown from '../../../../components/CircularCountdown';
import ServiceIcons from '../../../../components/ServiceIcons';
import SalonCard from '../../../../components/SalonCard';
import {
  InputButton,
  SectionDivider,
  ClientInput,
} from '../../../../components/formHelpers';
import { SalonFixedBottom } from '../../../../components/SalonBtnFixedBottom';
import SalonTouchableOpacity
  from '../../../../components/SalonTouchableOpacity';
import QueueTimeNote from '../../../queueScreen/queueTimeNote';
import Icon from '@/components/common/Icon';
import StatusEnum from '../../../../constants/Status';
import QueueTypes from '../../../../constants/QueueTypes';
import PromotionType from '../../../../constants/PromotionType';
import { ServiceCard, ProductCard } from '../Cards';
import styles from './styles';
import LoadingOverlay from '../../../../components/LoadingOverlay';
import Colors from '../../../../constants/Colors';

const CircularIcon = props => (
  <View
    style={[
      {
        height: props.size,
        width: props.size,
        borderRadius: props.size / 2,
        backgroundColor: props.backgroundColor,
        alignItems: 'center',
        justifyContent: 'center',
      },
      props.style,
    ]}
  >
    <FontAwesome
      style={{
        color: props.color,
        fontSize: props.iconSize,
      }}
    >
      {Icons[props.icon]}
    </FontAwesome>
  </View>
);
CircularIcon.propTypes = {
  size: PropTypes.number,
  backgroundColor: PropTypes.string,
  color: PropTypes.string,
  iconSize: PropTypes.number,
  icon: PropTypes.string,
};
CircularIcon.defaultProps = {
  size: 22,
  backgroundColor: '#115ECD',
  color: 'white',
  iconSize: 16,
  icon: 'plus',
};

export const AddButton = props => (
  <SalonTouchableOpacity
    disabled={props.disabled}
    onPress={props.onPress}
    style={[
      {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingHorizontal: 12,
        paddingTop: 12,
      },
      props.style,
    ]}
  >
    {
      props.isLoading ?
        (
          <ActivityIndicator style={props.iconStyle} />
        )
        :
        (
          <CircularIcon style={props.iconStyle} />
        )
    }
    <Text style={styles.addButtonText}> {props.title}</Text>
  </SalonTouchableOpacity>
);
AddButton.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

const BottomButton = props => (
  <SalonTouchableOpacity
    style={styles.bottomButtonWrapper}
    onPress={props.onPress}
    disabled={props.disabled}
  >
    <Icon
      style={{ marginTop: 2 }}
      name={props.icon}
      size={15}
      color={props.disabled ? '#4D5067' : '#FFFFFF'}
      type="solid"
    />
    <Text
      style={[
        styles.bottomButtonText,
        { color: props.disabled ? '#4D5067' : '#FFFFFF' },
      ]}
    >
      {props.title}
    </Text>
  </SalonTouchableOpacity>
);

class AppointmentDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.getStateFromProps(props);
  }

  componentWillReceiveProps(nextProps) {
    const { queueDetailState: { isLoading: nextIsLoading } } = nextProps;
    const { queueDetailState: { isLoading: prevIsLoading } } = this.props;
    if (nextIsLoading !== prevIsLoading) {
      this.setState({ ...this.getStateFromProps(nextProps) });
    }
  }

  get totalPrice() {
    const { serviceItems, productItems } = this.state;
    const servicesTotal = serviceItems.reduce((total, itm) => {
      const promo = get(itm, 'promotion', null);
      const price = get(itm.service || {}, 'price', 0);
      if (promo) {
        return (
          total +
          this.calculatePriceDiscount(promo, 'serviceDiscountAmount', price)
        );
      }
      return total + price;
    }, 0);
    const productsTotal = productItems.reduce((total, itm) => {
      const promo = get(itm, 'promotion', null);
      const price = get(itm.product || {}, 'price', 0);
      if (promo) {
        return (
          total +
          this.calculatePriceDiscount(promo, 'retailDiscountAmount', price)
        );
      }
      return total + price;
    }, 0);
    return Number(servicesTotal + productsTotal).toFixed(2);
  }

  getStateFromProps = props => {
    const { queueDetailState: { appointment } } = props;
    const client = get(appointment, 'client', null);
    const services = get(appointment, 'services', []);
    const products = get(appointment, 'products', []);
    const productItems = products.map(product => ({
      itemId: uuid(),
      id: get(product, 'product.id', null),
      isDeleted: get(product, 'isDeleted', false),
      product: get(product, 'product', null),
      employee: get(product, 'employee', null),
      promotion: get(product, 'promotion', null),
    }));
    const serviceItems = services.map(service => ({
      itemId: uuid(),
      id: get(service, 'id', null),
      price: get(service, 'priceEntered', get(service, 'price', 0)),
      service: {
        id: get(service, 'serviceId', null),
        name: get(service, 'serviceName', ''),
        price: get(service, 'price', 0),
      },
      isDeleted: get(service, 'isDeleted', false),
      isProviderRequested: get(service, 'isProviderRequested', false),
      employee: service.isFirstAvailable
        ? {
          name: 'First',
          lastName: 'Available',
          isFirstAvailable: true,
        }
        : get(service, 'employee', null),
      isFirstAvailable: service.isFirstAvailable,
      promotion: get(service, 'promotion', null),
    }));
    return {
      client,
      appointment,
      serviceItems,
      productItems,
    };
  };

  getGroupLeaderName = item => {
    const { groups } = this.props;
    if (groups && groups[item.groupId]) {
      return groups[item.groupId].groupLeadName;
    }
    return 's';
  };

  getLabel = () => {
    const { getLabel = null } = this.props.navigation.state.params || {};
    return getLabel(styles.circularCountdown);
  };

  getDiscountAmount = promotion => {
    switch (get(promotion, 'promotionType', null)) {
      case PromotionType.ServiceProductPercentOff:
      case PromotionType.GiftCardPercentOff:
        return `${get(promotion, 'prod', 0)} %`;
      case PromotionType.ServiceProductDollarOff:
      case PromotionType.GiftCardDollarOff:
      case PromotionType.ServiceProductFixedPrice:
        return `$ ${get(promotion, 'prod', 0)}`;
      default:
        return '';
    }
  };

  addServiceItem = (
    {
      price,
      service,
      employee,
      promotion,
      isFirstAvailable,
      isProviderRequested,
    },
    onSuccess,
    onFailed,
  ) => {
    const serviceItems = cloneDeep(this.state.serviceItems);
    // const price = get(service, 'price', 0);
    serviceItems.push({
      itemId: uuid(),
      price,
      service,
      employee,
      promotion,
      isFirstAvailable,
      isProviderRequested,
    });
    return this.setState({ serviceItems }, () =>
      this.updateQueue(onSuccess, onFailed),
    );
  };

  addProductItem = ({ product, employee, promotion }, onSuccess, onFailed) => {
    const productItems = cloneDeep(this.state.productItems);
    productItems.push({
      itemId: uuid(),
      product,
      employee,
      promotion,
    });
    this.setState({ productItems }, () =>
      this.updateQueue(onSuccess, onFailed),
    );
  };

  calculatePercentFromPrice = (price, percent) =>
    Number((percent ? price - percent / 100 * price : price).toFixed(2));

  calculatePriceDiscount = (promo, prop, price = null) => {
    if (price === null) {
      return 0;
    }

    switch (get(promo, 'promotionType', null)) {
      case PromotionType.ServiceProductPercentOff:
      case PromotionType.GiftCardPercentOff:
        return this.calculatePercentFromPrice(price, get(promo, prop, 0));
      case PromotionType.ServiceProductDollarOff:
      case PromotionType.GiftCardDollarOff:
        return price - get(promo, prop, 0);
      case PromotionType.ServiceProductFixedPrice:
        return get(promo, prop, 0);
      default:
        return price;
    }
  };

  cancelButton = () => ({
    leftButton: <Text style={styles.headerButton}>Cancel</Text>,
    leftButtonOnPress: navigation => navigation.goBack(),
  });

  handleChangeClient = client => {
    this.props.onChangeClient(client);
    this.setState({ client }, this.updateQueue);
  };

  handleAddService = () => {
    const { client } = this.state;
    const clientName = `${get(client, 'name', '')} ${get(client, 'lastName', '')}`;
    this.props.navigation.navigate('Services', {
      mode: 'queue',
      onChangeWithNavigation: (service, serviceNav) => {
        serviceNav.navigate('Providers', {
          selectedService: service,
          showFirstAvailable: !!this.props.isWaiting,
          checkProviderStatus: true,
          mode: 'queue',
          headerProps: { title: 'Providers', ...this.cancelButton() },
          onChangeWithNavigation: (employee, employeeNav) => {
            employeeNav.goBack();
            serviceNav.goBack();
            const isFirstAvailable = get(employee, 'isFirstAvailable', false);
            const price = get(service, 'price', 0);
            const serviceItem = {
              service,
              employee,
              price,
              isFirstAvailable,
              isProviderRequested: !isFirstAvailable,
            };
            this.props.navigation.navigate('Service', {
              clientName,
              serviceItem,
              dismissOnSelect: true,
              updateQueue: this.updateQueue,
              isInService: !this.props.isWaiting,
              onSave: (data, onSuccess = false, onFailed = false) =>
                this.addServiceItem(data, onSuccess, onFailed),
            });
          },
        });
      },
      headerProps: {
        title: 'Services',
        rightButton: null,
        rightButtonOnPress: navigation => null,
        ...this.cancelButton(),
      },
    });
  };

  handlePressService = serviceItem => {
    const { client } = this.state;
    const clientName = `${get(client, 'name', '')} ${get(client, 'lastName', '')}`;
    this.props.navigation.navigate('Services', {
      mode: 'queue',
      selectedService: get(serviceItem, 'service', null),
      onChangeWithNavigation: (service, serviceNav) => {
        serviceNav.navigate('Providers', {
          selectedService: service,
          selectedProvider: get(serviceItem, 'employee', null),
          showFirstAvailable: !!this.props.isWaiting,
          checkProviderStatus: true,
          mode: 'queue',
          headerProps: { title: 'Providers', ...this.cancelButton() },
          onChangeWithNavigation: (employee, employeeNav) => {
            employeeNav.goBack();
            serviceNav.goBack();
            const isFirstAvailable = get(employee, 'isFirstAvailable', false);
            const price = get(service, 'price', 0);
            const newServiceItem = {
              ...serviceItem,
              service,
              employee,
              price,
              isFirstAvailable,
              isProviderRequested: isFirstAvailable ||
                get(serviceItem, 'isProviderRequested', false),
            };
            this.props.navigation.navigate('Service', {
              clientName,
              serviceItem: newServiceItem,
              dismissOnSelect: true,
              onSave: (data, onSuccess, onFailed) =>
                this.updateServiceItem(
                  serviceItem.itemId,
                  data,
                  onSuccess,
                  onFailed,
                ),
              onRemove: () => this.removeServiceItem(serviceItem.itemId),
              updateQueue: this.updateQueue,
            });
          },
        });
      },
      headerProps: {
        title: 'Services',
        rightButton: null,
        rightButtonOnPress: navigation => null,
        ...this.cancelButton(),
      },
    });
  };

  handleAddProduct = () => {
    const { client } = this.state;
    const clientName = `${get(client, 'name', '')} ${get(client, 'lastName', '')}`;
    this.props.navigation.navigate('Products', {
      onChangeWithNavigation: (product, productsNav) => {
        productsNav.navigate('Providers', {
          showFirstAvailable: false,
          checkProviderStatus: true,
          mode: 'employees',
          onChangeWithNavigation: (employee, employeeNav) => {
            employeeNav.goBack();
            productsNav.goBack();
            const productItem = {
              product,
              employee,
            };
            this.props.navigation.navigate('Product', {
              clientName,
              productItem,
              dismissOnSelect: true,
              updateQueue: this.updateQueue,
              isInService: !this.props.isWaiting,
              onSave: (data, onSuccess, onFailed) =>
                this.addProductItem(data, onSuccess, onFailed),
            });
          },
        });
      },
    });
  };

  handlePressCheckOut = () => {
    const {
      navigation: { goBack },
      onPressSummary: { checkOut },
      queueDetailState: { appointment },
    } = this.props;
    checkOut(get(appointment, 'id', null));
    goBack();
  };

  handlePressProduct = productItem => {
    const { client } = this.state;
    const clientName = `${get(client, 'name', '')} ${get(client, 'lastName', '')}`;
    this.props.navigation.navigate('Products', {
      onChangeWithNavigation: (product, productsNav) => {
        productsNav.navigate('Providers', {
          showFirstAvailable: false,
          checkProviderStatus: true,
          mode: 'employees',
          onChangeWithNavigation: (employee, employeeNav) => {
            employeeNav.goBack();
            productsNav.goBack();
            this.props.navigation.navigate('Product', {
              clientName,
              productItem: {
                ...productItem,
                product,
                employee,
              },
              dismissOnSelect: true,
              updateQueue: this.updateQueue,
              isInService: !this.props.isWaiting,
              onSave: (data, onSuccess, onFailed) =>
                this.updateProductItem(
                  productItem.itemId,
                  data,
                  onSuccess,
                  onFailed,
                ),
              onRemove: () => this.removeProductItem(productItem.itemId),
            });
          },
        });
      },
    });
  };

  updateServiceItem = (id, data, onSuccess, onFailed) => {
    const serviceItems = cloneDeep(this.state.serviceItems);
    const index = serviceItems.findIndex(itm => itm.itemId === id);
    serviceItems.splice(index, 1, {
      itemId: id,
      ...serviceItems[index],
      ...data,
    });
    return this.setState({ serviceItems }, () =>
      this.updateQueue(onSuccess, onFailed),
    );
  };

  updateProductItem = (id, data, onSuccess, onFailed) => {
    const productItems = cloneDeep(this.state.productItems);
    const index = productItems.findIndex(itm => itm.itemId === id);
    productItems.splice(index, 1, {
      itemId: id,
      ...productItems[index],
      ...data,
    });
    this.setState({ productItems }, () =>
      this.updateQueue(onSuccess, onFailed),
    );
  };

  removeServiceItem = (id, onSuccess, onFailed) => {
    const newServiceItems = cloneDeep(this.state.serviceItems);
    const index = newServiceItems.findIndex(itm => itm.itemId === id);
    newServiceItems.splice(index, 1);
    this.setState({ serviceItems: newServiceItems }, () =>
      this.updateQueue(onSuccess, onFailed),
    );
  };

  removeProductItem = (id, onSuccess, onFailed) => {
    const productItems = cloneDeep(this.state.productItems);
    const index = productItems.findIndex(itm => itm.itemId === id);
    productItems.splice(index, 1);
    this.setState({ productItems }, () =>
      this.updateQueue(onSuccess, onFailed),
    );
  };

  updateQueue = (onSuccess = false, onFailed = false) => {
    const { client, serviceItems, productItems } = this.state;
    const clientId = get(client, 'id', null);
    const services = serviceItems.map(itm => this.serializeServiceItem(itm));
    const products = productItems.map(itm => this.serializeProductItem(itm));
    this.props.queueDetailActions.updateAppointment(
      clientId,
      services,
      products,
      onSuccess,
      onFailed,
    );
  };

  serializeServiceItem = serviceItem => {
    const {
      price: priceEntered,
      service,
      employee,
      promotion,
      isFirstAvailable,
      isProviderRequested,
    } = serviceItem;
    const promotionCode = get(promotion, 'promotionCode', null);
    return {
      priceEntered,
      promotionCode,
      isFirstAvailable,
      isProviderRequested: isFirstAvailable ? false : isProviderRequested,
      serviceId: get(service, 'id', null),
      employeeId: isFirstAvailable ? null : get(employee, 'id', null),
    };
  };

  serializeProductItem = productItem => {
    const {
      product,
      employee,
      promotion,
    } = productItem;
    const promotionCode = get(promotion, 'promotionCode', null);
    const item = {
      inventoryItemId: get(product, 'id', null),
      employeeId: get(employee, 'id', null),
      promotionCode,
    };
    return item;
  };

  renderBtnContainer = () => {
    let isActiveCheckin = false;
    let isDisabledReturnLater;
    let returned;
    let isActiveWalkOut;
    let isActiveFinish;
    let isActiveWaiting = true;
    let isAppointment = true;
    let isActiveUnCheckin = false;
    let isDisabledStart = true;

    const { queueDetailState: { appointment } } = this.props;

    if (appointment) {
      returned = appointment.status === StatusEnum.returningLater;
      isActiveWalkOut = !(appointment.queueType === QueueTypes.PosAppointment &&
        !(appointment.status === StatusEnum.checkedIn));

      isAppointment = appointment.queueType === QueueTypes.PosAppointment;

      if (appointment.status === StatusEnum.notArrived) {
        isDisabledReturnLater = true;
        isActiveCheckin = true;
      }

      if (
        appointment.status === StatusEnum.checkedIn ||
        appointment.status === StatusEnum.notArrived ||
        appointment.status === StatusEnum.returningLater
      ) {
        isDisabledStart = false;
      }

      if (isAppointment && appointment.status === StatusEnum.checkedIn) {
        isActiveUnCheckin = true;
      }

      if (appointment.status === StatusEnum.inService) {
        isActiveWaiting = true;
        isActiveFinish = true;
      } else {
        isActiveWaiting = false;
        isActiveFinish = false;
      }
    }

    const otherBtnStyle = styles.btnBottom;

    if (this.props.isWaiting) {
      return (
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          {isActiveUnCheckin
            ? <BottomButton
              icon="check"
              onPress={() => {
                this.props.onPressSummary.checkIn(isActiveCheckin);
                this.props.navigation.goBack();
              }}
              title="Uncheck In"
            />
            : <BottomButton
              disabled={!isActiveCheckin}
              icon="check"
              onPress={() => {
                this.props.onPressSummary.checkIn(isActiveCheckin);
                this.props.navigation.goBack();
              }}
              title="Check In"
            />}
          <BottomButton
            disabled={false}
            icon="signOut"
            onPress={() => {
              this.props.onPressSummary.walkOut(isActiveWalkOut);
            }}
            title={isActiveWalkOut ? 'Walk-out' : 'No Show'}
          />
          <BottomButton
            disabled={isDisabledReturnLater}
            icon="history"
            onPress={() => {
              this.props.onPressSummary.returning(returned);
              this.props.navigation.goBack();
            }}
            title={returned ? 'Returned' : 'Return later'}
          />
          <BottomButton
            disabled={isDisabledStart}
            icon="play"
            onPress={() => {
              this.props.onPressSummary.toService();
              this.props.navigation.goBack();
            }}
            title="To Service"
          />
        </View>
      );
    }
    return (
      <View
        style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}
      >
        <BottomButton
          disabled={!isActiveWaiting}
          icon="hourglassHalf"
          onPress={() => {
            this.props.onPressSummary.toWaiting();
            this.props.navigation.goBack();
          }}
          title="To Waiting"
        />
        <BottomButton
          disabled={false}
          icon="undo"
          onPress={() => {
            this.props.onPressSummary.rebook();
            this.props.navigation.goBack();
          }}
          title="Rebook"
        />
        <BottomButton
          disabled={false}
          icon="checkSquare"
          onPress={() => {
            this.props.onPressSummary.finish(isActiveFinish);
            this.props.navigation.goBack();
          }}
          title={isActiveFinish ? 'Finish' : 'Undo finish'}
        />
        <BottomButton
          disabled={false}
          icon="dollar"
          onPress={this.handlePressCheckOut}
          title="Checkout"
        />
      </View>
    );
  };

  render() {
    const { client, serviceItems, productItems } = this.state;
    const { queueDetailState: { isLoading, appointment } } = this.props;
    const badgeData = get(appointment, 'badgeData', []);

    const label = this.getLabel();
    const groupLeaderName = this.getGroupLeaderName(appointment);
    const color = appointment && appointment.groupId
      ? this.props.queueState.groups[appointment.groupId].color
      : null;

    return (
      <View style={[styles.container]}>
        {isLoading || !appointment
          ? <LoadingOverlay />
          : <React.Fragment>
            <ScrollView style={{ marginBottom: 44 }}>
              <View style={styles.infoContainer}>
                <View
                  style={{
                    paddingBottom: 19,
                    flex: 1.5,
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                  }}
                >
                  <Text style={styles.infoTitleText}>Queue Appointment</Text>
                  <QueueTimeNote
                    type="long"
                    containerStyles={{ marginTop: 3 }}
                    item={appointment}
                  />
                  <View style={{ alignSelf: 'flex-start' }}>
                    <ServiceIcons
                      item={appointment}
                      badgeData={badgeData}
                      hideInitials
                      align="flex-start"
                      direction="column"
                      groupLeaderName={groupLeaderName}
                      color={color}
                    />
                  </View>
                </View>

                <View style={styles.itemIcons}>
                  {label}
                </View>
              </View>
              <View style={styles.content}>
                <Text style={styles.titleText}>Client</Text>
                <SalonCard
                  backgroundColor="white"
                  containerStyles={styles.clientCardContainer}
                  bodyStyles={styles.clientCardBody}
                  bodyChildren={
                    <ClientInput
                      label={false}
                      placeholder="Select Client"
                      navigate={this.props.navigation.navigate}
                      selectedClient={client}
                      style={styles.clientCardInput}
                      onChange={this.handleChangeClient}
                      headerProps={{
                        title: 'Clients',
                        ...this.cancelButton(),
                      }}
                    />
                  }
                />
                <Text style={styles.titleText}>Services</Text>
                {serviceItems.map(item => (
                  <ServiceCard
                    key={item.itemId}
                    service={item.service}
                    employee={item.employee}
                    promotion={item.promotion}
                    isProviderRequested={item.isProviderRequested}
                    onPress={() => this.handlePressService(item)}
                    discount={this.getDiscountAmount(item.promotion)}
                    price={item.price.toFixed(2)}
                    withDiscount={this.calculatePriceDiscount(
                      item.promotion,
                      'serviceDiscountAmount',
                      item.price,
                    ).toFixed(2)}
                  />
                ))}
                <AddButton
                  onPress={this.handleAddService}
                  title="Add Service"
                />
                <Text style={styles.titleText}>Products</Text>
                {productItems.map((item, index) => (
                  <ProductCard
                    key={item.itemId}
                    onPress={() => this.handlePressProduct(item)}
                    product={item.product}
                    employee={item.employee}
                    promotion={item.promotion}
                    isProviderRequested={item.isProviderRequested}
                    price={this.calculatePriceDiscount(
                      item.promotion,
                      'retailDiscountAmount',
                      item.product.price,
                    ).toFixed(2)}
                  />
                ))}
                <AddButton
                  onPress={this.handleAddProduct}
                  title="Add Product"
                />
                {
                  // <View style={{ marginTop: 10, alignSelf: 'stretch', paddingHorizontal: 8 }}>
                  // <InputButton
                  //   style={{
                  //     paddingTop: 22,
                  //     paddingRight: 5,
                  //   }}
                  //   iconStyle={{
                  //     fontSize: 22,
                  //     color: '#727A8F',
                  //     paddingTop: 12,
                  //   }}
                  //   labelStyle={{
                  //     color: '#4D5067',
                  //     fontSize: 14,
                  //     fontWeight: '500',
                  //   }}
                  //   label="Recommendations"
                  //   onPress={() => {
                  //     this.props.navigation.navigate('Recommendations');
                  //   }}
                  // />
                  // <SectionDivider style={{
                  //   borderBottomWidth: StyleSheet.hairlineWidth,
                  //   borderBottomColor: '#C0C1C6',
                  // }}
                  // />
                  // </View>
                }
                <View style={styles.totalContainer}>
                  <Text style={styles.totalLabel}>TOTAL</Text>
                  <Text
                    style={styles.totalAmount}
                  >{`$ ${this.totalPrice}`}</Text>
                </View>
              </View>
            </ScrollView>
            <SalonFixedBottom
              backgroundColor="#727A8F"
              rootStyle={styles.bottomButtonsRoot}
              containerStyle={styles.bottomButtonsContainer}
            >
              {this.renderBtnContainer()}
            </SalonFixedBottom>
          </React.Fragment>}
      </View>
    );
  }
}

AppointmentDetails.propTypes = {
  navigation: PropTypes.func.isRequired,
  isWaiting: PropTypes.any.isRequired,
  onPressSummary: PropTypes.any.isRequired,
  onChangeClient: PropTypes.func.isRequired,
  queueDetailState: PropTypes.shape({
    isLoading: PropTypes.bool,
    appointment: PropTypes.oneOfType([PropTypes.any, null]),
  }).isRequired,
  queueDetailActions: PropTypes.shape({
    updateAppointment: PropTypes.func,
  }).isRequired,
};
AppointmentDetails.defaultProps = {};

const mapStateToProps = state => ({
  queueDetailState: state.queueDetailReducer,
});
const mapDispatchToProps = dispatch => ({
  queueDetailActions: bindActionCreators({ ...queueDetailActions }, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(
  AppointmentDetails,
);
