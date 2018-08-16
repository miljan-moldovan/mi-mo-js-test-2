import React from 'react';
import { View, Text } from 'react-native';
import moment from 'moment';
import PropTypes from 'prop-types';

import SalonAvatar from '../../../components/SalonAvatar';
import Icon from '../../../components/UI/Icon';
import { DefaultAvatar } from '../../../components/formHelpers';
import colors from '../../../constants/appointmentColors';
import styles from './styles';
import SalonTouchableOpacity from '../../../components/SalonTouchableOpacity';

class Card extends React.PureComponent {
  render() {
    const {
      start, end, storeName,
      employeeName, serviceDescription,
    } = this.props.item;
    const providerName = employeeName ? employeeName.split(' ') : ['L', 'A'];
    const provider = {
      name: providerName[0],
      lastName: providerName[1],
      isFirstAvailable: !employeeName,
    };
    const borderColor = colors[4].dark;
    const startMoment = moment(start, 'HH:mm');
    const endMoment = moment(end, 'HH:mm');
    return (
      <SalonTouchableOpacity onPress={this.props.onPress}>
        <View style={styles.card}>
          <View style={styles.timeContainer}>
            <Text style={styles.startText}>{startMoment.format('hh:mm a')}</Text>
            <Text style={styles.endText}>{endMoment.format('hh:mm a')}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.body}>
            <Text style={styles.serviceText}>{serviceDescription}</Text>
            <View style={styles.apptContainer}>
              <SalonAvatar
                wrapperStyle={styles.avatarStyle}
                width={26}
                borderWidth={3}
                borderColor={borderColor}
                image={{ uri: '' }}
                defaultComponent={(
                  <DefaultAvatar
                    size={26}
                    provider={provider}
                  />
              )}
              />
              <Text style={styles.employeeText}>{employeeName}</Text>
            </View>
            <Text style={styles.storeText}>{storeName}</Text>
          </View>
          <Icon name="chevronRight" style={styles.angleRight} type="solid" />
        </View>
      </SalonTouchableOpacity>
    );
  }
}

Card.propTypes = {
  onPress: PropTypes.func.isRequired,
  item: PropTypes.arrayOf(PropTypes.shape({
    start: PropTypes.string,
    end: PropTypes.string,
    serviceDescription: PropTypes.string,
    storeName: PropTypes.string,
    employeeName: PropTypes.string,
  })).isRequired,
};

export default Card;
