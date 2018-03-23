import React from 'react';
import { Image } from 'react-native';
import PropTypes from 'prop-types';

import iconCheckin from '../assets/images/icons/icon_checkin.png';
import iconWalkout from '../assets/images/icons/icon_walkout.png';
import iconModify from '../assets/images/icons/icon_modify.png';
import iconStartService from '../assets/images/icons/icon_start_service.png';
import iconReturning from '../assets/images/icons/icon_returning.png';
import iconClock from '../assets/images/icons/icon_clock.png';
import iconInfo from '../assets/images/icons/icon_info_circle.png';

const icons = {
  info: require('../assets/images/icons/icon_info.png'),
  caretRight: require('../assets/images/icons/icon_caret_right.png'),
  caretUp: require('../assets/images/icons/icon_caret_up.png'),
  caretDown: require('../assets/images/icons/icon_caret_down.png'),
  caretLetft: require('../assets/images/icons/icon_caret_left.png'),
  menu: require('../assets/images/icons/icon_menu.png'),
  filter: require('../assets/images/icons/icon_filter.png'),
  plus: require('../assets/images/icons/icon_plus_quantity.png'),
  search: require('../assets/images/icons/icon_search_w.png'),
  walkIn: require('../assets/images/icons/icon_walkin.png'),
  cross: require('../assets/images/icons/icon_cross.png'),
  microphone: require('../assets/images/icons/icon_microphone.png'),
  check: require('../assets/images/icons/icon_check.png'),
  dots: require('../assets/images/icons/icon_dots.png'),
  unchecked: require('../assets/images/icons/icon_unchecked.png'),
  checkin: iconCheckin,
  walkout: iconWalkout,
  returning: iconReturning,
  startService: iconStartService,
  modify: iconModify,
  clock: iconClock,
  iconInfo,
};

const SalonIcon = props => (
  <Image
    style={{
      height: 'size' in props ? props.size : 30,
      width: 'size' in props ? props.size : 30,
      tintColor: 'tintColor' in props ? props.tintColor : 'transparent',
      resizeMode: 'contain',
    }}
    {...props}
    source={icons[props.icon]}
  />
);

SalonIcon.propTypes = {
  size: PropTypes.number.isRequired,
  icon: PropTypes.string.isRequired,
  tintColor: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};
SalonIcon.defaultProps = {
  tintColor: 'transparent',
};
export default SalonIcon;
