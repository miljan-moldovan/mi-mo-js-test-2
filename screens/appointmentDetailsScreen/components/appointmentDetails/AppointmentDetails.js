import React from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
} from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import AppointmentModel from '../../../../utilities/models/appointments';

import { QUEUE_ITEM_FINISHED, QUEUE_ITEM_RETURNING, QUEUE_ITEM_NOT_ARRIVED } from '../../../../constants/QueueStatus';
import CircularCountdown from '../../../../components/CircularCountdown';
import ServiceIcons from '../../../../components/ServiceIcons';
import SalonCard from '../../../../components/SalonCard';
import { InputButton, SectionDivider } from '../../../../components/formHelpers';
import SalonAvatar from '../../../../components/SalonAvatar';
import { SalonFixedBottom } from '../../../../components/SalonBtnFixedBottom';
import { getEmployeePhoto } from '../../../../utilities/apiWrapper';
import SalonTouchableOpacity from '../../../../components/SalonTouchableOpacity';
import QueueTimeNote from '../../../queueScreen/queueTimeNote';
import Icon from '../../../../components/UI/Icon';
import StatusEnum from '../../../../constants/Status';
import QueueTypes from '../../../../constants/QueueTypes';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F1F1',
  },
  serviceTimeContainer: {
    // fontSize: 12,
    // fontFamily: 'Roboto-Regular',
    // color: '#000',
    marginBottom: 8,
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'flex-start',
  },
  serviceRemainingWaitTime: {
    fontFamily: 'Roboto-Medium',
    fontSize: 11,
  },
  serviceTime: {
    // fontFamily: 'OpenSans-Bold',
  },
  serviceClockIcon: {
    fontSize: 12,
    // padding: 0,
    color: '#7E8D98',
    paddingRight: 7,
  },
  waitingTime: {
    marginRight: 15,
    alignItems: 'center',
    backgroundColor: 'rgba(17,10,36,1)',
    borderRadius: 4,
    borderColor: 'transparent',
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  circularCountdown: {
    marginRight: 5,
    marginTop: 3,
    alignItems: 'center',
  },
  waitingTimeTextTop: {
    fontSize: 10,
    fontFamily: 'OpenSans-Regular',
    color: '#999',
  },
  infoContainer: {
    backgroundColor: '#e2e9f1',
    borderBottomWidth: 1,
    borderBottomColor: '#C0C1C6',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 19,
    paddingTop: 13,
    minHeight: 123,
  },
  infoTitleText: {
    color: '#4D5067',
    fontSize: 9,
    lineHeight: 14,
    fontFamily: 'Roboto-Regular',
  },
  content: {
    paddingHorizontal: 8,
  },
  titleText: {
    marginTop: 23,
    color: '#4D5067',
    fontSize: 14,
    lineHeight: 18,
    marginLeft: 8,
    marginBottom: 5,
    fontFamily: 'Roboto-Medium',
  },
  serviceTitle: {
    fontSize: 14,
    lineHeight: 22,
    fontFamily: 'Roboto-Medium',
    color: 'black',
  },
  employeeText: {
    fontSize: 14,
    lineHeight: 22,
    fontFamily: 'Roboto-Medium',
    color: '#2F3142',
  },
  providerRound: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  caretIcon: {
    color: '#115ECD',
    fontSize: 20,
    lineHeight: 22,
    marginLeft: 10,
  },
  price: {
    fontSize: 14,
    lineHeight: 22,
    color: '#727A8F',
    fontFamily: 'Roboto-Regular',
    letterSpacing: 0,
  },
  addButtonText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#110A24',
    fontFamily: 'Roboto-Regular',
    marginLeft: 5,
  },
  timeCaretIcon: {
    fontSize: 12,
    marginHorizontal: 3,
  },
  promoDescription: {
    fontSize: 10,
    lineHeight: 14,
    color: '#FFA300',
    fontFamily: 'Roboto-Light',
  },
  lineThrough: {
    textDecorationLine: 'line-through',
  },
  totalLabel: {
    fontSize: 11,
    lineHeight: 16,
    color: '#C0C1C5',
    fontFamily: 'Roboto-Medium',
  },
  totalAmount: {
    fontSize: 16,
    lineHeight: 19,
    color: '#4D5067',
    fontFamily: 'Roboto-Medium',
  },
  bottomButtonWrapper: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomButtonIcon: {
    fontSize: 16,
    lineHeight: 16,
    color: 'white',
  },
  bottomButtonText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 10,
    lineHeight: 10,
    marginTop: 8,
  },
  apptLabel: {
    paddingLeft: 5,
    fontSize: 10,
    height: 10,
    width: 10,
    color: '#53646F',
  },
  notArrivedContainer: {
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    position: 'absolute',
    zIndex: 99999,
    right: 30,
    bottom: 5,
  },
  finishedContainer: {
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    position: 'absolute',
    zIndex: 99999,
    right: 30,
    bottom: 5,
  },
  finishedTime: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    height: 16,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  finishedTimeText: {
    fontSize: 9,
    fontFamily: 'Roboto-Medium',
    color: '#4D5067',
  },
  finishedTimeFlag: {
    backgroundColor: '#31CF48',
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'transparent',
  },
});

