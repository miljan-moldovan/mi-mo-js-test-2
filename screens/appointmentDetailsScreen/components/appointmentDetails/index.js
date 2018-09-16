import React from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
} from 'react-native';
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
import queueDetailActions from '../../../../actions/queueDetail';

import CircularCountdown from '../../../../components/CircularCountdown';
import ServiceIcons from '../../../../components/ServiceIcons';
import SalonCard from '../../../../components/SalonCard';
import {
  InputButton,
  SectionDivider,
  ClientInput,
} from '../../../../components/formHelpers';
import { SalonFixedBottom } from '../../../../components/SalonBtnFixedBottom';
import SalonTouchableOpacity from '../../../../components/SalonTouchableOpacity';
import QueueTimeNote from '../../../queueScreen/queueTimeNote';
import Icon from '../../../../components/UI/Icon';
import StatusEnum from '../../../../constants/Status';
import QueueTypes from '../../../../constants/QueueTypes';
import PromotionType from '../../../../constants/PromotionType';
import { ServiceCard, ProductCard } from '../Cards';
import styles from './styles';
import LoadingOverlay from '../../../../components/LoadingOverlay';


const CircularIcon = props => (
  <View style={[{
    height: props.size,
    width: props.size,
    borderRadius: props.size / 2,
    backgroundColor: props.backgroundColor,
    alignItems: 'center',
    justifyContent: 'center',
  }, props.style]}
  >
    <FontAwesome style={{
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
    onPress={props.onPress}
    style={[{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingHorizontal: 12,
      paddingTop: 12,
    }, props.style]}
  >
    <CircularIcon style={props.iconStyle} />
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
    <Icon style={{ marginTop: 2 }} name={props.icon} size={15} color={props.disabled ? '#4D5067' : '#FFFFFF'} type="solid" />
    <Text style={[styles.bottomButtonText, { color: props.disabled ? '#4D5067' : '#FFFFFF' }]}>{props.title}</Text>
  </SalonTouchableOpacity>
);

class AppointmentDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.getStateFromProps(props);
  }

  componentWillReceiveProps(nextProps) {
    const {
      queueDetailState: { appointment: newAppt },
    } = nextProps;
    const {
      queueDetailState: { appointment: currentAppt },
    } = this.props;
    if (
      newAppt !== currentAppt ||
      get(newAppt, 'id', null) !== get(currentAppt, 'id', null)
    ) {
      // debugger //eslint-disable-line
      this.setState({ ...this.getStateFromProps(nextProps) });
    }
  }

  get totalPrice() {
    const { serviceItems, productItems } = this.state;
    const servicesTotal = serviceItems.reduce((total, itm) => {
      const promo = get(itm, 'promotion', null);
      const price = get(itm.service || {}, 'price', 0);
      if (promo) {
        return total + this.calculatePriceDiscount(promo, 'serviceDiscountAmount', price);
      }
      return total + price;
    }, 0);
    const productsTotal = productItems.reduce((total, itm) => {
      const promo = get(itm, 'promotion', null);
      const price = get(itm.product || {}, 'price', 0);
      if (promo) {
        return total + this.calculatePriceDiscount(promo, 'productDiscountAmount', price);
      }
      return total + price;
    }, 0);
    return servicesTotal + productsTotal;
  }

  getStateFromProps = (props) => {
    const {
      queueDetailState: { appointment },
    } = this.props;
    const client = get(appointment, 'client', null);
    const services = get(appointment, 'services', []);
    const products = get(appointment, 'products', []);
    const productItems = products.map(product => ({
      itemId: uuid(),
      isDeleted: get(product, 'isDeleted', false),
      product: get(product, 'product', null),
      employee: get(product, 'employee', null),
      promotion: get(product, 'promotion', null),
    }));
    const serviceItems = services.map(service => ({
      itemId: uuid(),
      service,
      isDeleted: get(service, 'isDeleted', false),
      isProviderRequested: get(service, 'isProviderRequested', false),
      employee: service.isFirstAvailable ? {
        isFirstAvailable: true,
        name: 'First',
        lastName: 'Available',
      } : get(service, 'employee', null),
      promotion: get(service, 'promotion', null),
    }));
    return {
      client,
      appointment,
      serviceItems,
      productItems,
    };
  }

  getGroupLeaderName = (item) => {
    const { groups } = this.props;
    if (groups && groups[item.groupId]) { return groups[item.groupId].groupLeadName; }
    return 's';
  }

  getLabel = () => {
    const { getLabel = null } = this.props.navigation.state.params || {};
    return getLabel(styles.circularCountdown);
  }

  // getLabelForItem = (item) => {
  // switch (item.status) {
  //   case QUEUE_ITEM_FINISHED:
  //     return (
  //       <View style={styles.finishedContainer}>

  //         <View style={styles.finishedTime}>
  //           <View style={[styles.finishedTimeFlag, item.processTime > item.estimatedTime ? { backgroundColor: '#D1242A' } : null]} />
  //           <Text style={styles.finishedTimeText}>{this.getprocessMinutes(item)}min /
  //             <Text style={{ fontFamily: 'Roboto-Regular' }}>{this.getprogressMaxMinutes(item)}min est. </Text>
  //           </Text>
  //         </View>

  //         <View style={[styles.waitingTime, { backgroundColor: 'black', marginRight: 0 }]}>
  //           <Text style={[styles.waitingTimeTextTop, { color: 'white' }]}>FINISHED</Text>
  //         </View>
  //       </View>
  //     );
  //     break;
  //   case QUEUE_ITEM_RETURNING:
  //     return (
  //       <View style={styles.returningContainer}>
  //         <View style={[styles.waitingTime, { marginRight: 0, backgroundColor: 'black' }]}>
  //           <Text style={[styles.waitingTimeTextTop, { color: 'white' }]}>RETURNING</Text>
  //         </View>
  //       </View>
  //     );
  //   case QUEUE_ITEM_NOT_ARRIVED:
  //     return (
  //       <View style={styles.notArrivedContainer}>
  //         <View style={[styles.waitingTime, { marginRight: 0, flexDirection: 'row', backgroundColor: 'rgba(192,193,198,1)' }]}>
  //           <Text style={[styles.waitingTimeTextTop, { color: '#555' }]}>NOT ARRIVED </Text>
  //           <Icon name="circle" style={{ fontSize: 2, color: '#555' }} type="solid" />
  //           <Text style={[styles.waitingTimeTextTop, { color: '#D1242A' }]}> LATE</Text>
  //         </View>
  //       </View>
  //     );
  //   default:

  //     let processTime = moment(item.processTime, 'hh:mm:ss'),
  //       progressMaxTime = moment(item.progressMaxTime, 'hh:mm:ss'),
  //       estimatedTime = moment(item.estimatedTime, 'hh:mm:ss'),
  //       processMinutes = moment(item.processTime, 'hh:mm:ss').isValid()
  //         ? processTime.minutes() + processTime.hours() * 60
  //         : 0,
  //       progressMaxMinutes = moment(item.progressMaxTime, 'hh:mm:ss').isValid()
  //         ? progressMaxTime.minutes() + progressMaxTime.hours() * 60
  //         : 0,
  //       estimatedTimeMinutes = moment(item.estimatedTime, 'hh:mm:ss').isValid()
  //         ? estimatedTime.minutes() + estimatedTime.hours() * 60
  //         : 0;

  //     return (
  //       <CircularCountdown
  //         size={46}
  //         estimatedTime={progressMaxMinutes}
  //         processTime={processMinutes}
  //         itemStatus={item.status}
  //         style={styles.circularCountdown}
  //         queueType={item.queueType}
  //       />
  //     );
  // }
  // }

  getDiscountAmount = (promotion) => {
    switch (get(promotion, 'promotionType', null)) {
      case PromotionType.ServiceProductPercentOff:
      case PromotionType.GiftCardPercentOff:
        return `${get(promotion, 'prod', 0)} %`;
      case PromotionType.ServiceProductDollarOff:
      case PromotionType.GiftCardDollarOff:
      case PromotionType.ServiceProductFixedPrice:
        return `$ ${get(promotion, 'prod', 0)}`;
      default: return '';
    }
  }

  addServiceItem = ({ service, employee, promotion }) => {
    const serviceItems = cloneDeep(this.state.serviceItems);
    serviceItems.push({
      itemId: uuid(),
      isProviderRequested: get(service, 'isProviderRequested', true),
      service,
      employee,
      promotion,
    });
    this.setState({ serviceItems });
  }

  addProductItem = ({ product, employee, promotion }) => {
    const serviceItems = cloneDeep(this.state.serviceItems);
    serviceItems.push({
      itemId: uuid(),
      isProviderRequested: get(product, 'isProviderRequested', true),
      product,
      employee,
      promotion,
    });
    this.setState({ serviceItems });
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
    leftButton: <Text style={styles.headerButton}>Cancel</Text>,
    leftButtonOnPress: navigation => navigation.goBack(),
  })

  handleChangeClient = client => this.setState({ client })

  handleAddService = () => {
    const { client } = this.state;
    const clientName = `${get(client, 'name', '')} ${get(client, 'lastName', '')}`;
    this.props.navigation.navigate('Service', {
      clientName,
      dismissOnSelect: true,
      onSave: data => this.addServiceItem(data),
    });
  }

  handlePressService = (serviceItem) => {
    const { client } = this.state;
    const clientName = `${get(client, 'name', '')} ${get(client, 'lastName', '')}`;
    this.props.navigation.navigate('Service', {
      clientName,
      serviceItem,
      dismissOnSelect: true,
      onSave: data => this.updateServiceItem(serviceItem.itemId, data),
      onRemove: () => this.removeServiceItem(serviceItem.itemId),
    });
  }

  handleAddProduct = () => {
    const { client } = this.state;
    const clientName = `${get(client, 'name', '')} ${get(client, 'lastName', '')}`;
    this.props.navigation.navigate('Product', {
      client: this.state.appointment.client,
      dismissOnSelect: true,
      onChangeProduct: data => this.addProductItem(data),
    });
  }

  handlePressProduct = (productItem) => {
    const { client } = this.state;
    const clientName = `${get(client, 'name', '')} ${get(client, 'lastName', '')}`;
    this.props.navigation.navigate('Product', {
      clientName,
      productItem,
      dismissOnSelect: true,
      onSave: data => this.updateProductItem(productItem.itemId, data),
      onRemove: () => this.removeProductItem(productItem.itemId),
    });
  }

  updateServiceItem = (id, data) => {
    const serviceItems = cloneDeep(this.state.serviceItems);
    const index = serviceItems.findIndex(itm => itm.itemId === id);
    serviceItems.splice(index, 1, {
      itemId: serviceItems[index].itemId,
      ...serviceItems[index],
      ...data,
    });
    this.setState({ serviceItems });
  }

  updateServiceItem = (id, data) => {
    const serviceItems = cloneDeep(this.state.serviceItems);
    const index = serviceItems.findIndex(itm => itm.itemId === id);
    serviceItems.splice(index, 1, {
      itemId: serviceItems[index].itemId,
      ...serviceItems[index],
      ...data,
    });
    this.setState({ serviceItems });
  }

  removeServiceItem = (id) => {
    const serviceItems = cloneDeep(this.state.serviceItems);
    const index = serviceItems.findIndex(itm => itm.itemId === id);
    serviceItems.splice(index, 1);
    this.setState({ serviceItems });
  }

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

    if (this.props.appointment) {
      returned = this.props.appointment.status === StatusEnum.returningLater;
      isActiveWalkOut = !(this.props.appointment.queueType === QueueTypes.PosAppointment &&
        !(this.props.appointment.status === StatusEnum.checkedIn));

      isAppointment = this.props.appointment.queueType === QueueTypes.PosAppointment;

      if (this.props.appointment.status === StatusEnum.notArrived) {
        isDisabledReturnLater = true;
        isActiveCheckin = true;
      }

      if (this.props.appointment.status === StatusEnum.checkedIn ||
        this.props.appointment.status === StatusEnum.notArrived ||
        this.props.appointment.status === StatusEnum.returningLater
      ) {
        isDisabledStart = false;
      }

      if (isAppointment && this.props.appointment.status === StatusEnum.checkedIn) {
        isActiveUnCheckin = true;
      }

      if (this.props.appointment.status === StatusEnum.inService) {
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
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
          {isActiveUnCheckin ?
            <BottomButton icon="check" onPress={() => { this.props.onPressSummary.checkIn(isActiveCheckin); this.props.navigation.goBack(); }} title="Uncheck In" />
            :
            <BottomButton disabled={!isActiveCheckin} icon="check" onPress={() => { this.props.onPressSummary.checkIn(isActiveCheckin); this.props.navigation.goBack(); }} title="Check In" />
          }
          <BottomButton disabled={false} icon="signOut" onPress={() => { this.props.onPressSummary.walkOut(isActiveWalkOut); this.props.navigation.goBack(); }} title={isActiveWalkOut ? 'Walk-out' : 'No Show'} />
          <BottomButton disabled={isDisabledReturnLater} icon="history" onPress={() => { this.props.onPressSummary.returning(returned); this.props.navigation.goBack(); }} title={returned ? 'Returned' : 'Return later'} />
          <BottomButton disabled={isDisabledStart} icon="play" onPress={() => { this.props.onPressSummary.toService(); this.props.navigation.goBack(); }} title="To Service" />
        </View>
      );
    }
    return (
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>

        <BottomButton disabled={!isActiveWaiting} icon="hourglassHalf" onPress={() => { this.props.onPressSummary.toWaiting(); this.props.navigation.goBack(); }} title="To Waiting" />
        <BottomButton disabled={false} icon="undo" onPress={() => { this.props.onPressSummary.rebook(); this.props.navigation.goBack(); }} title="Rebook" />
        <BottomButton disabled={false} icon="checkSquare" onPress={() => { this.props.onPressSummary.finish(isActiveFinish); this.props.navigation.goBack(); }} title={isActiveFinish ? 'Finish' : 'Undo finish'} />
        <BottomButton disabled={false} icon="pldollaray" onPress={() => { this.props.onPressSummary.checkout(); this.props.navigation.goBack(); }} title="Checkout" />


      </View>
    );
  }

  render() {
    const {
      client,
      serviceItems,
      productItems,
    } = this.state;
    const {
      queueDetailState: {
        isLoading,
        appointment,
      },
    } = this.props;
    const badgeData = get(appointment, 'badgeData', []);
    const label = this.getLabel();
    const groupLeaderName = this.getGroupLeaderName(appointment);

    return (
      <View style={[styles.container]}>
        {
          isLoading || !appointment ?
            (
              <LoadingOverlay />
            ) : (
              <React.Fragment>
                <ScrollView style={{ marginBottom: 44 }}>
                  <View style={styles.infoContainer}>
                    <View style={{ flex: 1.5, alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                      <Text style={styles.infoTitleText}>Queue Appointment</Text>
                      <QueueTimeNote type="long" containerStyles={{ marginTop: 3 }} item={appointment} />
                      <View style={{ alignSelf: 'flex-start' }}>
                        <ServiceIcons
                          item={appointment}
                          badgeData={badgeData}
                          hideInitials
                          wrapperStyle={{ marginTop: 6 }}
                          align="flex-start"
                          direction="column"
                          groupLeaderName={groupLeaderName}
                        />
                      </View>
                    </View>
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
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
                        price={this.calculatePriceDiscount(item.promotion, 'serviceDiscountAmount', item.service.price)}
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
                        onPress={() => this.handlePressProduct(item, index)}
                        product={item.product}
                        employee={item.employee}
                        promotion={item.promotion}
                        isProviderRequested={item.isProviderRequested}
                        price={this.calculatePriceDiscount(item.promotion, 'productDiscountAmount', item.product.price)}
                      />
                    ))}
                    <AddButton onPress={this.handleAddProduct} title="Add Product" />
                    <View style={{ marginTop: 10, alignSelf: 'stretch', paddingHorizontal: 8 }}>
                      <InputButton
                        style={{
                          paddingTop: 22,
                          paddingRight: 5,
                        }}
                        iconStyle={{
                          fontSize: 22,
                          color: '#727A8F',
                          paddingTop: 12,
                        }}
                        labelStyle={{
                          color: '#4D5067',
                          fontSize: 14,
                          fontWeight: '500',
                        }}
                        label="Recommendations"
                        onPress={() => {
                          this.props.navigation.navigate('Recommendations');
                        }}
                      />
                      <SectionDivider style={{
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        borderBottomColor: '#C0C1C6',
                      }}
                      />
                    </View>
                    <View style={{
                      flexDirection: 'row',
                      marginTop: 23,
                      marginBottom: 15,
                      paddingHorizontal: 8,
                      justifyContent: 'space-between',
                    }}
                    >
                      <Text style={styles.totalLabel}>TOTAL</Text>
                      <Text style={styles.totalAmount}>{`$ ${this.totalPrice}`}</Text>
                    </View>
                  </View>
                </ScrollView>
                <SalonFixedBottom
                  backgroundColor="#727A8F"
                  rootStyle={{ minHeight: 44 }}
                  containerStyle={{ height: 44, paddingHorizontal: 0, paddingVertical: 0 }}
                >
                  {this.renderBtnContainer()}
                </SalonFixedBottom>
              </React.Fragment>
            )
        }
      </View>
    );
  }
}
AppointmentDetails.propTypes = {
  navigation: PropTypes.func.isRequired,
  isWaiting: PropTypes.any.isRequired,
  onPressSummary: PropTypes.any.isRequired,
  queueDetailState: PropTypes.shape({
    isLoading: PropTypes.bool,
    appointment: PropTypes.oneOfType([PropTypes.any, null]),
  }).isRequired,
  queueDetailActions: PropTypes.shape({
    updateAppointment: PropTypes.func,
  }).isRequired,
};
AppointmentDetails.defaultProps = {
};

const mapStateToProps = state => ({
  queueDetailState: state.queueDetailReducer,
});
const mapDispatchToProps = dispatch => ({
  queueDetailActions: bindActionCreators({ ...queueDetailActions }, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(AppointmentDetails);
