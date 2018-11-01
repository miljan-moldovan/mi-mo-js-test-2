import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import moment from 'moment';
import { get } from 'lodash';
import FontAwesome, { Icons } from 'react-native-fontawesome';

import getEmployeePhotoSource from '../../../utilities/helpers/getEmployeePhotoSource';
import {
  ConflictBox,
} from '../../../components/slidePanels/SalonNewAppointmentSlide';
import { DefaultAvatar } from '../../../components/formHelpers';
import SalonTouchableOpacity from '../../../components/SalonTouchableOpacity';
import SalonCard from '../../../components/SalonCard';
import SalonAvatar from '../../../components/SalonAvatar';
import Icon from '../../../components/UI/Icon';
import Colors from '../../../constants/Colors';
import styles from '../styles';

const SetExtras = ({ onPress }) => {
  const marginRight = { marginRight: 12 };
  const textColor = { color: Colors.defaultBlue };
  return (
    <View style={[styles.removeGuestContainer, marginRight]}>
      <SalonTouchableOpacity
        style={styles.flexRow}
        onPress={onPress}
      >
        <Icon
          name="plusCircle"
          type="solid"
          color={Colors.defaultBlue}
          size={12}
        />
        <Text style={[styles.removeGuestText, textColor]}>SELECT EXTRAS</Text>
      </SalonTouchableOpacity>
    </View>
  );
};

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

const ServiceCard = (props) => {
  const { data } = props;
  const employee = get(data, 'employee', null);
  const isFirstAvailable = get(employee, 'isFirstAvailable', false);

  const serviceName = data.service.name || data.service.description;
  const showSelectExtras = (
    !props.isAddon &&
    (
      (data.service.addons && data.service.addons.length > 0) ||
      (data.service.recommendedServices && data.service.recommendedServices.length > 0) ||
      (data.service.requiredServices && data.service.requiredServices.length > 1)
    )
  );


  return (
    <React.Fragment>

      <SalonTouchableOpacity
        onPress={props.onPress}
      >
        <SalonCard
          key={props.id}
          containerStyles={{ marginVertical: 0, marginBottom: 10 }}
          bodyStyles={{ paddingTop: 7, paddingBottom: 13 }}
          backgroundColor="white"
          bodyChildren={
            <View style={{ flex: 1, flexDirection: 'column' }}>
              <View style={{ flexDirection: 'row' }}>
                {props.isAddon && (
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
                  <Text style={[styles.serviceTitle, props.conflicts.length > 0 ? { color: 'red' } : {}]}>
                    {serviceName}
                  </Text>
                  {props.isRequired && (
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
                  <ServiceInfo price={data.service.price} waitTime={`${moment.duration(data.length).asMinutes()} min`} />
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
                  image={getEmployeePhotoSource(employee)}
                  defaultComponent={(
                    <DefaultAvatar
                      size={24}
                      provider={employee}
                    />
                  )}
                />
                <Text
                  style={{
                    fontSize: 14,
                    lineHeight: 22,
                    color: props.conflicts.length > 0 ? 'red' : '#2F3142',
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
                  from={moment(data.fromTime, 'hh:mm').format('hh:mm A')}
                  to={moment(data.toTime, 'hh:mm').format('hh:mm A')}
                />
                {showSelectExtras && (
                  <SetExtras onPress={props.onSetExtras} />
                )}
                {
                !props.hideDelete &&
                <SalonTouchableOpacity onPress={props.onPressDelete}>
                  <Icon
                    name="trashAlt"
                    size={12}
                    color="#D1242A"
                    type="regular"
                  />
                </SalonTouchableOpacity>
              }
              </View>
            </View>
          }
        />
      </SalonTouchableOpacity>
      {props.conflicts.length > 0 && (
        <ConflictBox
          style={{
            marginHorizontal: 10,
            marginTop: 0,
            marginBottom: 10,
          }}
          onPress={() => props.onPressConflicts()}
        />
      )}
    </React.Fragment>
  );
};

export default ServiceCard;
