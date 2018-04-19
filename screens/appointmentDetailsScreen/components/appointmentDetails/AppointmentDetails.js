import React from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
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
import { InputButton } from '../../../../components/formHelpers';
import SalonAvatar from '../../../../components/SalonAvatar';
import { SalonFixedBottom } from '../../../../components/SalonBtnFixedBottom';
import apiWrapper from '../../../../utilities/apiWrapper';

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
    textDecorationLine: 'underline',
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
    marginRight: 15,
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
    borderBottomColor: '#d3d9e0',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 19,
    minHeight: 123,
  },
  infoTitleText: {
    color: '#4D5067',
    fontSize: 9,
    lineHeight: 14,
    fontFamily: 'Roboto-Regular',
  },
  content: {
    paddingHorizontal: 16,
  },
  titleText: {
    marginTop: 24,
    color: '#4D5067',
    fontSize: 14,
    lineHeight: 18,
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
    color: '#2F3142',
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
    fontSize: 10,
    lineHeight: 11,
    marginTop: 7,
    color: 'white',
    fontFamily: 'Roboto-Light',
  },
});

const caretRight = (
  <FontAwesome style={styles.timeCaretIcon}>{Icons.angleRight}</FontAwesome>
);

const SalonAppointmentTime = (props) => {
  let estimatedTime = moment(props.appointment.estimatedTime, 'hh:mm:ss').isValid()
    ? moment(props.appointment.estimatedTime, 'hh:mm:ss').hours() * 60 + moment(props.appointment.estimatedTime, 'hh:mm:ss').minutes()
    : 0;

  if (props.appointment.estimatedTime && props.appointment.estimatedTime[0] === '-') {
    estimatedTime *= (-1);
  }

  const timeCheckedIn = props.appointment.status === 5 ? 0 : estimatedTime;
  return (<View style={[styles.serviceTimeContainer, { alignItems: 'center' }]}>
    <FontAwesome style={styles.serviceClockIcon}>{Icons.clockO}</FontAwesome>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text style={styles.serviceTime}> {moment(props.appointment.startTime, 'hh:mm:ss').format('LT')}</Text>
      {caretRight}
      <Text style={styles.serviceTime}>REM Wait</Text>
      <Text style={styles.serviceRemainingWaitTime}> {timeCheckedIn}m</Text>
    </View>
          </View>);
};
SalonAppointmentTime.propTypes = {
  appointment: PropTypes.shape(AppointmentModel).isRequired,
};

