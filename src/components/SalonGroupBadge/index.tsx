import * as React from 'react';
import {View, Text} from 'react-native';
import PropTypes from 'prop-types';

import Icon from '@/components/common/Icon';
import styles from './styles';

const badge = ({text}) => (
  <View style={styles.container}>
    <Icon color="#082E66" size={12} name="userPlus" type="solid" />
    <Text style={styles.textStyle}>{text.toUpperCase ()}</Text>
    <View style={styles.dollarContainer}>
      <Icon color="#fff" size={10} name="dollar" type="solid" />
    </View>
  </View>
);

badge.propTypes = {
  text: PropTypes.string.isRequired,
};

export default badge;
