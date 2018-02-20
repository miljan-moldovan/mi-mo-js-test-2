import React from 'react';
import { Image } from 'react-native';
import PropTypes from 'prop-types';

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
};

const SalonIcon = props => (
  <Image
    style={{
      height: props.size ? props.size : 30,
      width: props.size ? props.size : 30,
    }}
    {...props}
    source={icons[props.icon]}
  />
);

SalonIcon.propTypes = {
  size: PropTypes.number.isRequired,
  icon: PropTypes.string.isRequired,
};
export default SalonIcon;
