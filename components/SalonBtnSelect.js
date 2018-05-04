import React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import PropTypes from 'prop-types';
import SalonTouchableOpacity from './SalonTouchableOpacity';

import arrow from '../assets/images/newClient/icon_arrow_right_xs.png';

const styles = StyleSheet.create({
  btnContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
  },
  textContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  text: {
    fontSize: 18,
    fontFamily: 'OpenSans-Regular',
    color: '#1D1D26',
  },
  title: {
    fontSize: 12,
    fontFamily: 'OpenSans-Regular',
    color: '#1D1D2680',
    top: 10,
    position: 'absolute',
  },

});

const salonBtnSelect = props => (
  <SalonTouchableOpacity
    onPress={props.onPress}
    style={styles.btnContainer}
  >
    <View style={styles.container}>
      {props.title ? <Text style={styles.title}>{props.title}</Text> : null }
      <View style={styles.textContainer}>
        <Text style={styles.text}>{props.selectedValue}</Text>
        <Image style={styles.image} source={arrow} />
      </View>
    </View>
  </SalonTouchableOpacity>
);

salonBtnSelect.propTypes = {
  selectedValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  title: PropTypes.string,
  onPress: PropTypes.func.isRequired,
};

salonBtnSelect.defaultProps = {
  title: '',
};

export default salonBtnSelect;
