import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import { getEmployeePhoto } from '../../../utilities/apiWrapper/api';

import SalonTouchableOpacity from '../../../components/SalonTouchableOpacity';
import SalonCard from '../../../components/SalonCard';
import SalonAvatar from '../../../components/SalonAvatar';
import Icon from '../../../components/UI/Icon';

import { styles } from '../NewAppointmentScreen';

const ServiceInfo = props => (
  <Text style={styles.serviceInfo}>
    <Text style={{ fontFamily: 'Roboto-Medium' }}>{props.waitTime}</Text>
    <Text style={{ fontSize: 13 }}>  |  </Text>
    <Text style={{ fontFamily: 'Roboto-Medium' }}>$ {props.price}</Text>
  </Text>
);

const SalonAppointmentTime = props => (
  <View style={[styles.serviceTimeContainer, { alignItems: 'center' }]}>
    <Icon
      size={12}
      color="#727A8F"
      name="clockO"
      type="light"
      style={{ marginRight: 5 }}
    />
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text style={styles.serviceTime}>{props.from}</Text>
      <Icon
        name="longArrowRight"
        size={11}
        color="#727A8F"
        type="light"
        style={{ marginHorizontal: 5 }}
      />
      <Text style={styles.serviceTime}>{props.to}</Text>
    </View>
  </View>
);

export class ServiceCard extends React.Component {
  render() {
    const { data } = this.props;
    const employee = data.employee || null;
    const isFirstAvailable = data.isFirstAvailable || false;
    const employeePhoto = getEmployeePhoto(isFirstAvailable ? 0 : employee.id);
    return ([
      <SalonTouchableOpacity
        onPress={this.props.onPress}
      >
        <SalonCard
          key={this.props.id}
          containerStyles={{ marginVertical: 0, marginBottom: 10 }}
          bodyStyles={{ paddingTop: 7, paddingBottom: 13 }}
          backgroundColor="white"
          bodyChildren={
            <View style={{ flex: 1, flexDirection: 'column' }}>
              <View style={{ flexDirection: 'row' }}>
                {this.props.isAddon && (
                  <Icon
                    style={{
                      marginRight: 10,
                      transform: [{ rotate: '90deg' }],
                    }}
                    name="levelUp"
                    type="regular"
                    color="black"
                    size={12}
                  />
                )}
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                  }}
                >
                  <Text style={[styles.serviceTitle, this.props.hasConflicts ? { color: 'red' } : {}]}>
                    {data.service.name}
                  </Text>
                  {this.props.isRequired && (
                    <Text style={{
                      fontSize: 10,
                      marginLeft: 6,
                      color: '#1DBF12',
                    }}
                    >
                      REQUIRED
                    </Text>
                  )}
                </View>
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                }}
                >
                  <ServiceInfo price={data.service.price} waitTime={`${moment.duration(data.service.maxDuration).asMinutes()} min`} />
                  <FontAwesome style={{
                    color: '#115ECD',
                    fontSize: 20,
                    marginLeft: 15,
                  }}
                  >{Icons.angleRight}
                  </FontAwesome>
                </View>
              </View>
              <View style={{
                flexDirection: 'row', marginTop: 5, alignItems: 'center', justifyContent: 'flex-start',
              }}
              >
                <SalonAvatar
                  wrapperStyle={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 10,
                  }}
                  width={26}
                  borderWidth={1}
                  borderColor="transparent"
                  hasBadge={data.requested}
                  badgeComponent={
                    <FontAwesome style={{
                      color: '#1DBF12', fontSize: 10,
                    }}
                    >{Icons.lock}
                    </FontAwesome>
                  }
                  image={{ uri: employeePhoto }}
                  defaultComponent={<ActivityIndicator />}
                />
                <Text
                  style={{
                    fontSize: 14,
                    lineHeight: 22,
                    color: this.props.hasConflicts ? 'red' : '#2F3142',
                  }}
                >{isFirstAvailable ? 'First Available' : `${employee.name} ${employee.lastName}`}
                </Text>
              </View>
              <View style={{
                height: 1, alignSelf: 'stretch', backgroundColor: '#E0EAF7', marginVertical: 7,
              }}
              />
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <SalonAppointmentTime
                  from={moment(data.fromTime, 'HH:mm').format('HH:mm A')}
                  to={moment(data.toTime, 'HH:mm').format('HH:mm A')}
                />
                <SalonTouchableOpacity onPress={this.props.onPressDelete}>
                  <Icon
                    name="trashAlt"
                    size={12}
                    color="#D1242A"
                    type="regular"
                  />
                </SalonTouchableOpacity>
              </View>
            </View>
          }
        />
      </SalonTouchableOpacity>,
    ]);
  }
}

const mapStateToProps = (state, props) => ({

});
const mapActionsToProps = () => dispatch => ({

});
export default connect(
  mapStateToProps,
  mapActionsToProps,
)(ServiceCard);
