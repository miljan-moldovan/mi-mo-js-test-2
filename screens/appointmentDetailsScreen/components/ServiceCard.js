import React from 'react';
import {
  Text,
  View,
  StyleSheet,
} from 'react-native';
import { get } from 'lodash';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import SalonCard from '../../../components/SalonCard';
import SalonTouchableOpacity from '../../../components/SalonTouchableOpacity';
import SalonAvatar from '../../../components/SalonAvatar';
import Icon from '../../../components/UI/Icon';
import getEmployeePhotoSource from '../../../utilities/helpers/getEmployeePhotoSource';
import { Employees } from '../../../utilities/apiWrapper';
import styles from './AppointmentDetails/styles';
import { DefaultAvatar } from '../../../components/formHelpers';

const cardStyles = StyleSheet.create({
  body: { paddingHorizontal: 16, flexDirection: 'column', paddingVertical: 10 },
  noMargin: { marginHorizontal: 0 },
  container: { flex: 1, flexDirection: 'column', alignSelf: 'flex-start' },
  textRow: { flex: 1, flexDirection: 'row', alignSelf: 'flex-start' },
  priceText: { marginLeft: 5, color: '#FFA300' },
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 1,
    marginTop: 5,
  },
  providerText: { marginLeft: 8 },
});

class ServiceCard extends React.Component {
  state = {
    employee: null,
  };

  // componentDidMount() {
  //   const { employee: provider } = this.props.service;
  //   const employeeId = get(provider, 'id', null);
  //   Employees.getEmployee(employeeId)
  //     .then(employee => this.setState({ employee }));
  // }

  render() {
    const {
      onPress,
      service,
      employee,
      promotion,
    } = this.props;
    const name = get(service, 'name', get(service, 'serviceName', ''));
    const promoId = get(service, 'promoId', 0);
    const price = get(service, 'price', 0);
    const isProviderRequested = get(service, 'isProviderRequested', false);
    const providerName = !get(service, 'isFirstAvailable', false) ?
      `${get(employee, 'name', '')} ${get(employee, 'lastName', '')}` : 'First Available';
    return (
      <SalonCard
        backgroundColor="white"
        containerStyles={cardStyles.noMargin}
        bodyStyles={cardStyles.body}
        bodyChildren={
          <SalonTouchableOpacity
            style={cardStyles.container}
            onPress={onPress}
          >
            <View style={cardStyles.textRow}>
              <Text style={[styles.serviceTitle, styles.fullSize]}>{name}</Text>
              {
                promotion
                  ? (
                    <View style={styles.flexRow}>
                      <Text style={[styles.price, styles.lineThrough]}>{`$ ${price}`}</Text>
                      <Text style={[styles.price, cardStyles.priceText]}>$ 20</Text>
                    </View>
                  )
                  : (
                    <Text style={[styles.price]}>{`$ ${price}`}</Text>
                  )
              }
              <Icon
                size={20}
                color="#115ECD"
                name="angleRight"
                style={styles.caretIcon}
              />
            </View>
            <View style={[styles.fullSize, styles.flexRow]}>
              <View style={cardStyles.providerRow}>
                <SalonAvatar
                  hasBadge={isProviderRequested}
                  width={26}
                  borderColor="transparent"
                  wrapperStyle={styles.providerRound}
                  image={getEmployeePhotoSource(employee)}
                  badgeComponent={
                    isProviderRequested ?
                      <Icon
                        size={10}
                        name="lock"
                        type="solid"
                        color="#1DBF12"
                      />
                      : null
                  }
                  defaultComponent={
                    <DefaultAvatar
                      provider={employee}
                    />
                  }
                />
                <Text style={[styles.employeeText, cardStyles.providerText]}>{providerName}</Text>
              </View>
              {this.promoId > 0 && (
                <Text style={styles.promoDescription}>FIRST CUSTOMER -50%</Text>
              )}
            </View>
          </SalonTouchableOpacity>
        }
      />
    );
  }
}

export default ServiceCard;
