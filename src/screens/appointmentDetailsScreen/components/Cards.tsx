import * as React from 'react';
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
import Icon from '@/components/common/Icon';
import getEmployeePhotoSource from '../../../utilities/helpers/getEmployeePhotoSource';
import { Employees } from '../../../utilities/apiWrapper';
import styles from './appointmentDetails/styles';
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
  productCardContainer: { flex: 1, flexDirection: 'column', alignSelf: 'flex-start' },
  promotionRow: {
    flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignSelf: 'flex-start',
  },

});

const Prices = ({ oldPrice, newPrice }) => (
  <View style={styles.flexRow}>
    <Text style={[styles.price, styles.lineThrough]}>{`$ ${oldPrice}`}</Text>
    <Text style={[styles.price, cardStyles.priceText]}>{`$ ${newPrice}`}</Text>
  </View>
);

const ServiceCard = (props) => {
  const {
    onPress,
    service,
    employee,
    promotion,
    price,
    withDiscount,
    isProviderRequested,
  } = props;
  const name = get(service, 'name', get(service, 'serviceName', ''));
  const providerName = !get(service, 'isFirstAvailable', false) ?
    `${get(employee, 'name', '')} ${get(employee, 'lastName', '')}` : 'First Available';
  const promoName = get(promotion, 'name', '');
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
                  <Prices oldPrice={price} newPrice={withDiscount} />
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
                width={26}
                borderColor="transparent"
                hasBadge={isProviderRequested}
                wrapperStyle={styles.providerRound}
                image={getEmployeePhotoSource(employee)}
                badgeComponent={
                  <Icon
                    size={10}
                    name="lock"
                    type="solid"
                    color="#1DBF12"
                  />
                }
                defaultComponent={
                  <DefaultAvatar
                    provider={employee}
                  />
                }
              />
              <Text style={[styles.employeeText, cardStyles.providerText]}>{providerName}</Text>
            </View>
            {promotion && (
              <Text style={styles.promoDescription}>{`${promoName.toUpperCase()}`}</Text>
            )}
          </View>
        </SalonTouchableOpacity>
      }
    />
  );
};

const ProductCard = (props) => {
  const {
    onPress,
    product,
    employee,
    promotion,
    price: withDiscount,
    isProviderRequested,
  } = props;
  const name = get(product, 'name', get(product, 'name', ''));
  const price = get(product, 'price', 0);
  const providerName = !get(employee, 'isFirstAvailable', false) ?
    `${get(employee, 'name', '')} ${get(employee, 'lastName', '')}` : 'First Available';
  const promoName = get(promotion, 'name', '');
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
                  <Prices oldPrice={price} newPrice={withDiscount} />
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
                width={26}
                borderColor="transparent"
                hasBadge={isProviderRequested}
                wrapperStyle={styles.providerRound}
                image={getEmployeePhotoSource(employee)}
                badgeComponent={
                  <Icon
                    size={10}
                    name="lock"
                    type="solid"
                    color="#1DBF12"
                  />
                }
                defaultComponent={
                  <DefaultAvatar
                    provider={employee}
                  />
                }
              />
              <Text style={[styles.employeeText, cardStyles.providerText]}>{providerName}</Text>
            </View>
            {promotion && (
              <Text style={styles.promoDescription}>{`${promoName.toUpperCase()}`}</Text>
            )}
          </View>
        </SalonTouchableOpacity>
      }
    />
  );
};

export {
  ServiceCard,
  ProductCard,
};