const ServiceCard = (props) => {
  const name = 'name' in props.service ? props.service.name : props.service.serviceName;
  const providerName = !props.service.isFirstAvailable ? `${props.service.employeeFirstName} ${props.service.employeeLastName}` : 'First Available';

  return (
    <SalonCard
      backgroundColor="white"
      containerStyles={{ marginHorizontal: 0 }}
      bodyStyles={{ flexDirection: 'column', paddingVertical: 10 }}
      bodyChildren={[
        <TouchableOpacity key={Math.random()} style={{ flex: 1, flexDirection: 'column', alignSelf: 'flex-start' }} onPress={props.onPress}>
          <View key={Math.random()} style={{ flex: 1, flexDirection: 'row', alignSelf: 'flex-start' }}>
            <Text style={[styles.serviceTitle, { flex: 1 }]}>
              {name}
            </Text>
            {props.service.promoId > 0
          ? (
            <View>
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
                image={{ uri: apiWrapper.getEmployeePhoto(!props.service.isFirstAvailable ? props.service.employeeId : 0) }}

              />
              <Text style={[styles.employeeText, { marginLeft: 8 }]}>{providerName}</Text>
            </View>
            {this.promoId > 0 && (
            <Text style={styles.promoDescription}>FIRST CUSTOMER -50%</Text>
        )}
          </View>
        </TouchableOpacity>,
    ]}
    />
  );
};

const ProductCard = props => (
  <SalonCard
    backgroundColor="white"
    containerStyles={{ marginHorizontal: 0 }}
    bodyStyles={{ paddingVertical: 10 }}
    bodyChildren={[
      <TouchableOpacity key={Math.random()} style={{ flex: 1, flexDirection: 'row', alignSelf: 'flex-start' }} onPress={props.onPress}>
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
      </TouchableOpacity>,
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
  <TouchableOpacity
    onPress={props.onPress}
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: 12,
    }}
  >
    <CircularIcon style={props.iconStyle} />
    <Text style={styles.addButtonText}> {props.title}</Text>
  </TouchableOpacity>
);
AddButton.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

const BottomButton = props => (
  <TouchableOpacity
    style={styles.bottomButtonWrapper}
    onPress={props.onPress}
    disabled={props.disabled}
  >
    <FontAwesome style={styles.bottomButtonIcon}>{Icons[props.icon]}</FontAwesome>
    <Text style={styles.bottomButtonText}>{props.title}</Text>
  </TouchableOpacity>
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
              <Text style={styles.finishedTimeText}>{item.processTime}min / <Text style={{ fontFamily: 'Roboto-Regular' }}>{item.estimatedTime}min est.</Text></Text>
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
          <View style={[styles.waitingTime, { backgroundColor: 'rgba(192,193,198,1)' }]}>
            <Text style={[styles.waitingTimeTextTop, { color: '#555' }]}>NOT ARRIVED</Text>
          </View>
        );
      default:

        console.log(JSON.stringify(item));

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
        console.log('processTime', moment(item.processTime, 'hh:mm:ss').isValid());
        console.log('processTime', processMinutes);
        console.log('progressMaxTime', moment(item.progressMaxTime, 'hh:mm:ss').isValid());
        console.log('progressMaxMinutes', progressMaxMinutes);
        console.log('estimatedTime', moment(item.estimatedTime, 'hh:mm:ss').isValid());
        console.log('estimatedTimeMinutes', estimatedTimeMinutes);
        console.log('status', item.status);

        return (
          <CircularCountdown
            size={58}
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
      dismissOnSelect: true,
      onChangeService: data => this.handleServiceSelection(data),
    });
  }

  handlePressService = (service, index) => {
    this.props.navigation.navigate('Service', {
      service,
      index,
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
    let isActiveCheckin,
      isDisabledCheckin;
    let isActiveReturnLater,
      isDisabledReturnLater;
    let returned;
    let isActiveWalkOut,
      isDisabledWalkOut;
    let isActiveStart,
      isDisabledStart;
    let isActiveWaiting,
      isActiveFinish = true;

    if (this.props.appointment) {
      isDisabledWalkOut = true;
      if (this.props.appointment.status === 0 || this.props.appointment.status === 1) {
        isActiveStart = true;
        isDisabledStart = false;
      } else {
        isDisabledStart = true;
      }
      returned = this.props.appointment.status === 5;
      isActiveWalkOut = !(this.props.appointment.queueType === 1);

      if (this.props.appointment.status === 1) {
        isDisabledReturnLater = true;
        isActiveCheckin = true;
      } else {
        isActiveReturnLater = true;
        isDisabledCheckin = true;
      }


      if (this.props.appointment.status === 6) {
        isActiveWaiting = true;
        isActiveFinish = true;
      } else {
        isActiveFinish = false;
        isActiveWaiting = false;
      }
    }
    const otherBtnStyle = styles.btnBottom;

    if (this.props.isWaiting) {
      return (
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
          <BottomButton disabled={!this.props.appointment.checkedIn} icon="check" onPress={() => { this.props.onPressSummary.checkIn(); this.props.navigation.goBack(); }} title="Check In" />
          <BottomButton disabled={false} icon="signOut" onPress={() => { this.props.onPressSummary.walkOut(isActiveWalkOut); this.props.navigation.goBack(); }} title={isActiveWalkOut ? 'Walk-out' : 'No Show'} />
          <BottomButton disabled={isDisabledReturnLater} icon="undo" onPress={() => { this.props.onPressSummary.returning(returned); this.props.navigation.goBack(); }} title={returned ? 'Returned' : 'Return later'} />
          <BottomButton disabled={returned} icon="play" onPress={() => { this.props.onPressSummary.toService(); this.props.navigation.goBack(); }} title="To Service" />
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
        <ScrollView style={{ marginBottom: 63 }}>
          <View style={styles.infoContainer}>
            <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'flex-start' }}>
              <Text style={styles.infoTitleText}>Queue Appointment</Text>
              <SalonAppointmentTime appointment={appointment} />
              <View style={{ alignSelf: 'flex-start' }}>
                <ServiceIcons direction="column" item={appointment} groupLeaderName={groupLeaderName} />
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
              bodyStyles={{ paddingVertical: 0 }}
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
            {appointmentDetailsState.services.map((item, index) => (
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
            <View style={{ alignSelf: 'stretch' }}>
              <InputButton
                style={{
                  paddingHorizontal: 5,
                  paddingVertical: 15,
                  borderBottomWidth: 1,
                  borderBottomColor: '#C0C1C6',
                }}
                label="Recommendations"
                onPress={() => {
                  this.props.navigation.navigate('Recommendations');
                }}
              />
            </View>
            <View style={{
              flexDirection: 'row',
              marginTop: 23,
              marginBottom: 15,
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