const caretRight = (
  <FontAwesome style={styles.timeCaretIcon}>{Icons.angleRight}</FontAwesome>
);

const ServiceCard = (props) => {
  const name = 'name' in props.service ? props.service.name : props.service.serviceName;
  const providerName = !props.service.isFirstAvailable ? `${props.service.employee.name} ${props.service.employee.lastName}` : 'First Available';

  return (
    <SalonCard
      backgroundColor="white"
      containerStyles={{ marginHorizontal: 0 }}
      bodyStyles={{ paddingHorizontal: 8, flexDirection: 'column', paddingVertical: 10 }}
      bodyChildren={[
        <SalonTouchableOpacity key={Math.random()} style={{ flex: 1, flexDirection: 'column', alignSelf: 'flex-start' }} onPress={props.onPress}>
          <View key={Math.random()} style={{ flex: 1, flexDirection: 'row', alignSelf: 'flex-start' }}>
            <Text style={[styles.serviceTitle, { flex: 1 }]}>
              {name}
            </Text>
            {props.service.promoId > 0
          ? (
            <View style={{ flexDirection: 'row' }}>
              <Text style={[styles.price, styles.lineThrough]}>{`$${props.service.price}`}</Text>
              <Text style={[styles.price, { marginLeft: 5, color: '#FFA300' }]}>$20</Text>
            </View>
          )
          : (
            <Text style={[styles.price]}>{`$${props.service.price}`}</Text>
          )
        }
            <FontAwesome style={styles.caretIcon}>{Icons.angleRight}</FontAwesome>
          </View>
          <View
            key={Math.random()}
            style={{
          flex: 1, flexDirection: 'row',
        }}
          >
            <View style={{
            flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', flex: 1, marginTop: 5,
            }}
            >
              <SalonAvatar
                wrapperStyle={styles.providerRound}
                width={26}
                borderWidth={1}
                borderColor="transparent"
                hasBadge
                badgeComponent={
                  <FontAwesome style={{
                  color: '#1DBF12', fontSize: 10,
                }}
                  >{Icons.lock}
                  </FontAwesome>
              }
                image={{ uri: getEmployeePhoto(!props.service.isFirstAvailable ? props.service.employeeId : 0) }}

              />
              <Text style={[styles.employeeText, { marginLeft: 8 }]}>{providerName}</Text>
            </View>
            {this.promoId > 0 && (
            <Text style={styles.promoDescription}>FIRST CUSTOMER -50%</Text>
        )}
          </View>
        </SalonTouchableOpacity>,
    ]}
    />
  );
};

const ProductCard = props => (
  <SalonCard
    backgroundColor="white"
    containerStyles={{ marginHorizontal: 0 }}
    bodyStyles={{ paddingHorizontal: 8, paddingVertical: 10 }}
    bodyChildren={[
      <SalonTouchableOpacity key={Math.random()} style={{ flex: 1, flexDirection: 'row', alignSelf: 'flex-start' }} onPress={props.onPress}>
        <View key={Math.random()} style={{ flex: 1, flexDirection: 'column', alignSelf: 'flex-start' }}>
          <Text style={styles.serviceTitle}>{props.product.product.name}</Text>
          <Text style={styles.employeeText}>{props.product.provider.fullName}</Text>
        </View>
        <View
          key={Math.random()}
          style={{
            flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignSelf: 'flex-start',
          }}
        >
          <View>
            <Text style={styles.price}>{props.product.product.price}</Text>
          </View>
          <View>
            <FontAwesome style={styles.caretIcon}>{Icons.angleRight}</FontAwesome>
          </View>
        </View>
      </SalonTouchableOpacity>,
    ]}
  />
);

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

    this.state = {
      appointment: this.props.appointment,
    };
  }

  getLabelForItem = (item) => {
    switch (item.status) {
      case QUEUE_ITEM_FINISHED:
        return (
          <View style={styles.finishedContainer}>
            <View style={[styles.waitingTime, { backgroundColor: 'black', marginRight: 0 }]}>
              <Text style={[styles.waitingTimeTextTop, { color: 'white' }]}>FINISHED</Text>
            </View>
            <View style={styles.finishedTime}>
              <View style={[styles.finishedTimeFlag, item.processTime > item.estimatedTime ? { backgroundColor: '#D1242A' } : null]} />
              <Text style={styles.finishedTimeText}>{(moment(item.processTime, 'hh:mm:ss').isValid()
                ? moment(item.processTime, 'hh:mm:ss').minutes() + moment(item.processTime, 'hh:mm:ss').hours() * 60
                : 0)}min / <Text style={{ fontFamily: 'Roboto-Regular' }}>{(moment(item.progressMaxTime, 'hh:mm:ss').isValid()
                  ? moment(item.progressMaxTime, 'hh:mm:ss').minutes() + moment(item.progressMaxTime, 'hh:mm:ss').hours() * 60
                  : 0)}min est.
                </Text>
              </Text>
            </View>
          </View>
        );
      case QUEUE_ITEM_RETURNING:
        return (
          <View style={[styles.waitingTime, { backgroundColor: 'black' }]}>
            <Text style={[styles.waitingTimeTextTop, { color: 'white' }]}>RETURNING</Text>
          </View>
        );
      case QUEUE_ITEM_NOT_ARRIVED:
        return (
          <View>
            <View style={[styles.waitingTime, { marginRight: 0, flexDirection: 'row', backgroundColor: 'rgba(192,193,198,1)' }]}>
              <Text style={[styles.waitingTimeTextTop, { color: '#555' }]}>NOT ARRIVED </Text>
              <Icon name="circle" style={{ fontSize: 2, color: '#555' }} type="solidFree" />
              <Text style={[styles.waitingTimeTextTop, { color: '#D1242A' }]}> LATE</Text>
            </View>
          </View>
        );
      default:

        let processTime = moment(item.processTime, 'hh:mm:ss'),
          progressMaxTime = moment(item.progressMaxTime, 'hh:mm:ss'),
          estimatedTime = moment(item.estimatedTime, 'hh:mm:ss'),
          processMinutes = moment(item.processTime, 'hh:mm:ss').isValid()
            ? processTime.minutes() + processTime.hours() * 60
            : 0,
          progressMaxMinutes = moment(item.progressMaxTime, 'hh:mm:ss').isValid()
            ? progressMaxTime.minutes() + progressMaxTime.hours() * 60
            : 0,
          estimatedTimeMinutes = moment(item.estimatedTime, 'hh:mm:ss').isValid()
            ? estimatedTime.minutes() + estimatedTime.hours() * 60
            : 0;

        return (
          <CircularCountdown
            size={50}
            estimatedTime={progressMaxMinutes}
            processTime={processMinutes}
            itemStatus={item.status}
            style={styles.circularCountdown}
            queueType={item.queueType}
          />
        );
    }
  }

  handleAddService = () => {
    this.props.navigation.navigate('Service', {
      client: this.state.appointment.client,
      services: this.state.appointment.services,
      appointment: this.state.appointment,
      dismissOnSelect: true,
      onChangeService: data => this.handleServiceSelection(data),
    });
  }

  handlePressService = (service, index) => {
    this.props.navigation.navigate('Service', {
      service,
      index,
      appointment: this.state.appointment,
      services: this.state.appointment.services,
      client: this.state.appointment.client,
      dismissOnSelect: true,
      onChangeService: data => this.handleServiceSelection(data),
    });
  }

  handleAddProduct = () => {
    this.props.navigation.navigate('Product', {
      client: this.state.appointment.client,

      dismissOnSelect: true,
      onChangeProduct: data => this.handleProductSelection(data),
    });
  }

  handlePressProduct = (product, index) => {
    this.props.navigation.navigate('Product', {
      product,
      index,
      client: this.state.appointment.client,
      dismissOnSelect: true,
      onChangeProduct: data => this.handleProductSelection(data),
    });
  }

  handleServiceSelection = (data) => {
    const { appointment } = this.state;
    appointment.services.push(data);
    this.setState({ appointment });
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


  getGroupLeaderName = (item: QueueItem) => {
    const { groups } = this.props;
    if (groups && groups[item.groupId]) { return groups[item.groupId].groupLeadName; }
    return 's';
  }


  render() {
    if (this.state.appointment === null) {
      return null;
    }
    const { appointmentDetailsState } = this.props;

    const { appointment } = this.state;
    const { client } = appointment;
    const label = this.getLabelForItem(appointment);
    const groupLeaderName = this.getGroupLeaderName(appointment);

    return (
      <View style={[styles.container]}>
        <ScrollView style={{ marginBottom: 44 }}>
          <View style={styles.infoContainer}>
            <View style={{ flex: 1.5, alignItems: 'flex-start', justifyContent: 'flex-start' }}>
              <Text style={styles.infoTitleText}>Queue Appointment</Text>
              <QueueTimeNote type="long" containerStyles={{ marginTop: 3 }} item={appointment} />
              <View style={{ alignSelf: 'flex-start' }}>
                <ServiceIcons badgeData={appointment.badgeData} hideInitials wrapperStyle={{ marginTop: 6 }} align="flex-start" direction="column" item={appointment} groupLeaderName={groupLeaderName} />
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
              containerStyles={{ marginHorizontal: 0 }}
              bodyStyles={{ paddingHorizontal: 8, paddingVertical: 0 }}
              bodyChildren={[
                <InputButton
                  key={Math.random()}
                  style={{
                    flex: 1, height: 40, paddingRight: 0, justifyContent: 'flex-start',
                  }}
                  label={<Text style={{ color: 'black', fontFamily: 'Roboto-Medium' }}>{client.fullName}</Text>}
                  onPress={() => alert('pressed')}
                />,
              ]}
            />
            <Text style={styles.titleText}>Services</Text>
            {this.state.appointment.services.map((item, index) => (
              <ServiceCard
                key={Math.random()}
                onPress={() => this.handlePressService(item, index)}
                service={item}
              />
            ))}
            <AddButton
              onPress={this.handleAddService}
              title="Add Service"
            />
            <Text style={styles.titleText}>Products</Text>
            {appointmentDetailsState.products.map((item, index) => (
              <ProductCard
                key={Math.random()}
                onPress={() => this.handlePressProduct(item, index)}
                product={item}
              />
            ))}
            <AddButton onPress={this.handleAddProduct} title="Add Product" />
            <View style={{ marginTop: 10, alignSelf: 'stretch', paddingHorizontal: 8 }}>
              <InputButton
                style={{
              //    marginTop: 20,
                  paddingTop: 22,
                  paddingRight: 5,
                  // borderBottomWidth: StyleSheet.hairlineWidth,
                  // borderBottomColor: '#C0C1C6',
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
              <Text style={styles.totalAmount}>{`$${appointment.totalPrice}`}</Text>
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
      </View>
    );
  }
}
AppointmentDetails.propTypes = {
  appointment: PropTypes.oneOfType([PropTypes.shape(AppointmentModel), PropTypes.string]),
};
AppointmentDetails.defaultProps = {
  appointment: null,
};

const mapStateToProps = (state, ownProps) => ({
  groups: state.queue.groups,
});

export default connect(mapStateToProps)(AppointmentDetails);
